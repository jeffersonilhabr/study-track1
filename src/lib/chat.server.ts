/**
 * chat.server.ts
 * --------------
 * Cérebro do Assistente de Estudos (roda apenas no servidor).
 * Aqui montamos a chamada para a IA da Lovable e devolvemos a resposta
 * em tempo real (streaming) para a página do assistente.
 */
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./chat-run-id.ts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODELO = "openai/gpt-6-astra";

// Instruções que definem a personalidade do assistente.
const INSTRUCOES = `Você é o Assistente de Estudos do StudyTrack, um tutor amigável que ajuda estudantes iniciantes de programação.

Regras:
- Responda sempre em português brasileiro, com linguagem simples e acolhedora.
- Explique conceitos passo a passo, com exemplos curtos de código quando fizer sentido.
- Ajude com dúvidas de matérias, técnicas de estudo, organização de tarefas e motivação.
- Quando o aluno errar um conceito, corrija com gentileza e explique o porquê.
- Respostas objetivas: prefira respostas curtas e claras, usando listas quando ajudar.
- Use markdown para formatar (negrito, listas, blocos de código).`;

export async function handleChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    return Response.json({ erro: "Chave de IA não configurada no servidor." }, { status: 500 });
  }

  // Mensagens enviadas pela página do assistente (histórico completo da conversa).
  const { messages } = (await request.json()) as { messages: UIMessage[] };

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODELO),
    system: INSTRUCOES,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({ sendReasoning: false }),
    runIdFetch,
  );
}
