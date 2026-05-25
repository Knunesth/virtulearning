// ==============================================================================
// SERVER.TS — Entry point do VirtuLearning Backend
// ==============================================================================

import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { startKeepAlive } from './utils/keepAlive';

import { authRoutes }         from './modules/auth/auth.routes';
import { usersRoutes }        from './modules/users/users.routes';
import { coursesRoutes }      from './modules/courses/courses.routes';
import { applicationsRoutes } from './modules/applications/applications.routes';
import { enrollmentsRoutes }  from './modules/enrollments/enrollments.routes';
import { messagesRoutes }     from './modules/messages/messages.routes';
import { lessonsRoutes }      from './modules/lessons/lessons.routes';
import { quizzesRoutes }      from './modules/quizzes/quizzes.routes';
import { rankingRoutes }      from './modules/ranking/ranking.routes';
import { statsRoutes }        from './modules/stats/stats.routes';

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
  const defaultOrigins = 'http://localhost:5173,https://virtulearning-tlhx.vercel.app';
  const allowedOrigins = (process.env.FRONTEND_URL || defaultOrigins).split(',');
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

  // ── 6. Swagger / OpenAPI ───────────────────────────────────────────────────────
  await app.register(swagger, {
    openapi: {
      info: { title: 'VirtuLearning API', version: '1.0.0' },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        }
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list' }
  });

  // ── 7. Health Check ──────────────────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  }));

  // ── 8. Register API modules ──────────────────────────────────────────────────
  await app.register(authRoutes,         { prefix: '/api/auth' });
  await app.register(usersRoutes,        { prefix: '/api/users' });
  await app.register(coursesRoutes,      { prefix: '/api/courses' });
  await app.register(applicationsRoutes, { prefix: '/api/applications' });
  await app.register(enrollmentsRoutes,  { prefix: '/api/enrollments' });
  await app.register(messagesRoutes,     { prefix: '/api/messages' });
  // Módulos e aulas: rotas mistas em /api/courses/:id/modules, /api/modules/:id e /api/lessons/:id
  await app.register(lessonsRoutes,      { prefix: '/api' });
  await app.register(quizzesRoutes,      { prefix: '/api' });
  await app.register(rankingRoutes,      { prefix: '/api/ranking' });
  await app.register(statsRoutes,        { prefix: '/api' });

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
    app.log.error({ err: e }, '❌ Falha ao conectar ao banco de dados.');
    process.exit(1);
  }

  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`🚀 VirtuLearning API rodando em http://localhost:${PORT}`);
  app.log.info(`📋 Health check: http://localhost:${PORT}/health`);

  const appUrl = process.env.RENDER_EXTERNAL_URL || 'https://virtulearning-back.onrender.com';
  startKeepAlive(appUrl);
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
