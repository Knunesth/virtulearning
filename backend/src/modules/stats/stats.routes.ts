import { FastifyInstance } from 'fastify';
import prisma from '../../config/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';

export async function statsRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/stats/teacher/dashboard',
    {
      preHandler: [requireAuth, requireRole('professor', 'admin')],
    },
    async (req, reply) => {
      const professorId = req.user!.sub;

      // Buscar todos os cursos do professor para ter a lista de produtos
      const courses = await prisma.course.findMany({
        where: { professor_id: professorId },
        select: {
          id: true,
          titulo: true,
          preco: true,
          status: true,
          matriculas: {
            select: {
              aluno_id: true,
              progresso: true,
              created_at: true,
            }
          }
        }
      });

      let totalRevenue = 0;
      let totalSales = 0;
      let totalProgress = 0;
      let totalEnrollments = 0;
      const uniqueStudents = new Set<number>();

      // Variáveis para o gráfico de 6 meses
      const now = new Date();
      // Criar labels para os últimos 6 meses (ex: "Jan", "Fev")
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const last6Months: Array<{ year: number; month: number; name: string; revenue: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last6Months.push({
          year: d.getFullYear(),
          month: d.getMonth(),
          name: monthNames[d.getMonth()],
          revenue: 0
        });
      }

      const productsPerfomance = courses.map(c => {
        let courseRevenue = 0;
        let courseSales = 0;
        let courseProgressSum = 0;

        c.matriculas.forEach(m => {
          uniqueStudents.add(m.aluno_id);
          totalEnrollments++;
          courseProgressSum += m.progresso;
          totalProgress += m.progresso;

          const precoStr = c.preco ? c.preco.toString() : '0';
          const price = parseFloat(precoStr);

          if (price > 0) {
            courseSales++;
            totalSales++;
            courseRevenue += price;
            totalRevenue += price;

            // Alocar no gráfico se estiver nos últimos 6 meses
            const mDate = new Date(m.created_at);
            const dataPoint = last6Months.find(l => l.year === mDate.getFullYear() && l.month === mDate.getMonth());
            if (dataPoint) {
              dataPoint.revenue += price;
            }
          }
        });

        return {
          id: c.id,
          titulo: c.titulo,
          preco: c.preco,
          status: c.status,
          vendas: courseSales,
          receita: courseRevenue,
          taxa_conclusao: c.matriculas.length > 0 ? Math.round(courseProgressSum / c.matriculas.length) : 0,
        };
      });

      const avgCompletion = totalEnrollments > 0 ? Math.round(totalProgress / totalEnrollments) : 0;

      // Preparar os dados finais
      return reply.send({
        kpis: {
          lucro_total: totalRevenue,
          vendas: totalSales,
          alunos_ativos: uniqueStudents.size,
          taxa_conclusao: avgCompletion,
        },
        chartData: last6Months.map(m => ({
          name: m.name,
          faturamento: m.revenue
        })),
        produtos: productsPerfomance
      });
    }
  );
}
