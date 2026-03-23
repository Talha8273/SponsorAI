import { CheckCircle2, Clock, Coins, LayoutGrid } from "lucide-react";
import { useMemo } from "react";
import type { Company } from "../types";

type Props = {
  companies: Company[];
};

function formatTry(n: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export function DashboardCards({ companies }: Props) {
  const stats = useMemo(() => {
    const total = companies.length;
    const approved = companies.filter((c) => c.status === "Onaylandı").length;
    const pending = companies.filter((c) => c.status === "Beklemede").length;
    const estimatedValue = companies.reduce((sum, c) => sum + (c.estimatedBudget ?? 0), 0);
    return { total, approved, pending, estimatedValue };
  }, [companies]);

  const cards = [
    {
      label: "Toplam",
      value: String(stats.total),
      icon: LayoutGrid,
      accent: "from-slate-700 to-slate-600 dark:from-slate-200 dark:to-slate-400",
    },
    {
      label: "Onaylanan",
      value: String(stats.approved),
      icon: CheckCircle2,
      accent: "from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300",
    },
    {
      label: "Bekleyen",
      value: String(stats.pending),
      icon: Clock,
      accent: "from-amber-500 to-amber-400 dark:from-amber-300 dark:to-amber-200",
    },
    {
      label: "Tahmini değer",
      value: formatTry(stats.estimatedValue),
      icon: Coins,
      accent: "from-sky-600 to-sky-500 dark:from-sky-300 dark:to-sky-200",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <article
          key={c.label}
          className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-inner ${c.accent}`}
          >
            <c.icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{c.label}</p>
            <p className="truncate text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">{c.value}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
