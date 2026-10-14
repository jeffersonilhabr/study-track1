/**
 * useDesafioDiario — hook para gerenciar o Desafio Diário com IA e a ofensiva (streak) de estudos.
 *
 * Cada dia tem um novo conjunto de exercícios sugeridos pela IA.
 * Completar o desafio do dia garante bônus de pontuação e mantém a ofensiva 🔥 ativa.
 */
import { useEffect, useState } from "react";

const CHAVE_DESAFIO = "studytrack-desafio-diario";

export interface EstadoDesafioDiario {
  data: string; // "AAAA-MM-DD"
  concluido: boolean;
  streak: number; // dias consecutivos de estudo
  ultimaDataConcluida?: string;
  pontosBonusGanhos: number;
}

function dataAtual(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function dataOntem(): string {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const ano = ontem.getFullYear();
  const mes = String(ontem.getMonth() + 1).padStart(2, "0");
  const dia = String(ontem.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function useDesafioDiario() {
  const [hoje] = useState(dataAtual());
  const [estado, setEstado] = useState<EstadoDesafioDiario>({
    data: hoje,
    concluido: false,
    streak: 0,
    pontosBonusGanhos: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const salvo = localStorage.getItem(CHAVE_DESAFIO);
      if (salvo) {
        const dados = JSON.parse(salvo) as EstadoDesafioDiario;
        const ehHoje = dados.data === hoje;

        // Verifica se a ofensiva ainda é válida (se completou ontem ou hoje)
        let streakAtual = dados.streak || 0;
        const ontem = dataOntem();
        if (
          dados.ultimaDataConcluida &&
          dados.ultimaDataConcluida !== hoje &&
          dados.ultimaDataConcluida !== ontem
        ) {
          // Quebrou a sequência
          streakAtual = 0;
        }

        setEstado({
          data: hoje,
          concluido: ehHoje ? !!dados.concluido : false,
          streak: streakAtual,
          ultimaDataConcluida: dados.ultimaDataConcluida,
          pontosBonusGanhos: ehHoje ? dados.pontosBonusGanhos || 0 : 0,
        });
      }
    } catch {
      // Ignora erro de parse
    }
  }, [hoje]);

  /** Registra a conclusão do desafio diário, calculando ofensiva e bônus */
  function concluirDesafio(bonus: number = 25) {
    setEstado((atual) => {
      const ontem = dataOntem();
      let novoStreak = atual.streak;

      if (atual.ultimaDataConcluida === ontem) {
        novoStreak += 1;
      } else if (atual.ultimaDataConcluida !== hoje) {
        novoStreak = 1;
      }

      const novoEstado: EstadoDesafioDiario = {
        data: hoje,
        concluido: true,
        streak: novoStreak,
        ultimaDataConcluida: hoje,
        pontosBonusGanhos: bonus,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(CHAVE_DESAFIO, JSON.stringify(novoEstado));
      }

      return novoEstado;
    });
  }

  return {
    hoje,
    concluidoHoje: estado.concluido,
    streak: estado.streak,
    pontosBonusGanhos: estado.pontosBonusGanhos,
    concluirDesafio,
  };
}
