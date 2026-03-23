import { Filter, Search } from "lucide-react";
import { SECTORS, STATUSES, type Sector, type Status } from "../types";

type FilterSector = Sector | "Tümü";
type FilterStatus = Status | "Tümü";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  sector: FilterSector;
  onSectorChange: (s: FilterSector) => void;
  status: FilterStatus;
  onStatusChange: (s: FilterStatus) => void;
};

const ALL_SECTOR: FilterSector = "Tümü";
const ALL_STATUS: FilterStatus = "Tümü";

export function FilterBar({ query, onQueryChange, sector, onSectorChange, status, onStatusChange }: Props) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="İsme göre ara..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-slate-400/30 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
          aria-label="Firma ara"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" aria-hidden />
            Sektör
          </span>
          <select
            value={sector}
            onChange={(e) => onSectorChange(e.target.value as FilterSector)}
            className="min-w-[10rem] cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 transition focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            aria-label="Sektör filtresi"
          >
            <option value={ALL_SECTOR}>Tümü</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Durum</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
            className="min-w-[10rem] cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 transition focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            aria-label="Durum filtresi"
          >
            <option value={ALL_STATUS}>Tümü</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
