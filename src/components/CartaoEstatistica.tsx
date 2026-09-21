/**
 * CartaoEstatistica — card pequeno que mostra um número do Dashboard,
 * como "5 matérias" ou "60% concluído".
 */
import type { LucideIcon } from "lucide-react";

interface Props {
  rotulo: string;
  valor: string | number;
  icone: LucideIcon;
}

export function CartaoEstatistica({ rotulo, valor, icone: Icone }: Props) {
  return (
    <div className="fade-up flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icone className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none">{valor}</p>
        <p className="mt-1 text-sm text-muted-foreground">{rotulo}</p>
      </div>
    </div>
  );
}
