import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken, JwtPayload } from '../config/jwt';

// Extends the Fastify request with the decoded user
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

// ── requireAuth ───────────────────────────────────────────────────────────────
// Validates the Bearer token in the Authorization header.
// Attach decoded payload to request.user for downstream handlers.
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyAccessToken(token);
  } catch {
    return reply.status(401).send({ error: 'Token inválido ou expirado. Faça login novamente.' });
  }
}

// ── requireRole ───────────────────────────────────────────────────────────────
// Factory that returns a preHandler verifying the user has one of the allowed roles.
// Usage: { preHandler: [requireAuth, requireRole('admin')] }
export function requireRole(...roles: string[]) {
  return async function (req: FastifyRequest, reply: FastifyReply) {
    if (!req.user || !roles.includes(req.user.role)) {
      return reply.status(403).send({
        error: 'Acesso negado. Você não tem permissão para esta ação.',
      });
    }
  };
}
