import { PrismaClient } from '@prisma/client';
import { connect } from '@tidbcloud/serverless';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';

// Configura o adapter Serverless para o TiDB
const connection = connect({ url: process.env.DATABASE_URL! });
const adapter = new PrismaTiDBCloud(connection);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

export default prisma;
