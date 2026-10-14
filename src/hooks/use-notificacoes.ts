/**
 * useNotificacoes — hook para gerenciar configurações e status de notificações.
 */
import { useEffect, useState } from "react";
import {
  carregarConfigNotificacoes,
  salvarConfigNotificacoes,
  gerarLinkWhatsApp,
  montarMensagemWhatsApp,
  type ConfigNotificacoes,
  CONFIG_PADRAO,
} from "@/lib/notificacoes";
import type { Tarefa } from "@/lib/studytrack";

export function useNotificacoes() {
  const [config, setConfig] = useState<ConfigNotificacoes>(CONFIG_PADRAO);
  const [salvoComSucesso, setSalvoComSucesso] = useState(false);

  useEffect(() => {
    setConfig(carregarConfigNotificacoes());
  }, []);

  function atualizarConfig(novosDados: Partial<ConfigNotificacoes>) {
    setConfig((anterior) => {
      const atualizado = { ...anterior, ...novosDados };
      salvarConfigNotificacoes(atualizado);
      return atualizado;
    });
    setSalvoComSucesso(true);
    setTimeout(() => setSalvoComSucesso(false), 2500);
  }

  function dispararWhatsAppTeste(
    tarefas: Tarefa[],
    streak: number,
    desafioConcluido: boolean,
  ): boolean {
    if (!config.telefone) return false;
    const mensagem = montarMensagemWhatsApp(config, tarefas, streak, desafioConcluido);
    const link = gerarLinkWhatsApp(config.telefone, mensagem);
    if (typeof window !== "undefined") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
    return true;
  }

  return {
    config,
    salvoComSucesso,
    atualizarConfig,
    dispararWhatsAppTeste,
  };
}
