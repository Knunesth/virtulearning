# Backend — VirtuLearning API

## Stack
- **Fastify** + **TypeScript** — Framework web rápido e tipado
- **Prisma** — ORM com migração automática e tipagem completa  
- **TiDB Cloud** — Banco de dados MySQL-compatível, serverless e online

---

## 🚀 Iniciar o Desenvolvimento

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com sua connection string do TiDB e suas chaves JWT
```

### 3. Gerar o Prisma Client e sincronizar com o banco
```bash
npm run db:generate   # Gera o client TypeScript do Prisma
npm run db:push       # Cria/atualiza as tabelas no TiDB (dev)
```

### 4. Popular o banco com dados iniciais
```bash
npm run db:seed       # Cria admin, professores, alunos e cursos
```

### 5. Iniciar o servidor em desenvolvimento
```bash
npm run dev
# Servidor em: http://localhost:3001
# Health check: http://localhost:3001/health
```

---

## 🔐 Credenciais do Seed

| Papel | E-mail | Senha |
|---|---|---|
| Admin | kauathierry86@gmail.com | Kauaauaklima10@ |
| Professor | thiago.silva@virtulearning.com | Professor123@ |
| Aluno | joao@example.com | Aluno123@ |

---

## 📡 Endpoints da API

### Autenticação
| Método | Endpoint | Acesso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET  | `/api/auth/me` | Autenticado |
| POST | `/api/auth/refresh` | Cookie (auto) |
| POST | `/api/auth/logout` | Autenticado |

### Usuários
| Método | Endpoint | Acesso |
|---|---|---|
| GET    | `/api/users` | Admin |
| GET    | `/api/users/:id` | Admin |
| PATCH  | `/api/users/:id/role` | Admin |
| PATCH  | `/api/users/:id/status` | Admin |
| PUT    | `/api/users/profile` | Autenticado |

### Cursos
| Método | Endpoint | Acesso |
|---|---|---|
| GET    | `/api/courses` | Público |
| GET    | `/api/courses/:id` | Público |
| POST   | `/api/courses` | Professor/Admin |
| PUT    | `/api/courses/:id` | Professor (próprio) / Admin |
| PATCH  | `/api/courses/:id/status` | Admin |
| DELETE | `/api/courses/:id` | Admin |
| GET    | `/api/courses/admin/all` | Admin |

### Candidaturas
| Método | Endpoint | Acesso |
|---|---|---|
| POST   | `/api/applications` | Público |
| GET    | `/api/applications` | Admin |
| PATCH  | `/api/applications/:id` | Admin |

### Matrículas
| Método | Endpoint | Acesso |
|---|---|---|
| POST   | `/api/enrollments` | Aluno |
| GET    | `/api/enrollments/my` | Autenticado |
| PATCH  | `/api/enrollments/:id/progress` | Autenticado |

### Mensagens
| Método | Endpoint | Acesso |
|---|---|---|
| GET    | `/api/messages/conversations` | Autenticado |
| GET    | `/api/messages/:professorId/:alunoId` | Participante |
| POST   | `/api/messages` | Autenticado |

---

## 🛡️ Segurança Implementada

- **Helmet** — Headers HTTP seguros (XSS, Clickjacking, CSP)
- **CORS restrito** — Só origens configuradas no `.env` são aceitas
- **Rate Limiting** — 100 req/min geral; bloqueio de brute force
- **Bcrypt (rounds=12)** — Senhas jamais gravadas em texto claro
- **JWT duplo** — Access token (15min) + Refresh token HttpOnly Cookie (7d)
- **Refresh token rotation** — Cada renovação invalida o anterior
- **Account lockout** — Bloqueio após 5 tentativas falhas (configurável)
- **RBAC** — Cada rota verifica o cargo do usuário (aluno/professor/admin)
- **Audit Log** — Todas as ações administrativas são gravadas no banco
- **Prisma Parameterized** — SQL Injection impossível por design
- **Graceful Shutdown** — Encerra conexões corretamente ao parar

---

## 🔧 Conectar ao TiDB Cloud

1. Acesse [tidbcloud.com](https://tidbcloud.com)
2. Crie um cluster (plano Free disponível)
3. Vá em **Connect → Connect with Prisma**
4. Copie a `DATABASE_URL` e cole no seu `.env`
5. Rode `npm run db:push` para criar as tabelas
6. Rode `npm run db:seed` para popular com dados iniciais
