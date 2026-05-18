// ==============================================================================
// SEED — Dados iniciais para o banco de dados VirtuLearning
// Execução: npm run db:seed (dentro de /backend)
// ==============================================================================

import { PrismaClient, TipoUsuario, StatusCurso } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // ── Limpar dados existentes (ordem importa por causa das relações) ──────────
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teacherApplication.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Dados anteriores removidos.\n');

  // ── 1. Criar Administrador ─────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Kauaauaklima10@', ROUNDS);
  const admin = await prisma.user.create({
    data: {
      nome: 'Kauã Thierry',
      email: 'kauathierry86@gmail.com',
      senha_hash: adminHash,
      tipo_usuario: TipoUsuario.admin,
      email_verificado: true,
      nickname: 'kauathierry',
    },
  });
  console.log(`✅ Admin criado: ${admin.email}`);

  // ── 2. Criar Professores ───────────────────────────────────────────────────
  const profHash = await bcrypt.hash('Professor123@', ROUNDS);
  const prof1 = await prisma.user.create({
    data: {
      nome: 'Thiago Silva',
      email: 'thiago.silva@virtulearning.com',
      senha_hash: profHash,
      tipo_usuario: TipoUsuario.professor,
      email_verificado: true,
      bio: 'Desenvolvedor Full-Stack com 10 anos de experiência em React e Node.js.',
      nickname: 'thiago.silva',
    },
  });

  const prof2 = await prisma.user.create({
    data: {
      nome: 'Amanda Costa',
      email: 'amanda.costa@virtulearning.com',
      senha_hash: profHash,
      tipo_usuario: TipoUsuario.professor,
      email_verificado: true,
      bio: 'Arquiteta de software especialista em microsserviços e arquitetura Cloud.',
      nickname: 'amanda.costa',
    },
  });
  console.log(`✅ Professores criados: ${prof1.email}, ${prof2.email}`);

  // ── 3. Criar Alunos ────────────────────────────────────────────────────────
  const alunoHash = await bcrypt.hash('Aluno123@', ROUNDS);
  const aluno1 = await prisma.user.create({
    data: {
      nome: 'João Silva',
      email: 'joao@example.com',
      senha_hash: alunoHash,
      tipo_usuario: TipoUsuario.aluno,
      email_verificado: true,
      nickname: 'joaosilva',
    },
  });

  const aluno2 = await prisma.user.create({
    data: {
      nome: 'Maria Souza',
      email: 'maria@example.com',
      senha_hash: alunoHash,
      tipo_usuario: TipoUsuario.aluno,
      email_verificado: true,
      nickname: 'mariasouza',
    },
  });
  console.log(`✅ Alunos criados: ${aluno1.email}, ${aluno2.email}\n`);

  // ── 4. Criar Cursos ────────────────────────────────────────────────────────
  const curso1 = await prisma.course.create({
    data: {
      titulo: 'Bootcamp React Native do Zero ao Profissional',
      descricao: 'Aprenda a criar aplicativos móveis modernos com React Native, Expo e TypeScript. Do zero ao deploy na App Store e Play Store.',
      preco: 199.90,
      status: StatusCurso.publicado,
      professor_id: prof1.id,
      nivel: 'iniciante',
      duracao_horas: 40,
    },
  });

  const curso2 = await prisma.course.create({
    data: {
      titulo: 'Arquitetura de Microsserviços com Node.js',
      descricao: 'Domine o desenvolvimento de sistemas distribuídos com Docker, Kubernetes, RabbitMQ e padrões de design para microsserviços.',
      preco: 249.90,
      status: StatusCurso.publicado,
      professor_id: prof2.id,
      nivel: 'avancado',
      duracao_horas: 55,
    },
  });

  const curso3 = await prisma.course.create({
    data: {
      titulo: 'Python para Análise de Dados',
      descricao: 'Domine Pandas, NumPy, Matplotlib e Scikit-learn para análise e visualização de dados profissional.',
      preco: 179.90,
      status: StatusCurso.publicado,
      professor_id: prof1.id,
      nivel: 'intermediario',
      duracao_horas: 35,
    },
  });
  console.log(`✅ Cursos criados: ${curso1.titulo}`);
  console.log(`✅ Cursos criados: ${curso2.titulo}`);
  console.log(`✅ Cursos criados: ${curso3.titulo}\n`);

  // ── 5. Criar Módulos e Aulas ───────────────────────────────────────────────
  const modulo1 = await prisma.module.create({ data: { curso_id: curso1.id, titulo: 'Fundamentos do React Native', ordem: 1 } });
  const modulo2 = await prisma.module.create({ data: { curso_id: curso1.id, titulo: 'Navegação e Rotas', ordem: 2 } });

  await prisma.lesson.createMany({
    data: [
      { modulo_id: modulo1.id, titulo: 'O que é React Native?', duracao: 600, ordem: 1, gratuita: true },
      { modulo_id: modulo1.id, titulo: 'Configurando o ambiente de desenvolvimento', duracao: 1200, ordem: 2, gratuita: true },
      { modulo_id: modulo1.id, titulo: 'Componentes básicos: View, Text, Image', duracao: 900, ordem: 3 },
      { modulo_id: modulo2.id, titulo: 'React Navigation: Stack Navigator', duracao: 1500, ordem: 1 },
      { modulo_id: modulo2.id, titulo: 'Tab Navigator e Drawer Navigator', duracao: 1200, ordem: 2 },
    ],
  });
  console.log(`✅ Módulos e aulas criados para: ${curso1.titulo}\n`);

  // ── 6. Criar Matrículas ────────────────────────────────────────────────────
  await prisma.enrollment.createMany({
    data: [
      { aluno_id: aluno1.id, curso_id: curso1.id, progresso: 45 },
      { aluno_id: aluno1.id, curso_id: curso3.id, progresso: 10 },
      { aluno_id: aluno2.id, curso_id: curso1.id, progresso: 80 },
      { aluno_id: aluno2.id, curso_id: curso2.id, progresso: 30 },
    ],
  });
  console.log(`✅ Matrículas criadas.\n`);

  // ── 7. Candidatura de professor pendente ───────────────────────────────────
  await prisma.teacherApplication.create({
    data: {
      user_id: aluno1.id,
      especialidade: 'Desenvolvimento Web',
      linkedin_url: 'https://linkedin.com/in/joaosilva',
      bio: 'Desenvolvedor com 5 anos de experiência em React e Vue.js, apaixonado por ensinar.',
      cursos_pretendidos: 'React Avançado, Next.js com TypeScript',
      anos_experiencia: 5,
    },
  });
  console.log(`✅ Candidatura de professor criada.\n`);

  // ── 8. Log de auditoria inicial ────────────────────────────────────────────
  await prisma.auditLog.create({
    data: {
      admin_id: admin.id,
      acao: 'SEED_EXECUTADO',
      alvo: 'Sistema',
      detalhes: 'Dados iniciais inseridos via seed.',
    },
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seed concluído com sucesso!\n');
  console.log('📧 Credenciais para acesso:');
  console.log('   Admin:     kauathierry86@gmail.com / Kauaauaklima10@');
  console.log('   Professor: thiago.silva@virtulearning.com / Professor123@');
  console.log('   Aluno:     joao@example.com / Aluno123@');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
