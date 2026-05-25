// ==============================================================================
// LESSONS.ROUTES.TS — Rotas de Módulos e Aulas do VirtuLearning
// ==============================================================================
// Prefixo /api registrado no server.ts. Rotas resultantes:
//   POST   /api/courses/:courseId/modules      → criar módulo
//   PUT    /api/modules/:id                    → editar módulo
//   DELETE /api/modules/:id                    → deletar módulo (+ aulas cascata)
//   POST   /api/modules/:moduleId/lessons      → criar aula
//   PUT    /api/lessons/:id                    → editar aula
//   DELETE /api/lessons/:id                    → deletar aula
//   PATCH  /api/lessons/:id/complete           → aluno marca aula como concluída
// ==============================================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';
import { verifyAccessToken } from '../../config/jwt';
import { addXP } from '../../utils/xp';

// ── Helpers de Ownership ──────────────────────────────────────────────────────

/**
 * Verifica que o usuário logado é dono do curso (professor_id) ou admin.
 * Retorna o curso se autorizado, ou envia reply 403/404 e retorna null.
 */
async function assertCourseOwnership(
  courseId: number,
  req: FastifyRequest,
  reply: FastifyReply
) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    reply.status(404).send({ error: 'Curso não encontrado.' });
    return null;
  }
  if (req.user!.role !== 'admin' && course.professor_id !== req.user!.sub) {
    reply.status(403).send({ error: 'Você não tem permissão para gerenciar este curso.' });
    return null;
  }
  return course;
}

/**
 * Verifica que o usuário logado é dono do módulo (via curso pai) ou admin.
 */
async function assertModuleOwnership(
  moduleId: number,
  req: FastifyRequest,
  reply: FastifyReply
) {
  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { curso: { select: { professor_id: true } } },
  });
  if (!mod) {
    reply.status(404).send({ error: 'Módulo não encontrado.' });
    return null;
  }
  if (req.user!.role !== 'admin' && mod.curso.professor_id !== req.user!.sub) {
    reply.status(403).send({ error: 'Você não tem permissão para gerenciar este módulo.' });
    return null;
  }
  return mod;
}

/**
 * Verifica que o usuário logado é dono da aula (via módulo → curso) ou admin.
 */
async function assertLessonOwnership(
  lessonId: number,
  req: FastifyRequest,
  reply: FastifyReply
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { modulo: { include: { curso: { select: { professor_id: true } } } } },
  });
  if (!lesson) {
    reply.status(404).send({ error: 'Aula não encontrada.' });
    return null;
  }
  if (req.user!.role !== 'admin' && lesson.modulo.curso.professor_id !== req.user!.sub) {
    reply.status(403).send({ error: 'Você não tem permissão para gerenciar esta aula.' });
    return null;
  }
  return lesson;
}

/**
 * Recalcula o progresso de uma matrícula após marcar aula como concluída.
 * progresso = (aulas concluídas pelo aluno no curso / total de aulas do curso) × 100
 * Se progresso === 100, muda o status da matrícula para 'concluida'.
 */
async function recalcProgress(userId: number, courseId: number) {
  const totalAulas = await prisma.lesson.count({
    where: { modulo: { curso_id: courseId } },
  });

  if (totalAulas === 0) return;

  const aulasConcluidasCount = await prisma.lessonProgress.count({
    where: {
      user_id: userId,
      lesson: { modulo: { curso_id: courseId } },
    },
  });

  const progresso = Math.round((aulasConcluidasCount / totalAulas) * 100);
  const newStatus = progresso === 100 ? ('concluida' as const) : ('ativa' as const);

  await prisma.enrollment.updateMany({
    where: { aluno_id: userId, curso_id: courseId },
    data: { progresso, status: newStatus },
  });
}

// ── Plugin de Rotas ───────────────────────────────────────────────────────────

