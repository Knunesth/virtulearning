import { FastifyInstance } from 'fastify';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';

export async function enrollmentsRoutes(fastify: FastifyInstance) {
  // ── POST /enrollments — Aluno: enroll in a course ─────────────────────────
  fastify.post('/', {
    preHandler: [requireAuth, requireRole('aluno')],
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
  }, async (req, reply) => {
    const enrollments = await prisma.enrollment.findMany({
      where: { aluno_id: req.user!.sub },
      include: {
        curso: {
          include: {
            professor: { select: { id: true, nome: true } },
            _count: { select: { modulos: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return reply.send(enrollments);
  });

  // ── PATCH /enrollments/:id/progress — Aluno: update progress ──────────────
  fastify.patch('/:id/progress', {
    preHandler: [requireAuth],
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

    const updated = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progresso,
        status: progresso === 100 ? 'concluida' : 'ativa',
      },
    });

    return reply.send(updated);
  });
}
