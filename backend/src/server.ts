// ==============================================================================
// SERVER.TS — Entry point do VirtuLearning Backend
// ==============================================================================

import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCookie from '@fastify/cookie';

import { authRoutes }         from './modules/auth/auth.routes';
import { usersRoutes }        from './modules/users/users.routes';
import { coursesRoutes }      from './modules/courses/courses.routes';
import { applicationsRoutes } from './modules/applications/applications.routes';
import { enrollmentsRoutes }  from './modules/enrollments/enrollments.routes';
import { messagesRoutes }     from './modules/messages/messages.routes';

import prisma from './config/prisma';

const PORT = parseInt(process.env.PORT || '3001');
const isDev = process.env.NODE_ENV !== 'production';

const app = Fastify({
  logger: {
    level: isDev ? 'info' : 'warn',
    ...(isDev && {
      transport: { target: 'pino-pretty', options: { colorize: true } },
    }),
  },
  trustProxy: true,  // Needed for correct IP behind reverse proxies
});

async function bootstrap() {
  // ── 1. Security: Helmet (HTTP headers) ──────────────────────────────────────
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc:   ["'self'", "'unsafe-inline'"],
        imgSrc:     ["'self'", 'data:', 'https:'],
        scriptSrc:  ["'self'"],
      },
    },
  });

  // ── 2. Security: CORS ────────────────────────────────────────────────────────
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('CORS: Origem não permitida.'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ── 3. Security: Rate Limiting ───────────────────────────────────────────────
  await app.register(fastifyRateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      error: 'Muitas requisições. Aguarde um momento e tente novamente.',
    }),
  });

  // ── 4. Cookies (for refresh token) ──────────────────────────────────────────
  await app.register(fastifyCookie, {
    secret: process.env.JWT_REFRESH_SECRET!, // Signs cookies for extra integrity
  });

  // ── 5. Stricter rate limit for auth routes ───────────────────────────────────
  // (Applied at the route level as a scope override)

  // ── 6. Health Check ──────────────────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  }));

  // ── 7. Register API modules ──────────────────────────────────────────────────
  await app.register(authRoutes,         { prefix: '/api/auth' });
  await app.register(usersRoutes,        { prefix: '/api/users' });
  await app.register(coursesRoutes,      { prefix: '/api/courses' });
  await app.register(applicationsRoutes, { prefix: '/api/applications' });
  await app.register(enrollmentsRoutes,  { prefix: '/api/enrollments' });
  await app.register(messagesRoutes,     { prefix: '/api/messages' });

  // ── 8. Global error handler ───────────────────────────────────────────────────
  app.setErrorHandler((error, req, reply) => {
    app.log.error(error);

    // Zod/Prisma validation errors — don't expose internals in production
    if (isDev) {
      return reply.status(error.statusCode || 500).send({ error: error.message, stack: error.stack });
    }

    // Production: generic message for 5xx
    if (!error.statusCode || error.statusCode >= 500) {
      return reply.status(500).send({ error: 'Erro interno do servidor.' });
    }

    return reply.status(error.statusCode).send({ error: error.message });
  });

  // ── 9. Start server ───────────────────────────────────────────────────────────
  try {
    await prisma.$connect();
    app.log.info('✅ Conectado ao banco de dados TiDB');
  } catch (e) {
    app.log.error('❌ Falha ao conectar ao banco de dados:', e);
    process.exit(1);
  }

  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`🚀 VirtuLearning API rodando em http://localhost:${PORT}`);
  app.log.info(`📋 Health check: http://localhost:${PORT}/health`);
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  app.log.info('🛑 Encerrando servidor...');
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
