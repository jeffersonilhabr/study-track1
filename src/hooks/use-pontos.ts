/**
 * usePontos — hook simples que guarda a pontuação do usuário.
 * Cada exercício respondido corretamente soma pontos.
 */
import { useEffect, useState } from "react";
import { carregarPontos, salvarPontos } from "@/lib/studytrack";

export function usePontos() {
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    setPontos(carregarPontos());
  }, []);

  function ganharPontos(quantidade: number) {
    setPontos((atual) => {
      const novo = atual + quantidade;
      salvarPontos(novo);
      return novo;
    });
  }

  function zerarPontos() {
    setPontos(0);
    salvarPontos(0);
  }

  return { pontos, ganharPontos, zerarPontos };
}
