const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'kauathierry86@gmail.com' },
    data: { tipo_usuario: 'admin' }
  });
  console.log('Usuario promovido para admin com sucesso');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
