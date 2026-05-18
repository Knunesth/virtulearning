import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';

const sanitize = (u: any) => {
  const { senha_hash, refresh_token_hash, ...safe } = u;
  return safe;
};

export async function usersRoutes(fastify: FastifyInstance) {
  // ── GET /users — Admin: list all users with filters ────────────────────────
  fastify.get('/', {
    preHandler: [requireAuth, requireRole('admin')],
  }, async (req, reply) => {
    const query = req.query as { role?: string; status?: string; search?: string; page?: string; limit?: string };
    const page  = parseInt(query.page  || '1');
    const limit = parseInt(query.limit || '20');
    const skip  = (page - 1) * limit;

    const where: any = {};
    if (query.role)   where.tipo_usuario = query.role;
    if (query.status) where.status = query.status;
    if (query.search) where.OR = [
      { nome:  { contains: query.search } },
      { email: { contains: query.search } },
    ];

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' } }),
      prisma.user.count({ where }),
    ]);

    return reply.send({ data: users.map(sanitize), total, page, pages: Math.ceil(total / limit) });
  });

  // ── GET /users/:id — Admin: get a single user ──────────────────────────────
  fastify.get('/:id', {
    preHandler: [requireAuth, requireRole('admin')],
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return reply.status(404).send({ error: 'Usuário não encontrado.' });
    return reply.send(sanitize(user));
  });

  // ── PATCH /users/:id/role — Admin: change user role ───────────────────────
  fastify.patch('/:id/role', {
    preHandler: [requireAuth, requireRole('admin')],
  }, async (req, reply) => {
    const { id }   = req.params as { id: string };
    const schema   = z.object({ role: z.enum(['aluno', 'professor', 'admin']) });
    const parse    = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Role inválido.' });

    const { role } = parse.data;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { tipo_usuario: role as any },
    });

    await auditLog(req.user!.sub, 'ALTERAR_CARGO', user.email, req, `Cargo alterado para: ${role}`);
    return reply.send({ message: 'Cargo atualizado.', user: sanitize(user) });
  });

  // ── PATCH /users/:id/status — Admin: suspend or activate ─────────────────
  fastify.patch('/:id/status', {
    preHandler: [requireAuth, requireRole('admin')],
  }, async (req, reply) => {
    const { id }     = req.params as { id: string };
    const schema     = z.object({ status: z.enum(['ativo', 'suspenso']) });
    const parse      = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Status inválido.' });

    const { status } = parse.data;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status: status as any },
    });

    await auditLog(req.user!.sub, status === 'suspenso' ? 'SUSPENDER_USUARIO' : 'REATIVAR_USUARIO', user.email, req);
    return reply.send({ message: `Usuário ${status}.`, user: sanitize(user) });
  });

  // ── GET /users/profile — Self: logged-in user updates their profile ────────
  fastify.put('/profile', {
    preHandler: [requireAuth],
  }, async (req, reply) => {
    const schema = z.object({
      nome:        z.string().min(2).max(120).optional(),
      bio:         z.string().max(500).optional(),
      telefone:    z.string().max(20).optional(),
      linkedin_url:z.string().url().optional().or(z.literal('')),
      nickname:    z.string().min(2).max(60).optional(),
      avatar_url:  z.string().url().optional().or(z.literal('')),
    });

    const parse = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });

    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: parse.data,
    });

    return reply.send({ message: 'Perfil atualizado.', user: sanitize(user) });
  });
}
