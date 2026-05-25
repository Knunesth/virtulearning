import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../config/jwt';
import { requireAuth } from '../../middleware/auth';
import { sendVerificationEmail } from '../../utils/mailer';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { senha_hash, refresh_token_hash, login_tentativas, bloqueado_ate, ...safeUser } = user;
  return safeUser;
};

export async function authRoutes(fastify: FastifyInstance) {
  // ── POST /auth/register ───────────────────────────────────────────────────
  fastify.post('/register', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '1 hour',
        keyGenerator: (req) => req.ip,
        errorResponseBuilder: () => ({ error: 'Muitos cadastros deste IP. Aguarde 1 hora.' }),
      },
    },
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome:  { type: 'string' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 8 }
        }
      }
    }
  }, async (req, reply) => {
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
    
    const rawToken = crypto.randomUUID();
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await prisma.user.create({
      data: { 
        nome, 
        email, 
        senha_hash,
        email_verificado: true,
        verification_token: hashedToken,
        verification_token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
    });

    // Dispara o envio do email de forma assíncrona se o EMAIL_USER estiver configurado
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      sendVerificationEmail(email, nome, rawToken);
    }

    return reply.status(201).send({ 
      message: 'Cadastro realizado. Verifique seu e-mail.', 
      user: sanitize(user)
    });
  });

  // ── POST /auth/login ──────────────────────────────────────────────────────
  fastify.post('/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
        keyGenerator: (req) => req.ip,
        errorResponseBuilder: () => ({ error: 'Muitas tentativas de login. Aguarde 15 minutos.' }),
      },
    },
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email:  { type: 'string', format: 'email' },
          senha:  { type: 'string', minLength: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id:            { type: 'number' },
                tenant_id:     { type: 'number', nullable: true },
                nome:          { type: 'string' },
                email:         { type: 'string' },
                tipo_usuario:  { type: 'string' },
                avatar_url:    { type: 'string', nullable: true },
                bio:           { type: 'string', nullable: true },
                nickname:      { type: 'string', nullable: true },
                telefone:      { type: 'string', nullable: true },
                linkedin_url:  { type: 'string', nullable: true }
              }
            }
          }
        }
      }
    }
  }, async (req, reply) => {
    try {
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

        // Log de segurança: tentativa de login falhada
        console.warn(
          `[SECURITY] Login falho: email=${email} | tentativas=${attempts} | ` +
          `bloqueado=${shouldLock} | IP=${req.ip}`
        );

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
    } catch (err) {
      console.error('[LOGIN ERROR]', err);
      return reply.status(500).send({ error: 'Erro interno no servidor', detail: String(err) });
    }
  });

  // ── POST /auth/refresh ────────────────────────────────────────────────────
  fastify.post('/refresh', {
    schema: {
      tags: ['auth'],
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' }
          }
        }
      }
    }
  }, async (req, reply) => {
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
  fastify.get('/me', {
    preHandler: [requireAuth],
    schema: {
      tags: ['auth'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id:            { type: 'number' },
                tenant_id:     { type: 'number', nullable: true },
                nome:          { type: 'string' },
                email:         { type: 'string' },
                tipo_usuario:  { type: 'string' },
                avatar_url:    { type: 'string', nullable: true },
                bio:           { type: 'string', nullable: true },
                nickname:      { type: 'string', nullable: true },
                telefone:      { type: 'string', nullable: true },
                linkedin_url:  { type: 'string', nullable: true }
              }
            }
          }
        }
      }
    }
  }, async (req, reply) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) return reply.status(404).send({ error: 'Usuário não encontrado.' });
    return reply.send({ user: sanitize(user) });
  });

  // ── POST /auth/set-password ───────────────────────────────────────────────
  fastify.post('/set-password', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 hour',
        keyGenerator: (req) => req.ip,
        errorResponseBuilder: () => ({ error: 'Muitas tentativas. Aguarde 1 hora.' }),
      },
    },
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 8 }
        }
      }
    }
  }, async (req, reply) => {
    const schema = z.object({
      token: z.string().min(1),
      password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres')
    });

    const parse = schema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });
    }

    const { token, password } = parse.data;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        invite_token: hashedToken,
        invite_token_expires: { gt: new Date() }
      }
    });

    if (!user) {
      return reply.status(400).send({ error: 'Token inválido ou expirado.' });
    }

    const senha_hash = await bcrypt.hash(password, ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        senha_hash,
        invite_token: null,
        invite_token_expires: null
      }
    });

    return reply.send({ message: 'Senha definida com sucesso. Faça login.' });
  });

  // ── GET /auth/verify-email ────────────────────────────────────────────────
  fastify.get('/verify-email', {
    schema: {
      tags: ['auth'],
      querystring: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' }
        }
      }
    }
  }, async (req, reply) => {
    const schema = z.object({ token: z.string().min(1) });
    const parse = schema.safeParse(req.query);
    if (!parse.success) return reply.status(400).send({ error: 'Token inválido.' });

    const { token } = parse.data;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        verification_token: hashedToken,
        verification_token_expires: { gt: new Date() }
      }
    });

    if (!user) {
      return reply.status(400).send({ error: 'Token inválido ou expirado.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verificado: true,
        verification_token: null,
        verification_token_expires: null
      }
    });

    return reply.send({ message: 'Email verificado com sucesso.' });
  });

  // ── POST /auth/forgot-password ────────────────────────────────────────────
  fastify.post('/forgot-password', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '1 hour',
        keyGenerator: (req) => req.ip,
        errorResponseBuilder: () => ({ error: 'Muitas solicitações. Aguarde 1 hora.' }),
      },
    },
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      }
    }
  }, async (req, reply) => {
    // Delay fixo de 500ms para prevenir timing attacks (não revela se o email existe)
    await new Promise(resolve => setTimeout(resolve, 500));

    const schema = z.object({ email: z.string().email() });
    const parse = schema.safeParse(req.body);
    if (!parse.success) return reply.status(400).send({ error: 'E-mail inválido.' });

    const { email } = parse.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // Sempre retornar a mesma mensagem — não vaza se o email existe ou não
    const MSG = 'Se este e-mail estiver cadastrado, você receberá um link de recuperação.';

    if (!user) {
      return reply.send({ message: MSG });
    }

    const rawToken = crypto.randomUUID();
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: hashedToken,
        reset_token_expires: new Date(Date.now() + 60 * 60 * 1000)
      }
    });

    // (Opcional) Enviar email de reset de senha
    // const resetLink = `/reset-password?token=${rawToken}`;
    // await sendResetPasswordEmail(user.email, user.nome, resetLink);

    return reply.send({ message: MSG });
  });

  // ── POST /auth/reset-password ─────────────────────────────────────────────
  fastify.post('/reset-password', {
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 8 }
        }
      }
    }
  }, async (req, reply) => {
    const schema = z.object({
      token: z.string().min(1),
      password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
        .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um símbolo')
    });

    const parse = schema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });
    }

    const { token, password } = parse.data;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        reset_token: hashedToken,
        reset_token_expires: { gt: new Date() }
      }
    });

    if (!user) {
      return reply.status(400).send({ error: 'Token inválido ou expirado.' });
    }

    const senha_hash = await bcrypt.hash(password, ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        senha_hash,
        reset_token: null,
        reset_token_expires: null
      }
    });

    return reply.send({ message: 'Senha redefinida com sucesso. Faça login.' });
  });

  // ── POST /auth/logout ─────────────────────────────────────────────────────
  fastify.post('/logout', {
    preHandler: [requireAuth],
    schema: {
      tags: ['auth'],
      security: [{ bearerAuth: [] }]
    }
  }, async (req, reply) => {
    await prisma.user.update({
      where: { id: req.user!.sub },
      data: { refresh_token_hash: null },
    });
    reply.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    return reply.send({ message: 'Logout realizado com sucesso.' });
  });
}
