import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth } from '../../middleware/auth';

export async function rankingRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/', {
    schema: { tags: ['ranking'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const querySchema = z.object({
      page: z.string().optional().default('1'),
      limit: z.string().optional().default('20')
    });

    const query = querySchema.parse(req.query);
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skip = (page - 1) * limit;

    const total = await prisma.user.count({ where: { tipo_usuario: 'aluno' } });
    const users = await prisma.user.findMany({
      where: { tipo_usuario: 'aluno' },
      orderBy: { xp: 'desc' },
      select: { id: true, nome: true, avatar_url: true, xp: true },
      skip,
      take: limit
    });

    const user = (req as any).user;
    
    // Descobrir a posição do usuário logado
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { xp: true, tipo_usuario: true }
    });

    let currentUserPosition = null;
    if (currentUser && currentUser.tipo_usuario === 'aluno') {
      const usersWithMoreXp = await prisma.user.count({
        where: {
          tipo_usuario: 'aluno',
          xp: { gt: currentUser.xp }
        }
      });
      currentUserPosition = usersWithMoreXp + 1;
    }

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      currentUserPosition
    };
  });
}
