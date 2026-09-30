/**
 * Assistente — página do bot de estudos do StudyTrack.
 * Você conversa com um tutor de IA: tira dúvidas, pede explicações
 * e recebe dicas de estudo. As respostas chegam em tempo real.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/_authenticated/assistente")({
  head: () => ({
    meta: [
      { title: "StudyTrack — Assistente de Estudos" },
      { name: "description", content: "Converse com o assistente de estudos do StudyTrack e tire suas dúvidas." },
      { property: "og:title", content: "StudyTrack — Assistente de Estudos" },
      { property: "og:description", content: "Tire dúvidas e receba dicas de estudo com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Assistente,
});

// Sugestões de perguntas para quem não sabe por onde começar.
const SUGESTOES = [
  "Como criar uma rotina de estudos?",
  "Explique o que é uma pilha em Estruturas de Dados",
  "Me dê dicas para aprender JavaScript",
  "O que é revisão espaçada?",
];

function Assistente() {
  const [digitando, setDigitando] = useState("");
  const fimDasMensagens = useRef<HTMLDivElement>(null);

  // useChat cuida da conversa: envia as mensagens para /api/chat
  // e atualiza a tela conforme a resposta da IA vai chegando.
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const ocupado = status === "submitted" || status === "streaming";

  // Rola a conversa para baixo sempre que chega mensagem nova.
  useEffect(() => {
    fimDasMensagens.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  function enviar(texto: string) {
    const limpo = texto.trim();
    if (!limpo || ocupado) return;
    sendMessage({ text: limpo });
    setDigitando("");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        <section className="fade-up mb-4">
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Bot className="size-8 text-primary" />
            Assistente de Estudos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Tire dúvidas, peça explicações e receba dicas para estudar melhor.
          </p>
        </section>

        {/* Área da conversa */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border bg-card p-4 shadow-sm">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bot className="size-8" />
              </span>
              <p className="max-w-sm text-muted-foreground">
                Olá! Sou seu assistente de estudos. Pergunte qualquer coisa sobre suas matérias
                ou peça ajuda para organizar sua rotina.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGESTOES.map((sugestao) => (
                  <button
                    key={sugestao}
                    onClick={() => enviar(sugestao)}
                    className="rounded-full border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((mensagem) => {
              const ehUsuario = mensagem.role === "user";
              // Juntamos os trechos de texto da mensagem (a IA pode mandar em partes).
              const texto = mensagem.parts
                .filter((parte) => parte.type === "text")
                .map((parte) => parte.text)
                .join("");

              return (
                <div key={mensagem.id} className={`flex gap-3 ${ehUsuario ? "flex-row-reverse" : ""}`}>
                  <span
                    className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ${
                      ehUsuario ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {ehUsuario ? <User className="size-4" /> : <Bot className="size-4" />}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      ehUsuario
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {ehUsuario ? (
                      texto
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{texto}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Indicador de "digitando..." enquanto a IA pensa */}
          {ocupado && (
            <div className="flex gap-3">
              <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </span>
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                Pensando…
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive">
              Ops! Não consegui falar com o assistente. Tente enviar de novo.
            </p>
          )}

          <div ref={fimDasMensagens} />
        </div>

        {/* Caixa de digitação */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(digitando);
          }}
          className="mt-4 flex gap-2"
        >
          <input
            value={digitando}
            onChange={(e) => setDigitando(e.target.value)}
            placeholder="Digite sua dúvida…"
            className="flex-1 rounded-lg border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={ocupado || !digitando.trim()}
            aria-label="Enviar mensagem"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="size-4" />
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
}
