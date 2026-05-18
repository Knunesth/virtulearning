import { PrismaClient } from '@prisma/client';

// Singleton: uma única instância do Prisma em toda a aplicação
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

export default prisma;
