import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { requireAuth } from '../../middleware/auth';
import { addXP } from '../../utils/xp';

export async function quizzesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  // GET /api/courses/:courseId/quiz
  app.get('/courses/:courseId/quiz', {
    schema: { tags: ['quizzes'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { courseId } = req.params as { courseId: string };
    const quiz = await prisma.quiz.findFirst({
      where: { courseId: parseInt(courseId) },
      include: {
        questions: {
          include: { options: true },
          orderBy: { ordem: 'asc' }
        }
      }
    });

    if (!quiz) {
      return reply.status(404).send({ error: 'Quiz não encontrado para este curso.' });
    }
    
    const user = (req as any).user;
    const isTeacher = user.tipo_usuario === 'professor' || user.tipo_usuario === 'admin';

    // Oculta a resposta correta se for aluno
    if (!isTeacher) {
      quiz.questions = quiz.questions.map(q => ({
        ...q,
        options: q.options.map(o => ({ ...o, isCorrect: false }))
      })) as any;
    }

    return quiz;
  });

  // POST /api/courses/:courseId/quiz
  app.post('/courses/:courseId/quiz', {
    schema: { tags: ['quizzes'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { courseId } = req.params as { courseId: string };
    const bodySchema = z.object({
      titulo: z.string(),
      passingScore: z.number().optional()
    });
    const data = bodySchema.parse(req.body);

    const quiz = await prisma.quiz.create({
      data: {
        courseId: parseInt(courseId),
        titulo: data.titulo,
        passingScore: data.passingScore || 70
      }
    });
    return quiz;
  });

  // POST /api/quizzes/:id/questions
  app.post('/quizzes/:id/questions', {
    schema: { tags: ['quizzes'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const bodySchema = z.object({
      texto: z.string(),
      ordem: z.number().optional(),
      options: z.array(z.object({
        texto: z.string(),
        isCorrect: z.boolean()
      }))
    });
    const data = bodySchema.parse(req.body);

    const question = await prisma.question.create({
      data: {
        quizId: parseInt(id),
        texto: data.texto,
        ordem: data.ordem || 0,
        options: {
          create: data.options
        }
      }
    });
    return question;
  });

  // DELETE /api/quizzes/:quizId/questions/:id
  app.delete('/quizzes/:quizId/questions/:id', {
    schema: { tags: ['quizzes'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await prisma.question.delete({
      where: { id: parseInt(id) }
    });
    return reply.status(204).send();
  });

  // POST /api/quizzes/:id/attempt
  app.post('/quizzes/:id/attempt', {
    schema: { tags: ['quizzes'], security: [{ bearerAuth: [] }] }
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const user = (req as any).user;

    const bodySchema = z.object({
      answers: z.array(z.object({
        questionId: z.number(),
        optionId: z.number()
      }))
    });
    const { answers } = bodySchema.parse(req.body);

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    if (!quiz) {
      return reply.status(404).send({ error: 'Quiz não encontrado' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    for (const answer of answers) {
      const q = quiz.questions.find((q: any) => q.id === answer.questionId);
      if (q) {
        const opt = q.options.find((o: any) => o.id === answer.optionId);
        if (opt && opt.isCorrect) {
          correctCount++;
        }
      }
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: parseInt(id),
        score,
        passed
      }
    });

    if (passed) {
      await addXP(user.id, 'quiz_aprovado', 50);
    }

    return { score, passed, correctCount, totalQuestions, attemptId: attempt.id };
  });
}
