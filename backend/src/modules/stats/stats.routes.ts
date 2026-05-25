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
          thumbnail: true,
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
          thumbnail: c.thumbnail,
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

  // ── GET /stats/admin/financials ───────────────────────────────────────────
  fastify.get(
    '/stats/admin/financials',
    {
      preHandler: [requireAuth, requireRole('admin')],
    },
    async (req, reply) => {
      // 1. Buscar todas as matrículas com detalhes de curso e aluno
      const enrollments = await prisma.enrollment.findMany({
        include: {
          curso: { select: { id: true, titulo: true, preco: true } },
          aluno: { select: { id: true, nome: true, avatar_url: true } }
        },
        orderBy: { created_at: 'desc' }
      });

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonth = lastMonthDate.getMonth();
      const lastMonthYear = lastMonthDate.getFullYear();

      let revenueTotal = 0;
      let revenueCurrentMonth = 0;
      let revenueLastMonth = 0;
      let totalSales = 0;
      let refunds = 0; // Fixed as 0 for now

      // Top courses tracking
      const courseRevenueMap: Record<number, { titulo: string; revenue: number }> = {};

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

      // Recent transactions (últimas 10 matrículas com preco > 0)
      const transactions = [];

      for (const enc of enrollments) {
        const preco = parseFloat(enc.curso.preco?.toString() || '0');
        if (preco > 0) {
          totalSales++;
          revenueTotal += preco;

          const encDate = new Date(enc.created_at);
          const eMonth = encDate.getMonth();
          const eYear = encDate.getFullYear();

          if (eMonth === currentMonth && eYear === currentYear) {
            revenueCurrentMonth += preco;
          } else if (eMonth === lastMonth && eYear === lastMonthYear) {
            revenueLastMonth += preco;
          }

          // Atribuir ao gráfico dos últimos 6 meses
          const dataPoint = last6Months.find(l => l.year === eYear && l.month === eMonth);
          if (dataPoint) {
            dataPoint.revenue += preco;
          }

          // Agrupar por curso
          if (!courseRevenueMap[enc.curso.id]) {
            courseRevenueMap[enc.curso.id] = { titulo: enc.curso.titulo, revenue: 0 };
          }
          courseRevenueMap[enc.curso.id].revenue += preco;

          // Adicionar à lista de transações recentes (limit 10)
          if (transactions.length < 10) {
            transactions.push({
              id: enc.id,
              name: enc.aluno.nome,
              course: enc.curso.titulo,
              amount: preco,
              date: enc.created_at.toISOString(),
              type: 'compra'
            });
          }
        }
      }

      const ticketMedio = totalSales > 0 ? revenueTotal / totalSales : 0;
      const revenueGrowth = revenueLastMonth > 0 ? ((revenueCurrentMonth - revenueLastMonth) / revenueLastMonth) * 100 : (revenueCurrentMonth > 0 ? 100 : 0);

      const mrr = revenueCurrentMonth; // Simulação de MRR baseado no mês atual (já que as compras são single payment, usamos a receita do mês)
      const mrrGrowth = revenueGrowth;

      const ticketMedioGrowth = 0; // Não calcularemos crescimento histórico do TM para simplificar
      const refundsGrowth = 0; 

      // Preparar Top Cursos
      const topCourses = Object.values(courseRevenueMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5) // top 5
        .map(tc => {
          const pct = revenueTotal > 0 ? (tc.revenue / revenueTotal) * 100 : 0;
          return {
            title: tc.titulo,
            revenue: tc.revenue,
            pct: Math.round(pct)
          };
        });

      return reply.send({
        kpis: {
          receitaMensal: {
            value: revenueCurrentMonth,
            change: revenueGrowth.toFixed(1),
            up: revenueGrowth >= 0
          },
          mrr: {
            value: mrr,
            change: mrrGrowth.toFixed(1),
            up: mrrGrowth >= 0
          },
          ticketMedio: {
            value: ticketMedio,
            change: ticketMedioGrowth.toFixed(1),
            up: ticketMedioGrowth >= 0
          },
          reembolsos: {
            value: refunds,
            change: refundsGrowth.toFixed(1),
            up: refundsGrowth <= 0 // Reembolso diminuir é "up"/bom
          }
        },
        chartData: last6Months.map(m => ({
          name: m.name,
          revenue: m.revenue
        })),
        topCourses,
        transactions
      });
    }
  );
}
