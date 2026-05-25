import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';

export async function applicationsRoutes(fastify: FastifyInstance) {
  // ── POST /applications — Public: submit a teacher application ─────────────
  fastify.post('/', {
    schema: { tags: ['applications'] }
  }, async (req, reply) => {
    const schema = z.object({
      nome:               z.string().min(2).max(120),
      email:              z.string().email(),
      especialidade:      z.string().min(2).max(120),
      linkedin_url:       z.string().url().optional(),
      bio:                z.string().min(20),
      cursos_pretendidos: z.string().optional(),
      anos_experiencia:   z.number().int().min(0).max(50),
    });

    const parse = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });

    const { nome, email, ...appData } = parse.data;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create a temporary account (pendente_verificacao)
      user = await prisma.user.create({
        data: {
          nome,
          email,
          senha_hash: '', // Will be set when approved
          status: 'pendente_verificacao' as any,
        },
      });
    }

    // Check for duplicate application
    const existing = await prisma.teacherApplication.findUnique({ where: { user_id: user.id } });
    if (existing) {
      return reply.status(409).send({ error: 'Você já enviou uma candidatura.' });
    }

    const application = await prisma.teacherApplication.create({
      data: { user_id: user.id, ...appData },
    });

    return reply.status(201).send({ message: 'Candidatura enviada com sucesso!', application });
  });

  // ── GET /applications — Admin: list all applications ─────────────────────
  fastify.get('/', {
    preHandler: [requireAuth, requireRole('admin')],
    schema: { tags: ['applications'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const query = req.query as { status?: string };
    const where: any = {};
    if (query.status) where.status = query.status;

    const apps = await prisma.teacherApplication.findMany({
      where,
      include: { solicitante: { select: { id: true, nome: true, email: true } } },
      orderBy: { created_at: 'desc' },
    });

    return reply.send(apps);
  });

  // ── PATCH /applications/:id — Admin: approve or reject ────────────────────
  fastify.patch('/:id', {
    preHandler: [requireAuth, requireRole('admin')],
    schema: { tags: ['applications'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { id }   = req.params as { id: string };
    const schema   = z.object({
      status:           z.enum(['aprovado', 'rejeitado']),
      motivo_rejeicao:  z.string().optional(),
    });
    const parse = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'Dados inválidos.' });

    const app = await prisma.teacherApplication.findUnique({
      where: { id: parseInt(id) },
      include: { solicitante: true },
    });
    if (!app) return reply.status(404).send({ error: 'Candidatura não encontrada.' });

    const { status, motivo_rejeicao } = parse.data;

    let inviteLink: string | null = null;
    let hashedToken: string | null = null;
    let expiresAt: Date | null = null;

    if (status === 'aprovado') {
      const rawToken = crypto.randomUUID();
      hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
      inviteLink = '/set-password?token=' + rawToken;
    }

    await prisma.$transaction([
      prisma.teacherApplication.update({
        where: { id: app.id },
        data: {
          status: status as any,
          revisado_por: req.user!.sub,
          revisado_em: new Date(),
          motivo_rejeicao: motivo_rejeicao ?? null,
        },
      }),
      // If approved, promote user to professor and set invite token
      ...(status === 'aprovado'
        ? [prisma.user.update({
            where: { id: app.user_id },
            data: { 
              tipo_usuario: 'professor', 
              status: 'ativo' as any,
              invite_token: hashedToken,
              invite_token_expires: expiresAt,
            },
          })]
        : []),
    ]);

    await auditLog(
      req.user!.sub,
      status === 'aprovado' ? 'APROVAR_CANDIDATURA' : 'REJEITAR_CANDIDATURA',
      app.solicitante.email,
      req,
      motivo_rejeicao
    );

    // TODO: substituir o retorno do link por envio de email (nodemailer/resend)
    return reply.send({ 
      message: `Candidatura ${status}.`,
      ...(inviteLink && { inviteLink })
    });
  });
}