export async function lessonsRoutes(fastify: FastifyInstance) {
  // ─────────────────────────────────────────────────────────────────────────────
  // MÓDULOS
  // ─────────────────────────────────────────────────────────────────────────────

  // POST /courses/:courseId/modules — Criar módulo
  fastify.post<{ Params: { courseId: string } }>(
    '/courses/:courseId/modules',
    { 
      preHandler: [requireAuth, requireRole('professor', 'admin')],
      schema: { tags: ['lessons'], security: [{ bearerAuth: [] }] }
    },
    async (req, reply) => {
      const courseId = parseInt(req.params.courseId);
      if (isNaN(courseId)) return reply.status(400).send({ error: 'courseId inválido.' });

      const course = await assertCourseOwnership(courseId, req, reply);
      if (!course) return;

      const schema = z.object({
        titulo: z.string().min(1, 'Título obrigatório.').max(200),
        ordem:  z.number().int().min(0).optional(),
      });
      const parse = schema.safeParse(req.body);
      if (!parse.success) {
        return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });
      }

      const ordem = parse.data.ordem
        ?? (await prisma.module.count({ where: { curso_id: courseId } }));

      const mod = await prisma.module.create({
        data: { curso_id: courseId, titulo: parse.data.titulo, ordem },
        include: { aulas: { orderBy: { ordem: 'asc' } } },
      });

      return reply.status(201).send(mod);
    }
  );

  // PUT /modules/:id — Editar módulo
  fastify.put<{ Params: { id: string } }>(
    '/modules/:id',
    { 
      preHandler: [requireAuth, requireRole('professor', 'admin')],
      schema: { tags: ['lessons'], security: [{ bearerAuth: [] }] }
    },
    async (req, reply) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return reply.status(400).send({ error: 'id inválido.' });

      const mod = await assertModuleOwnership(id, req, reply);
      if (!mod) return;

      const schema = z.object({
        titulo: z.string().min(1).max(200).optional(),
        ordem:  z.number().int().min(0).optional(),
      });
      const parse = schema.safeParse(req.body);
      if (!parse.success) {
        return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });
      }

      const updated = await prisma.module.update({
        where: { id },
        data: parse.data,
        include: { aulas: { orderBy: { ordem: 'asc' } } },
      });
      return reply.send(updated);
    }
  );

  // DELETE /modules/:id — Deletar módulo (+ aulas em cascata manual para TiDB)
  fastify.delete<{ Params: { id: string } }>(
    '/modules/:id',
    { 
      preHandler: [requireAuth, requireRole('professor', 'admin')],
      schema: { tags: ['lessons'], security: [{ bearerAuth: [] }] }
    },
    async (req, reply) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return reply.status(400).send({ error: 'id inválido.' });

      const mod = await assertModuleOwnership(id, req, reply);
      if (!mod) return;

      // TiDB com relationMode=prisma não suporta FK cascade.
      // Ordem de deleção: LessonProgress → Lesson → Module
      const lessonIds = (
        await prisma.lesson.findMany({ where: { modulo_id: id }, select: { id: true } })
      ).map((l) => l.id);

      if (lessonIds.length > 0) {
        await prisma.lessonProgress.deleteMany({ where: { lesson_id: { in: lessonIds } } });
        await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
      }

      await prisma.module.delete({ where: { id } });
      return reply.send({ message: 'Módulo e suas aulas foram removidos com sucesso.' });
    }
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // AULAS
  // ─────────────────────────────────────────────────────────────────────────────

  // POST /modules/:moduleId/lessons — Criar aula
  fastify.post<{ Params: { moduleId: string } }>(
    '/modules/:moduleId/lessons',
    { 
      preHandler: [requireAuth, requireRole('professor', 'admin')],
      schema: { tags: ['lessons'], security: [{ bearerAuth: [] }] }
    },
    async (req, reply) => {
      const moduleId = parseInt(req.params.moduleId);
      if (isNaN(moduleId)) return reply.status(400).send({ error: 'moduleId inválido.' });

      const mod = await assertModuleOwnership(moduleId, req, reply);
      if (!mod) return;

      const schema = z.object({
        titulo:    z.string().min(1, 'Título obrigatório.').max(200),
        descricao: z.string().max(5000).optional(),
        url_video: z.string().url('URL do vídeo inválida.').or(z.literal('')).optional(),
        duracao:   z.number().int().min(0).optional(), // segundos
        ordem:     z.number().int().min(0).optional(),
        gratuita:  z.boolean().optional(),
      });
      const parse = schema.safeParse(req.body);
      if (!parse.success) {
        return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });
      }

      const ordem = parse.data.ordem
        ?? (await prisma.lesson.count({ where: { modulo_id: moduleId } }));

      const lesson = await prisma.lesson.create({
        data: {
          modulo_id: moduleId,
          titulo:    parse.data.titulo,
          descricao: parse.data.descricao ?? null,
          url_video: parse.data.url_video || null,
          duracao:   parse.data.duracao   ?? 0,
          ordem,
          gratuita:  parse.data.gratuita  ?? false,
        },
      });

      return reply.status(201).send(lesson);
    }
  );

  // PUT /lessons/:id — Editar aula
  fastify.put<{ Params: { id: string } }>(
    '/lessons/:id',
    { 
      preHandler: [requireAuth, requireRole('professor', 'admin')],
      schema: { tags: ['lessons'], security: [{ bearerAuth: [] }] }
    },
    async (req, reply) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return reply.status(400).send({ error: 'id inválido.' });

      const lesson = await assertLessonOwnership(id, req, reply);
      if (!lesson) return;

      const schema = z.object({
        titulo:    z.string().min(1).max(200).optional(),
        descricao: z.string().max(5000).nullable().optional(),
        url_video: z.string().url().or(z.literal('')).nullable().optional(),
        duracao:   z.number().int().min(0).optional(),
        ordem:     z.number().int().min(0).optional(),
        gratuita:  z.boolean().optional(),
      });
      const parse = schema.safeParse(req.body);
      if (!parse.success) {
        return reply.status(400).send({ error: 'Dados inválidos.', details: parse.error.flatten() });
      }

      // Normaliza string vazia para null
      const data: Record<string, unknown> = { ...parse.data };
      if (data['url_video'] === '') data['url_video'] = null;

      const updated = await prisma.lesson.update({ where: { id }, data });
      return reply.send(updated);
    }
  );

  // DELETE /lessons/:id — Deletar aula
  fastify.delete<{ Params: { id: string } }>(
    '/lessons/:id',
    { 
      preHandler: [requireAuth, requireRole('professor', 'admin')],
      schema: { tags: ['lessons'], security: [{ bearerAuth: [] }] }
    },
    async (req, reply) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return reply.status(400).send({ error: 'id inválido.' });

      const lesson = await assertLessonOwnership(id, req, reply);
      if (!lesson) return;

      // Remove progressos antes da aula (sem FK cascade no TiDB)
      await prisma.lessonProgress.deleteMany({ where: { lesson_id: id } });
      await prisma.lesson.delete({ where: { id } });

      return reply.send({ message: 'Aula removida com sucesso.' });
    }
  );

  // PATCH /lessons/:id/complete — Aluno marca aula como concluída (idempotente)
  fastify.patch<{ Params: { id: string } }>(
    '/lessons/:id/complete',
    { 
      preHandler: [requireAuth],
      schema: { tags: ['lessons'], security: [{ bearerAuth: [] }] }
    },
    async (req, reply) => {
      const lessonId = parseInt(req.params.id);
      if (isNaN(lessonId)) return reply.status(400).send({ error: 'id inválido.' });

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { modulo: { select: { curso_id: true } } },
      });
      if (!lesson) return reply.status(404).send({ error: 'Aula não encontrada.' });

      const userId   = req.user!.sub;
      const courseId = lesson.modulo.curso_id;

      // Verifica matrícula ativa no curso
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          aluno_id: userId,
          curso_id: courseId,
          status: { in: ['ativa', 'concluida'] },
        },
      });
      if (!enrollment) {
        return reply.status(403).send({ error: 'Você não está matriculado neste curso.' });
      }

      // Upsert: marca como concluída (idempotente — repeated calls are safe)
      const progress = await prisma.lessonProgress.upsert({
        where:  { user_id_lesson_id: { user_id: userId, lesson_id: lessonId } },
        create: { user_id: userId, lesson_id: lessonId },
        update: { completed_at: new Date() },
      });

      // Se acabou de ser criada, dá XP
      if (progress.completed_at.getTime() >= new Date().getTime() - 5000) {
        await addXP(userId, 'aula_concluida', 10);
      }

      // Recalcula o progresso da matrícula de forma assíncrona (não bloqueia o response)
      recalcProgress(userId, courseId).catch((err) =>
        fastify.log.error('[recalcProgress] Erro ao recalcular progresso:', err)
      );

      return reply.send({
        message: 'Aula marcada como concluída.',
        progress,
      });
    }
  );
}
