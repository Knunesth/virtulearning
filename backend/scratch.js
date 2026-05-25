const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({ where: { email: 'kauathierry86@gmail.com' } });
  console.log('Usuario deletado com sucesso');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
