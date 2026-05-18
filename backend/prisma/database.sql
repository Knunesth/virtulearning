-- ==============================================================================
-- VIRTULEARNING — Script SQL para TiDB Cloud
-- Cole este script no SQL Editor do seu cluster TiDB
-- Acesse: TiDB Cloud → seu cluster → SQL Editor
-- ==============================================================================

-- Criar e usar o banco de dados
CREATE DATABASE IF NOT EXISTS virtulearning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE virtulearning;

-- ==============================================================================
-- TABELA: users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`                   INT            NOT NULL AUTO_INCREMENT,
  `tenant_id`            INT            NOT NULL DEFAULT 1,
  `nome`                 VARCHAR(120)   NOT NULL,
  `email`                VARCHAR(200)   NOT NULL,
  `senha_hash`           VARCHAR(255)   NOT NULL,
  `tipo_usuario`         ENUM('aluno','professor','admin') NOT NULL DEFAULT 'aluno',
  `status`               ENUM('ativo','suspenso','pendente_verificacao') NOT NULL DEFAULT 'ativo',

  -- Segurança
  `login_tentativas`     INT            NOT NULL DEFAULT 0,
  `bloqueado_ate`        DATETIME       NULL,
  `email_verificado`     TINYINT(1)     NOT NULL DEFAULT 0,
  `refresh_token_hash`   VARCHAR(255)   NULL,
  `ultimo_login`         DATETIME       NULL,

  -- Perfil
  `avatar_url`           VARCHAR(500)   NULL,
  `bio`                  TEXT           NULL,
  `telefone`             VARCHAR(20)    NULL,
  `linkedin_url`         VARCHAR(500)   NULL,
  `genero`               VARCHAR(30)    NULL,
  `nickname`             VARCHAR(60)    NULL,

  `created_at`           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email`    (`email`),
  UNIQUE KEY `uq_users_nickname` (`nickname`),
  KEY `idx_users_tipo`  (`tipo_usuario`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- TABELA: courses
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `courses` (
  `id`            INT             NOT NULL AUTO_INCREMENT,
  `titulo`        VARCHAR(200)    NOT NULL,
  `descricao`     TEXT            NOT NULL,
  `thumbnail`     VARCHAR(500)    NULL,
  `preco`         DECIMAL(10,2)   NOT NULL,
  `status`        ENUM('rascunho','publicado','suspenso','arquivado') NOT NULL DEFAULT 'rascunho',
  `professor_id`  INT             NOT NULL,
  `nivel`         VARCHAR(30)     NOT NULL DEFAULT 'iniciante',
  `duracao_horas` INT             NOT NULL DEFAULT 0,
  `linguagem`     VARCHAR(50)     NOT NULL DEFAULT 'Português',

  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_courses_professor` (`professor_id`),
  KEY `idx_courses_status`    (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- TABELA: modules
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `modules` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `curso_id`  INT          NOT NULL,
  `titulo`    VARCHAR(200) NOT NULL,
  `ordem`     INT          NOT NULL DEFAULT 0,

  PRIMARY KEY (`id`),
  KEY `idx_modules_curso` (`curso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- TABELA: lessons
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `lessons` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `modulo_id` INT          NOT NULL,
  `titulo`    VARCHAR(200) NOT NULL,
  `url_video` VARCHAR(500) NULL,
  `duracao`   INT          NOT NULL DEFAULT 0,
  `ordem`     INT          NOT NULL DEFAULT 0,
  `gratuita`  TINYINT(1)   NOT NULL DEFAULT 0,

  PRIMARY KEY (`id`),
  KEY `idx_lessons_modulo` (`modulo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- TABELA: enrollments
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id`         INT      NOT NULL AUTO_INCREMENT,
  `aluno_id`   INT      NOT NULL,
  `curso_id`   INT      NOT NULL,
  `status`     ENUM('ativa','concluida','cancelada') NOT NULL DEFAULT 'ativa',
  `progresso`  INT      NOT NULL DEFAULT 0,

  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enrollment` (`aluno_id`, `curso_id`),
  KEY `idx_enrollments_aluno` (`aluno_id`),
  KEY `idx_enrollments_curso` (`curso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- TABELA: messages
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `messages` (
  `id`           INT     NOT NULL AUTO_INCREMENT,
  `aluno_id`     INT     NOT NULL,
  `professor_id` INT     NOT NULL,
  `curso_id`     INT     NULL,
  `texto`        TEXT    NOT NULL,
  `sender`       ENUM('aluno','professor') NOT NULL,
  `lida`         TINYINT(1) NOT NULL DEFAULT 0,

  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_messages_aluno`     (`aluno_id`),
  KEY `idx_messages_professor` (`professor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- TABELA: teacher_applications
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `teacher_applications` (
  `id`                  INT      NOT NULL AUTO_INCREMENT,
  `user_id`             INT      NOT NULL,
  `especialidade`       VARCHAR(120) NOT NULL,
  `linkedin_url`        VARCHAR(500) NULL,
  `bio`                 TEXT     NOT NULL,
  `cursos_pretendidos`  TEXT     NULL,
  `anos_experiencia`    INT      NOT NULL DEFAULT 0,
  `status`              ENUM('pendente','aprovado','rejeitado') NOT NULL DEFAULT 'pendente',
  `revisado_por`        INT      NULL,
  `revisado_em`         DATETIME NULL,
  `motivo_rejeicao`     TEXT     NULL,

  `created_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_application_user` (`user_id`),
  KEY `idx_applications_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- TABELA: audit_logs
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `admin_id`   INT          NOT NULL,
  `acao`       VARCHAR(100) NOT NULL,
  `alvo`       VARCHAR(200) NULL,
  `detalhes`   TEXT         NULL,
  `ip`         VARCHAR(45)  NULL,

  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_audit_admin`      (`admin_id`),
  KEY `idx_audit_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==============================================================================
-- VERIFICAÇÃO FINAL
-- ==============================================================================
SELECT
  TABLE_NAME        AS `Tabela`,
  TABLE_ROWS        AS `Linhas (aprox)`,
  CREATE_TIME       AS `Criada em`
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'virtulearning'
ORDER BY TABLE_NAME;
