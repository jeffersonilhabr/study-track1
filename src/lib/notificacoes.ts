/**
 * notificacoes.ts
 * ---------------
 * Gerenciamento das configurações de notificações do StudyTrack por WhatsApp.
 * Salva as preferências no navegador e monta o texto formatado das mensagens.
 */
import { formatarData, type Tarefa } from "./studytrack";

export interface ConfigNotificacoes {
  ativo: boolean;
  telefone: string; // apenas dígitos, ex: "5511999999999"
  horario: string; // formato "HH:MM", ex: "08:00"
  incluirTarefas: boolean;
  incluirDesafioDiario: boolean;
  incluirDicaIA: boolean;
  ultimoEnvio?: string; // data ISO do último envio
}

const CHAVE_NOTIFICACOES = "studytrack-notificacoes";

export const CONFIG_PADRAO: ConfigNotificacoes = {
  ativo: false,
  telefone: "",
  horario: "08:00",
  incluirTarefas: true,
  incluirDesafioDiario: true,
  incluirDicaIA: true,
};

function temNavegador(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** Carrega as configurações salvas de notificação */
export function carregarConfigNotificacoes(): ConfigNotificacoes {
  if (!temNavegador()) return CONFIG_PADRAO;
  const salvo = localStorage.getItem(CHAVE_NOTIFICACOES);
  if (!salvo) return CONFIG_PADRAO;
  try {
    return { ...CONFIG_PADRAO, ...JSON.parse(salvo) };
  } catch {
    return CONFIG_PADRAO;
  }
}

/** Salva as configurações de notificação */
export function salvarConfigNotificacoes(config: ConfigNotificacoes): void {
  if (!temNavegador()) return;
  localStorage.setItem(CHAVE_NOTIFICACOES, JSON.stringify(config));
}

/** Formata número de telefone para exibição: (XX) XXXXX-XXXX */
export function formatarTelefoneVisual(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  // Se tiver código do país (ex: 5511999999999)
  if (digitos.startsWith("55") && digitos.length >= 12) {
    const semPais = digitos.slice(2);
    return `+55 (${semPais.slice(0, 2)}) ${semPais.slice(2, 7)}-${semPais.slice(7, 11)}`;
  }
  return digitos;
}

/** Normaliza para padrão internacional do WhatsApp (ex: 5511999999999) */
export function normalizarParaWhatsApp(telefone: string): string {
  let limpo = telefone.replace(/\D/g, "");
  if (limpo.startsWith("0")) limpo = limpo.slice(1);
  if (!limpo.startsWith("55") && limpo.length >= 10 && limpo.length <= 11) {
    limpo = `55${limpo}`;
  }
  return limpo;
}

/**
 * Monta o texto completo da mensagem formatada para envio no WhatsApp.
 */
export function montarMensagemWhatsApp(
  config: ConfigNotificacoes,
  tarefas: Tarefa[],
  streak: number = 0,
  desafioConcluido: boolean = false,
): string {
  const pendentes = tarefas.filter((t) => !t.concluida);
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  let texto = `📚 *StudyTrack — Lembrete Diário de Estudos* ⏰\n`;
  texto += `_Data: ${dataHoje}_\n\n`;

  texto += `Olá! Aqui está o resumo das suas atividades de hoje:\n\n`;

  // Seção de Ofensiva / Desafio
  if (config.incluirDesafioDiario) {
    texto += `🔥 *Ofensiva de estudos:* ${streak} ${streak === 1 ? "dia seguido" : "dias seguidos"}\n`;
    texto += `🎯 *Desafio Diário com IA:* ${
      desafioConcluido ? "✅ Concluído hoje!" : "⏳ Pendente (+25 pontos bônus)"
    }\n\n`;
  }

  // Seção de Tarefas
  if (config.incluirTarefas) {
    if (pendentes.length === 0) {
      texto += `🎉 *Tarefas de hoje:* Você não tem tarefas pendentes no momento! Parabéns!\n\n`;
    } else {
      texto += `📋 *Tarefas pendentes (${pendentes.length}):*\n`;
      pendentes.slice(0, 6).forEach((tarefa, idx) => {
        texto += `${idx + 1}. *${tarefa.titulo}* [${tarefa.materia}]\n   📅 Prazo: ${formatarData(tarefa.prazo)}\n`;
      });
      if (pendentes.length > 6) {
        texto += `_... e mais ${pendentes.length - 6} tarefa(s) pendente(s)._\n`;
      }
      texto += `\n`;
    }
  }

  // Seção de Dica da IA
  if (config.incluirDicaIA) {
    texto += `💡 *Dica do Tutor IA para hoje:*\n`;
    texto += `"A constância supera a intensidade: 20 minutos de estudo todos os dias constroem um futuro brilhante."\n\n`;
  }

  texto += `👉 *Acesse sua conta para organizar seus estudos:* ${
    typeof window !== "undefined" ? window.location.origin : "https://studytrack.lovable.app"
  }`;

  return texto;
}

/**
 * Gera a URL para abrir a conversa no WhatsApp com a mensagem pronta
 */
export function gerarLinkWhatsApp(telefone: string, mensagem: string): string {
  const numeroLimpo = normalizarParaWhatsApp(telefone);
  const textoCodificado = encodeURIComponent(mensagem);
  return `https://api.whatsapp.com/send?phone=${numeroLimpo}&text=${textoCodificado}`;
}
