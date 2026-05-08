/**
 * Configuração de Prompt base para geração de Quizzes via Inteligência Artificial.
 * 
 * Este arquivo serve como documentação de contrato para quando o backend for integrado
 * à OpenAI ou outra LLM. O objetivo é garantir que a IA retorne as perguntas em um formato
 * JSON estrito que a interface consiga renderizar sem erros.
 */

export const QUIZ_AI_PROMPT_TEMPLATE = `
Você é um professor especialista criando um teste de fixação para um aluno.
O aluno acabou de concluir aulas sobre o tema: "{{COURSE_NAME}}".
A dificuldade deve ser: "{{DIFFICULTY_LEVEL}}".

Gere exatamente {{NUM_QUESTIONS}} perguntas de múltipla escolha.
A resposta DEVE ser um objeto JSON estrito no formato abaixo, sem nenhum texto adicional antes ou depois.

Formato esperado:
{
  "questions": [
    {
      "id": "q1",
      "text": "Qual é a principal função do...",
      "options": [
        { "id": "a", "text": "Opção incorreta 1" },
        { "id": "b", "text": "Opção correta" },
        { "id": "c", "text": "Opção incorreta 2" },
        { "id": "d", "text": "Opção incorreta 3" }
      ],
      "correctOptionId": "b",
      "explanation": "A opção B está correta porque a principal função é..."
    }
  ]
}
`;

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizPayload {
  questions: QuizQuestion[];
}
