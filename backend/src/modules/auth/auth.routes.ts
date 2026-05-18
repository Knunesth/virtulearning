import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../config/jwt';
import { requireAuth } from '../../middleware/auth';

const ROUNDS         = parseInt(process.env.BCRYPT_ROUNDS || '12');
const MAX_ATTEMPTS   = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
const LOCKOUT_MIN    = parseInt(process.env.LOCKOUT_DURATION_MINUTES || '15');

// Schemas de validação
const registerSchema = z.object({
  nome:  z.string().min(2).max(120),
  email: z.string().email(),
  senha: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um símbolo'),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

// Sanitize user (never return password hash)
const sanitize = (user: any) => {
  const { senha_hash, refresh_token_hash, login_tentativas, bloqueado_ate, ...safe } = user;
  return safe;
};

export async function authRoutes(fastify: FastifyInstance) {
  // ── POST /auth/register ───────────────────────────────────────────────────
  fastify.post('/register', async (req, reply) => {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });
    }
    const { nome, email, senha } = parse.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(409).send({ error: 'Este e-mail já está cadastrado.' });
    }

    const senha_hash = await bcrypt.hash(senha, ROUNDS);
    const user = await prisma.user.create({
      data: { nome, email, senha_hash },
    });

    return reply.status(201).send({ message: 'Cadastro realizado. Faça login.', user: sanitize(user) });
  });

  // ── POST /auth/login ──────────────────────────────────────────────────────
  fastify.post('/login', async (req, reply) => {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Dados inválidos.' });
    }
    const { email, senha } = parse.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // Generic message to prevent user enumeration
    if (!user) {
      return reply.status(401).send({ error: 'E-mail ou senha incorretos.' });
    }

    // Check account lockout
    if (user.bloqueado_ate && user.bloqueado_ate > new Date()) {
      const remaining = Math.ceil((user.bloqueado_ate.getTime() - Date.now()) / 60000);
      return reply.status(429).send({
        error: `Conta temporariamente bloqueada por ${remaining} minuto(s) devido a múltiplas tentativas falhas.`,
      });
    }

    if (user.status === 'suspenso') {
      return reply.status(403).send({ error: 'Sua conta está suspensa. Entre em contato com o suporte.' });
    }

    const isValid = await bcrypt.compare(senha, user.senha_hash);
    if (!isValid) {
      const attempts = user.login_tentativas + 1;
      const shouldLock = attempts >= MAX_ATTEMPTS;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          login_tentativas: attempts,
          bloqueado_ate: shouldLock
            ? new Date(Date.now() + LOCKOUT_MIN * 60 * 1000)
            : undefined,
        },
      });

      if (shouldLock) {
        return reply.status(429).send({
          error: `Muitas tentativas falhas. Conta bloqueada por ${LOCKOUT_MIN} minutos.`,
        });
      }

      const left = MAX_ATTEMPTS - attempts;
      return reply.status(401).send({
        error: `E-mail ou senha incorretos. ${left} tentativa(s) restante(s).`,
      });
    }

    // Successful login — reset attempt counter
    const payload = { sub: user.id, email: user.email, role: user.tipo_usuario, tenantId: user.tenant_id };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { login_tentativas: 0, bloqueado_ate: null, refresh_token_hash: refreshHash, ultimo_login: new Date() },
    });

    // Refresh token in HttpOnly cookie (inaccessible to JS)
    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return reply.send({ accessToken, user: sanitize(user) });
  });

  // ── POST /auth/refresh ────────────────────────────────────────────────────
  fastify.post('/refresh', async (req, reply) => {
    const token = req.cookies?.refresh_token;
    if (!token) return reply.status(401).send({ error: 'Refresh token não encontrado.' });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return reply.status(401).send({ error: 'Refresh token inválido ou expirado. Faça login novamente.' });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.refresh_token_hash) {
      return reply.status(401).send({ error: 'Sessão inválida.' });
    }

    const isValid = await bcrypt.compare(token, user.refresh_token_hash);
    if (!isValid) {
      // Possible token theft — revoke
      await prisma.user.update({ where: { id: user.id }, data: { refresh_token_hash: null } });
      return reply.status(401).send({ error: 'Sessão comprometida. Faça login novamente.' });
    }

    const newPayload    = { sub: user.id, email: user.email, role: user.tipo_usuario, tenantId: user.tenant_id };
    const newAccess     = signAccessToken(newPayload);
    const newRefresh    = signRefreshToken(newPayload);
    const newRefreshHash = await bcrypt.hash(newRefresh, 10);

    await prisma.user.update({ where: { id: user.id }, data: { refresh_token_hash: newRefreshHash } });

    reply.setCookie('refresh_token', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({ accessToken: newAccess });
  });

  // ── GET /auth/me ──────────────────────────────────────────────────────────
  fastify.get('/me', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) return reply.status(404).send({ error: 'Usuário não encontrado.' });
    return reply.send({ user: sanitize(user) });
  });

  // ── POST /auth/logout ─────────────────────────────────────────────────────
  fastify.post('/logout', { preHandler: [requireAuth] }, async (req, reply) => {
    await prisma.user.update({
      where: { id: req.user!.sub },
      data: { refresh_token_hash: null },
    });
    reply.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    return reply.send({ message: 'Logout realizado com sucesso.' });
  });
}
