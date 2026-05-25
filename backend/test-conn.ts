import prisma from './src/config/prisma';
prisma.$queryRaw`SELECT 1 as ok`
  .then((r: any) => { console.log('Conexao OK:', r); process.exit(0); })
  .catch((e: any) => { console.error('Erro:', e.message); process.exit(1); });
