# VirtuLearning

VirtuLearning é uma plataforma de educação online (EAD) inovadora, desenvolvida com o objetivo de conectar alunos e professores em um ambiente moderno, escalável e de fácil usabilidade.

Este sistema foi idealizado e projetado como o **Projeto Integrador (PI)** do curso técnico de Desenvolvimento de Sistemas no **Senac Taguatinga**, sob a orientação do professor **Hudson**.

## 👨‍💻 Desenvolvedor
Desenvolvido integralmente por **Kauã Thierry Nunes Duarte Lima**.

---

## 💻 Sobre o Frontend

A interface da aplicação foi desenvolvida com foco total na melhor experiência de usuário (UX) e em Design Responsivo (Mobile-First). O sistema foi arquitetado para fornecer uma experiência Premium e está preparado para atuar como um **Progressive Web App (PWA)** no futuro.

### Tecnologias Utilizadas
- **React.js & Vite**: Base do projeto, proporcionando um ambiente de desenvolvimento ultra-rápido e build otimizado.
- **TypeScript**: Adição de tipagem estática para maior segurança, previsibilidade e escalabilidade do código.
- **Tailwind CSS**: Framework utilitário usado para a construção de todo o design system (Dark Mode elegante, gradients suaves, glassmorphism e responsividade nativa em todas as resoluções).
- **Zustand**: Gerenciamento de estado global leve e performático (utilizado no controle da sessão, níveis de acesso e visualizações de UI).
- **TanStack Query (React Query)**: Abstração poderosa para o fetch de dados da API, mantendo o cache organizado e sincronizado.
- **React Router Dom**: Gestão inteligente de rotas privadas, públicas e baseadas em cargos (Admin/Teacher/Student).
- **Lucide React**: Biblioteca adotada para ícones modernos e minimalistas.

### Principais Estruturas e Funcionalidades
- **PWA Ready & Responsividade Extrema:** A interface se adapta perfeitamente do celular (320px) ao desktop ultrawide, incluindo uma Bottom Navigation dinâmica para dispositivos móveis.
- **Sistema Multi-Perfil (RBAC):** 
  - **👨‍🎓 Aluno:** Acesso a catálogo rico de cursos com filtros dinâmicos, player de vídeo responsivo (`WatchCourse`), aba de dúvidas, quizzes de fixação gamificados e um ranking de experiência (XP).
  - **👨‍🏫 Professor:** Ferramenta dedicada (Course Builder) para criação e organização modular de aulas e vídeos, análise de receita e interação direta com dúvidas dos alunos.
  - **🛡️ Administrador:** Painéis avançados de métricas, moderação rigorosa de aprovação de instrutores, gestão financeira e supervisão geral do estado da plataforma.

---

## ⚙️ Como Executar Localmente (Frontend)

1. Clone o repositório.
2. Acesse a pasta raiz do projeto frontend.
3. Instale as dependências executando:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` baseado nas variáveis necessárias (apontando para a API do backend).
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Abra `http://localhost:5173` em seu navegador.
