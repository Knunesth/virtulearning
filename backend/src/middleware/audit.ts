import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../config/prisma';

// Logs all admin actions to the audit_logs table
export async function auditLog(
  adminId: number,
  acao: string,
  alvo: string,
  req: FastifyRequest,
  detalhes?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        admin_id: adminId,
        acao,
        alvo,
        detalhes: detalhes ?? null,
        ip: req.ip,
      },
    });
  } catch (err) {
    // Non-blocking: audit failures should not break the request
    console.error('[AUDIT] Falha ao registrar log:', err);
  }
}
