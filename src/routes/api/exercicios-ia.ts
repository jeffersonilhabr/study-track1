/**
 * /api/exercicios-ia
 * ------------------
 * Rota de API do TanStack Start para funcionalidades de IA nos exercícios:
 * - acao: "gerar" -> gera questões inéditas
 * - acao: "dica" -> devolve uma pista socrática
 * - acao: "explicar" -> fornece explicação detalhada da questão
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  gerarExerciciosComIA,
  gerarDicaComIA,
  gerarExplicacaoComIA,
} from "@/lib/exercicios-ia.server";

export const Route = createFileRoute("/api/exercicios-ia")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            acao: "gerar" | "dica" | "explicar";
            dados: any;
          };

          if (body.acao === "gerar") {
            const resultado = await gerarExerciciosComIA(
              body.dados.materia,
              body.dados.quantidade || 3,
              body.dados.dia,
              request,
            );
            return Response.json(resultado);
          }

          if (body.acao === "dica") {
            const dica = await gerarDicaComIA(body.dados, request);
            return Response.json({ dica });
          }

          if (body.acao === "explicar") {
            const explicacao = await gerarExplicacaoComIA(body.dados, request);
            return Response.json({ explicacao });
          }

          return Response.json({ erro: "Ação inválida" }, { status: 400 });
        } catch (erro) {
          console.error("Erro na rota /api/exercicios-ia:", erro);
          return Response.json(
            { erro: "Erro ao comunicar com a inteligência artificial." },
            { status: 500 },
          );
        }
      },
    },
  },
});
