import type { Status } from "../types";

const styles: Record<Status, string> = {
  Beklemede: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
  Görüşüldü: "bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-100",
  Red: "bg-rose-100 text-rose-900 dark:bg-rose-950/50 dark:text-rose-100",
  Onaylandı: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100",
};

type Props = { status: Status };

export function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
