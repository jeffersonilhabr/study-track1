/**
 * Notificações — página para configurar lembretes diários por WhatsApp.
 * Permite ao usuário definir seu número, horário de recebimento, preferências
 * de conteúdo e testar o envio em tempo real com prévia ao vivo.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  MessageCircle,
  Clock,
  Check,
  Send,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertCircle,
  Flame,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTarefas } from "@/hooks/use-tarefas";
import { useDesafioDiario } from "@/hooks/use-desafio-diario";
import { useNotificacoes } from "@/hooks/use-notificacoes";
import {
  formatarTelefoneVisual,
  montarMensagemWhatsApp,
  normalizarParaWhatsApp,
} from "@/lib/notificacoes";

export const Route = createFileRoute("/_authenticated/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações no WhatsApp — StudyTrack" },
      {
        name: "description",
        content: "Configure seus avisos diários de tarefas e estudos por WhatsApp no StudyTrack.",
      },
      { property: "og:title", content: "Notificações no WhatsApp — StudyTrack" },
      { property: "og:description", content: "Receba lembretes diários das suas tarefas no WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaNotificacoes,
});

const HORARIOS_DISPONIVEIS = [
  { valor: "07:00", rotulo: "07:00 — Início da manhã" },
  { valor: "08:00", rotulo: "08:00 — Manhã (Recomendado)" },
  { valor: "09:00", rotulo: "09:00 — Meio da manhã" },
  { valor: "12:00", rotulo: "12:00 — Almoço" },
  { valor: "18:00", rotulo: "18:00 — Fim de tarde" },
  { valor: "20:00", rotulo: "20:00 — Noite" },
];

function PaginaNotificacoes() {
  const { tarefas } = useTarefas();
  const { streak, concluidoHoje } = useDesafioDiario();
  const { config, salvoComSucesso, atualizarConfig, dispararWhatsAppTeste } = useNotificacoes();

  const [telefoneInput, setTelefoneInput] = useState(config.telefone || "");
  const [copiado, setCopiado] = useState(false);
  const [erroTelefone, setErroTelefone] = useState("");

  // Mantém o input sincronizado quando a config carregar
  if (config.telefone && !telefoneInput) {
    setTelefoneInput(config.telefone);
  }

  const mensagemPrevia = montarMensagemWhatsApp(
    { ...config, telefone: telefoneInput },
    tarefas,
    streak,
    concluidoHoje,
  );

  function tratarMudancaTelefone(e: React.ChangeEvent<HTMLInputElement>) {
    setErroTelefone("");
    const formatado = formatarTelefoneVisual(e.target.value);
    setTelefoneInput(formatado);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    const normalizado = normalizarParaWhatsApp(telefoneInput);
    if (config.ativo && normalizado.length < 10) {
      setErroTelefone("Por favor, digite um número de WhatsApp válido com DDD.");
      return;
    }
    atualizarConfig({ telefone: normalizado });
  }

  function alternarAtivacao() {
    const novoStatus = !config.ativo;
    atualizarConfig({ ativo: novoStatus });
  }

  function copiarMensagem() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(mensagemPrevia);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }

  function enviarTeste() {
    const normalizado = normalizarParaWhatsApp(telefoneInput || config.telefone);
    if (!normalizado || normalizado.length < 10) {
      setErroTelefone("Informe um número válido de WhatsApp para testar.");
      return;
    }
    dispararWhatsAppTeste(tarefas, streak, concluidoHoje);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Cabeçalho */}
        <div className="fade-up">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <MessageCircle className="size-5" />
            </span>
            <h1 className="text-3xl font-bold">Notificações por WhatsApp</h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Receba resumos diários automáticos das suas tarefas e seja lembrado do desafio diário diretamente no seu celular.
          </p>
        </div>

        {salvoComSucesso && (
          <div className="fade-up mt-4 flex items-center gap-2 rounded-xl bg-success/15 p-3.5 text-sm font-semibold text-success border border-success/30">
            <CheckCircle2 className="size-4 shrink-0" />
            Configurações salvas com sucesso!
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Coluna 1: Formulário de Configuração (7 colunas) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Card de Ativação Geral */}
            <div className="fade-up flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="size-4 text-primary" />
                  <span className="font-semibold">Lembretes Diários no WhatsApp</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {config.ativo
                    ? "Ativo: você receberá notificações nos dias e horários configurados."
                    : "Pausado: você não receberá mensagens até ativar novamente."}
                </p>
              </div>

              <button
                type="button"
                onClick={alternarAtivacao}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.ativo ? "bg-emerald-500" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.ativo ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Formulário de Dados */}
            <form onSubmit={salvar} className="fade-up rounded-xl border bg-card p-5 shadow-sm space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Número do WhatsApp (com DDD)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                    <MessageCircle className="size-4 text-emerald-600" />
                  </span>
                  <input
                    type="tel"
                    value={telefoneInput}
                    onChange={tratarMudancaTelefone}
                    placeholder="Ex: (11) 98765-4321"
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                {erroTelefone ? (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="size-3.5" />
                    {erroTelefone}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enviaremos os resumos para este número cadastrado.
                  </p>
                )}
              </div>

              {/* Horário de Notificação */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Horário preferido do lembrete
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                    <Clock className="size-4" />
                  </span>
                  <select
                    value={config.horario}
                    onChange={(e) => atualizarConfig({ horario: e.target.value })}
                    className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {HORARIOS_DISPONIVEIS.map((h) => (
                      <option key={h.valor} value={h.valor}>
                        {h.rotulo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conteúdos da Mensagem */}
              <div className="border-t pt-4 space-y-3">
                <span className="block text-sm font-semibold">O que incluir no seu resumo diário:</span>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.incluirTarefas}
                    onChange={(e) => atualizarConfig({ incluirTarefas: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-muted text-primary focus:ring-ring"
                  />
                  <div>
                    <span className="text-sm font-medium">Tarefas pendentes e prazos</span>
                    <p className="text-xs text-muted-foreground">
                      Lista clara com títulos, matérias e datas de entrega das suas tarefas.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.incluirDesafioDiario}
                    onChange={(e) => atualizarConfig({ incluirDesafioDiario: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-muted text-primary focus:ring-ring"
                  />
                  <div>
                    <span className="text-sm font-medium">Desafio Diário com IA e ofensiva (streak) 🔥</span>
                    <p className="text-xs text-muted-foreground">
                      Avisa se o desafio de hoje já foi feito ou se ainda está pendente com bônus.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.incluirDicaIA}
                    onChange={(e) => atualizarConfig({ incluirDicaIA: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-muted text-primary focus:ring-ring"
                  />
                  <div>
                    <span className="text-sm font-medium">Dica motivacional do Tutor IA 💡</span>
                    <p className="text-xs text-muted-foreground">
                      Pílula diária de incentivo e técnicas de estudo inteligente.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Salvar preferências
                </button>
              </div>
            </form>
          </div>

          {/* Coluna 2: Prévia Interativa do WhatsApp (5 colunas) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="fade-up overflow-hidden rounded-2xl border bg-card shadow-sm">
              {/* Topo estilo WhatsApp */}
              <div className="flex items-center gap-3 bg-emerald-600 px-4 py-3 text-white">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="size-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight">StudyTrack Notificações</p>
                  <p className="text-xs text-emerald-100">online • lembrete diário</p>
                </div>
                <span className="text-xs text-emerald-200">{config.horario}</span>
              </div>

              {/* Fundo de conversa e balão */}
              <div className="bg-[#e5ddd5] dark:bg-zinc-950 p-4 min-h-[300px] flex flex-col justify-end">
                <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-white dark:bg-zinc-900 p-3.5 text-xs text-zinc-800 dark:text-zinc-200 shadow-sm leading-relaxed whitespace-pre-line border border-zinc-200 dark:border-zinc-800">
                  {mensagemPrevia}
                  <div className="mt-1 text-right text-[10px] text-zinc-400">
                    {config.horario} ✓✓
                  </div>
                </div>
              </div>

              {/* Ações da Prévia */}
              <div className="p-4 bg-card border-t space-y-2">
                <button
                  type="button"
                  onClick={enviarTeste}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                >
                  <Send className="size-4" />
                  Enviar mensagem de teste no WhatsApp
                </button>

                <button
                  type="button"
                  onClick={copiarMensagem}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent"
                >
                  {copiado ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                  {copiado ? "Mensagem copiada!" : "Copiar texto da mensagem"}
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-card/60 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5 font-semibold text-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Como funciona a automação:
              </p>
              <p className="mt-1 leading-relaxed">
                As tarefas pendentes são sincronizadas diariamente. Ao atingir o horário definido (ex: {config.horario}), o resumo é estruturado automaticamente com suas tarefas reais e o link direto para seu painel.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
