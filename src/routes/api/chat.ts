/**
 * Rota /api/chat — porta de entrada do Assistente de Estudos.
 * Recebe as mensagens da página e repassa para o cérebro (chat.server.ts).
 */
import { createFileRoute } from "@tanstack/react-router";
import { handleChat } from "@/lib/chat.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: ({ request }) => handleChat(request),
    },
  },
});
