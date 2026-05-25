import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';

export async function coursesRoutes(fastify: FastifyInstance) {
  // ── GET /courses — Public: list published courses ─────────────────────────
  fastify.get('/', {
    schema: {
      tags: ['courses'],
      response: {
        200: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { type: 'object', additionalProperties: true } },
            total: { type: 'number' },
            page: { type: 'number' },
            pages: { type: 'number' }
          }
        }
      }
    }
  }, async (req, reply) => {
    const query = req.query as { search?: string; nivel?: string; page?: string; limit?: string };
    const page  = parseInt(query.page  || '1');
    const limit = parseInt(query.limit || '12');
    const skip  = (page - 1) * limit;

    const where: any = { status: 'publicado' };
    if (query.nivel)  where.nivel = query.nivel;
    if (query.search) where.OR = [
      { titulo:    { contains: query.search } },
      { descricao: { contains: query.search } },
    ];

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          professor: { select: { id: true, nome: true, avatar_url: true } },
          _count: { select: { matriculas: true, modulos: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return reply.send({ data: courses, total, page, pages: Math.ceil(total / limit) });
  });

  // ── GET /courses/my — Professor: list own courses (including drafts) ──────
  fastify.get('/my', {
    preHandler: [requireAuth, requireRole('professor', 'admin')],
    schema: {
      tags: ['courses'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    const courses = await prisma.course.findMany({
      where: { professor_id: req.user!.sub },
      orderBy: { created_at: 'desc' },
      include: {
        professor: { select: { id: true, nome: true, avatar_url: true } },
        _count: { select: { matriculas: true, modulos: true } },
      },
    });

    return reply.send({ data: courses, total: courses.length, page: 1, pages: 1 });
  });

  // ── GET /courses/:id — Public: get course details ─────────────────────────
  fastify.get('/:id', {
    schema: {
      tags: ['courses'],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } }
      }
    }
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const courseId = parseInt(id);
    if (isNaN(courseId)) return reply.status(400).send({ error: 'id inválido.' });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        professor: { select: { id: true, nome: true, avatar_url: true, bio: true } },
        modulos: {
          orderBy: { ordem: 'asc' },
          include: {
            aulas: {
              orderBy: { ordem: 'asc' },
              // descricao incluída automaticamente (todos os campos do modelo)
            },
            _count: { select: { aulas: true } },
          },
        },
        _count: { select: { matriculas: true } },
      },
    });

    if (!course) {
      return reply.status(404).send({ error: 'Curso não encontrado.' });
    }

    // Cursos publicados: acesso público.
    // Cursos não-publicados: apenas o professor dono ou admin pode ver.
    if (course.status !== 'publicado') {
      // Verifica autenticação inline (sem lançar erro; só nega)
      let userId: number | null = null;
      let userRole: string | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const { verifyAccessToken } = await import('../../config/jwt');
          const payload = verifyAccessToken(authHeader.split(' ')[1]);
          userId   = payload.sub;
          userRole = payload.role;
        } catch { /* token inválido — trata como anônimo */ }
      }

      const isOwner = userId === course.professor_id;
      const isAdmin = userRole === 'admin';
      if (!isOwner && !isAdmin) {
        return reply.status(404).send({ error: 'Curso não encontrado.' });
      }
    }

    return reply.send(course);
  });

  // ── GET /courses/:id/progress — Aluno: get lesson progress for a course ───
  fastify.get('/:id/progress', {
    preHandler: [requireAuth],
    schema: {
      tags: ['courses'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const courseId = parseInt(id);
    if (isNaN(courseId)) return reply.status(400).send({ error: 'id inválido.' });

    const progress = await prisma.lessonProgress.findMany({
      where: {
        user_id: req.user!.sub,
        lesson: { modulo: { curso_id: courseId } }
      },
      select: { lesson_id: true }
    });

    return reply.send(progress.map(p => p.lesson_id));
  });


  // ── POST /courses — Professor: create a course ────────────────────────────
  fastify.post('/', {
    preHandler: [requireAuth, requireRole('professor', 'admin')],
    schema: {
      tags: ['courses'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    const schema = z.object({
      titulo:        z.string().min(3).max(200),
      descricao:     z.string().min(3),
      preco:         z.number().min(0),
      thumbnail:     z.string().optional(),
      nivel:         z.enum(['iniciante', 'intermediario', 'avancado']).default('iniciante'),
      duracao_horas: z.number().int().min(0).optional(),
    });

    const parse = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });

    const course = await prisma.course.create({
      data: { ...parse.data, professor_id: req.user!.sub },
    });

    return reply.status(201).send(course);
  });

  // ── PUT /courses/:id — Professor: update own course ───────────────────────
  fastify.put('/:id', {
    preHandler: [requireAuth, requireRole('professor', 'admin')],
    schema: {
      tags: ['courses'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return reply.status(404).send({ error: 'Curso não encontrado.' });

    // Professor can only edit own courses; admin can edit any
    if (req.user!.role !== 'admin' && course.professor_id !== req.user!.sub) {
      return reply.status(403).send({ error: 'Você não tem permissão para editar este curso.' });
    }

    const schema = z.object({
      titulo:        z.string().min(3).max(200).optional(),
      descricao:     z.string().min(3).optional(),
      preco:         z.number().min(0).optional(),
      thumbnail:     z.string().optional(),
      nivel:         z.enum(['iniciante', 'intermediario', 'avancado']).optional(),
      status:        z.enum(['rascunho', 'publicado']).optional(),
      duracao_horas: z.number().int().min(0).optional(),
    });

    const parse = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });

    const updated = await prisma.course.update({ where: { id: parseInt(id) }, data: parse.data });
    return reply.send(updated);
  });

  // ── PATCH /courses/:id/status — Admin: moderate course ────────────────────
  fastify.patch('/:id/status', {
    preHandler: [requireAuth, requireRole('admin')],
    schema: {
      tags: ['courses'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    const { id }   = req.params as { id: string };
    const schema   = z.object({ status: z.enum(['publicado', 'suspenso', 'arquivado']) });
    const parse    = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Status inválido.' });

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { status: parse.data.status as any },
    });

    await auditLog(req.user!.sub, 'MODERAR_CURSO', course.titulo, req, `Status: ${parse.data.status}`);
    return reply.send(course);
  });

  // ── DELETE /courses/:id — Admin only ──────────────────────────────────────
  fastify.delete('/:id', {
    preHandler: [requireAuth, requireRole('admin')],
    schema: {
      tags: ['courses'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return reply.status(404).send({ error: 'Curso não encontrado.' });

    await prisma.course.update({ where: { id: parseInt(id) }, data: { status: 'arquivado' } });
    await auditLog(req.user!.sub, 'ARQUIVAR_CURSO', course.titulo, req);
    return reply.send({ message: 'Curso arquivado com sucesso.' });
  });

  // ── GET /courses/admin/all — Admin: list all courses including non-published
  fastify.get('/admin/all', {
    preHandler: [requireAuth, requireRole('admin')],
    schema: {
      tags: ['courses'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    const courses = await prisma.course.findMany({
      include: {
        professor: { select: { id: true, nome: true } },
        _count: { select: { matriculas: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    return reply.send(courses);
  });
}
