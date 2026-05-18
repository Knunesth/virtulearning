import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';

export async function coursesRoutes(fastify: FastifyInstance) {
  // ── GET /courses — Public: list published courses ─────────────────────────
  fastify.get('/', async (req, reply) => {
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

  // ── GET /courses/:id — Public: get course details ─────────────────────────
  fastify.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        professor: { select: { id: true, nome: true, avatar_url: true, bio: true } },
        modulos: {
          orderBy: { ordem: 'asc' },
          include: { aulas: { orderBy: { ordem: 'asc' } } },
        },
        _count: { select: { matriculas: true } },
      },
    });

    if (!course || (course.status !== 'publicado')) {
      return reply.status(404).send({ error: 'Curso não encontrado.' });
    }

    return reply.send(course);
  });

  // ── POST /courses — Professor: create a course ────────────────────────────
  fastify.post('/', {
    preHandler: [requireAuth, requireRole('professor', 'admin')],
  }, async (req, reply) => {
    const schema = z.object({
      titulo:        z.string().min(5).max(200),
      descricao:     z.string().min(10),
      preco:         z.number().min(0),
      thumbnail:     z.string().url().optional(),
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
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return reply.status(404).send({ error: 'Curso não encontrado.' });

    // Professor can only edit own courses; admin can edit any
    if (req.user!.role !== 'admin' && course.professor_id !== req.user!.sub) {
      return reply.status(403).send({ error: 'Você não tem permissão para editar este curso.' });
    }

    const schema = z.object({
      titulo:        z.string().min(5).max(200).optional(),
      descricao:     z.string().min(10).optional(),
      preco:         z.number().min(0).optional(),
      thumbnail:     z.string().url().optional(),
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
