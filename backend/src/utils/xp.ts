import prisma from '../config/prisma';

export async function addXP(userId: number, tipo: string, amount: number) {
  try {
    await prisma.$transaction([
      prisma.xPEvent.create({ data: { userId, tipo, amount } }),
      prisma.user.update({ where: { id: userId }, data: { xp: { increment: amount } } })
    ]);
  } catch (error) {
    console.error(`Erro ao adicionar XP ao usuário ${userId}:`, error);
  }
}
