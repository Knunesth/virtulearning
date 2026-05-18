import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth } from '../../middleware/auth';

export async function messagesRoutes(fastify: FastifyInstance) {
  // ── GET /messages/conversations — Professor: list conversation threads ─────
  fastify.get('/conversations', {
    preHandler: [requireAuth],
  }, async (req, reply) => {
    const userId = req.user!.sub;

    // Get unique conversations (distinct aluno_id + professor_id pairs)
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ aluno_id: userId }, { professor_id: userId }],
      },
      distinct: ['aluno_id', 'professor_id'],
      orderBy: { created_at: 'desc' },
      include: {
        remetente: { select: { id: true, nome: true, avatar_url: true } },
      },
    });

    return reply.send(messages);
  });

  // ── GET /messages/:professsorId/:alunoId — Get thread messages ────────────
  fastify.get('/:professorId/:alunoId', {
    preHandler: [requireAuth],
  }, async (req, reply) => {
    const { professorId, alunoId } = req.params as { professorId: string; alunoId: string };
    const userId = req.user!.sub;

    // Ensure the requester is part of the conversation
    const pId = parseInt(professorId);
    const aId = parseInt(alunoId);
    if (userId !== pId && userId !== aId) {
      return reply.status(403).send({ error: 'Acesso negado.' });
    }

    const messages = await prisma.message.findMany({
      where: { professor_id: pId, aluno_id: aId },
      orderBy: { created_at: 'asc' },
    });

    // Mark as read
    await prisma.message.updateMany({
      where: { professor_id: pId, aluno_id: aId, aluno_id: { not: userId } },
      data: { lida: true },
    });

    return reply.send(messages);
  });

  // ── POST /messages — Send a message ───────────────────────────────────────
  fastify.post('/', {
    preHandler: [requireAuth],
  }, async (req, reply) => {
    const schema = z.object({
      professor_id: z.number().int(),
      aluno_id:     z.number().int(),
      texto:        z.string().min(1).max(2000),
      sender:       z.enum(['aluno', 'professor']),
      curso_id:     z.number().int().optional(),
    });

    const parse = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });

    const { professor_id, aluno_id, texto, sender, curso_id } = parse.data;

    // Verify user is sending as themselves
    const userId = req.user!.sub;
    if (sender === 'aluno' && userId !== aluno_id) {
      return reply.status(403).send({ error: 'Não é possível enviar mensagens como outro usuário.' });
    }
    if (sender === 'professor' && userId !== professor_id) {
      return reply.status(403).send({ error: 'Não é possível enviar mensagens como outro professor.' });
    }

    const message = await prisma.message.create({
      data: { professor_id, aluno_id, texto, sender: sender as any, curso_id },
    });

    return reply.status(201).send(message);
  });
}
