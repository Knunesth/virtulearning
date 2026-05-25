import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { addXP } from '../../utils/xp';

export async function enrollmentsRoutes(fastify: FastifyInstance) {
  // ── POST /enrollments — Aluno: enroll in a course ─────────────────────────
  fastify.post('/', {
    preHandler: [requireAuth, requireRole('aluno', 'professor', 'admin')],
    schema: { tags: ['enrollments'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { curso_id } = req.body as { curso_id: number };
    if (!curso_id) return reply.status(400).send({ error: 'curso_id é obrigatório.' });

    const course = await prisma.course.findUnique({ where: { id: curso_id, status: 'publicado' } });
    if (!course) return reply.status(404).send({ error: 'Curso não encontrado.' });

    const existing = await prisma.enrollment.findUnique({
      where: { aluno_id_curso_id: { aluno_id: req.user!.sub, curso_id } },
    });
    if (existing) return reply.status(409).send({ error: 'Você já está matriculado neste curso.' });

    const enrollment = await prisma.enrollment.create({
      data: { aluno_id: req.user!.sub, curso_id },
    });

    return reply.status(201).send(enrollment);
  });

  // ── GET /enrollments/my — Aluno: list own enrollments ─────────────────────
  fastify.get('/my', {
    preHandler: [requireAuth],
    schema: { tags: ['enrollments'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const querySchema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(50).default(10)
    });
    
    const parse = querySchema.safeParse(req.query);
    if (!parse.success) return reply.status(400).send({ error: 'Parâmetros de paginação inválidos.' });

    const { page, limit } = parse.data;
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { aluno_id: req.user!.sub },
        skip,
        take: limit,
        include: {
          curso: {
            include: {
              professor: { select: { id: true, nome: true } },
              _count: { select: { modulos: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.enrollment.count({ where: { aluno_id: req.user!.sub } })
    ]);

    return reply.send({
      data: enrollments,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  });

  // ── PATCH /enrollments/:id/progress — Aluno: update progress ──────────────
  fastify.patch('/:id/progress', {
    preHandler: [requireAuth],
    schema: { tags: ['enrollments'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { id }        = req.params as { id: string };
    const { progresso } = req.body as { progresso: number };

    if (typeof progresso !== 'number' || progresso < 0 || progresso > 100) {
      return reply.status(400).send({ error: 'Progresso deve ser entre 0 e 100.' });
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: { id: parseInt(id), aluno_id: req.user!.sub },
    });
    if (!enrollment) return reply.status(404).send({ error: 'Matrícula não encontrada.' });

    const wasAlreadyCompleted = enrollment.progresso === 100;

    const updated = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progresso,
        status: progresso === 100 ? 'concluida' : 'ativa',
      },
    });

    if (progresso === 100 && !wasAlreadyCompleted) {
      await addXP(req.user!.sub, 'curso_concluido', 200);
    }

    return reply.send(updated);
  });
}
