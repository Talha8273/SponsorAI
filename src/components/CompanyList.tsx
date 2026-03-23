import { FileText, LayoutGrid } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Company, Status } from "../types";
import { STATUSES } from "../types";
import { StatusBadge } from "./StatusBadge";

type Props = {
  companies: Company[];
  hasAnyCompanies: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onStatusChange: (id: string, status: Status) => void;
  onOpenTemplate: (company: Company) => void;
  onOpenDetail: (company: Company) => void;
};

export function CompanyList({
  companies,
  hasAnyCompanies,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  allVisibleSelected,
  someVisibleSelected,
  onStatusChange,
  onOpenTemplate,
  onOpenDetail,
}: Props) {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const selectedSet = new Set(selectedIds);

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = someVisibleSelected && !allVisibleSelected;
  }, [someVisibleSelected, allVisibleSelected]);

  if (!hasAnyCompanies) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" aria-hidden />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Henüz firma yok</p>
        <p className="mt-1 text-sm text-slate-500">Yukarıdan ilk sponsor adayınızı ekleyerek başlayın.</p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" aria-hidden />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Sonuç bulunamadı</p>
        <p className="mt-1 text-sm text-slate-500">Filtreleri veya arama terimini güncelleyin.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400">
              <th className="w-10 px-2 py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allVisibleSelected && companies.length > 0}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-950"
                  aria-label="Görünen tümünü seç"
                />
              </th>
              <th className="px-4 py-3">Şirket</th>
              <th className="px-4 py-3">Kurumsal mail</th>
              <th className="px-4 py-3">Sektör</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {companies.map((c) => (
              <tr
                key={c.id}
                onClick={() => onOpenDetail(c)}
                className="cursor-pointer transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-2 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedSet.has(c.id)}
                    onChange={() => onToggleSelect(c.id)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-950"
                    aria-label={`${c.name} seç`}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{c.name}</td>
                <td className="max-w-[12rem] truncate px-4 py-3 text-slate-600 dark:text-slate-300" title={c.corporateEmail || undefined}>
                  {c.corporateEmail.trim() ? c.corporateEmail : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.sector}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={c.status} />
                    <select
                      value={c.status}
                      onChange={(e) => onStatusChange(c.id, e.target.value as Status)}
                      className="max-w-[11rem] cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none ring-slate-400/20 focus:ring-2 dark:border-slate-600 dark:bg-slate-950"
                      aria-label={`${c.name} durumunu güncelle`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onOpenTemplate(c)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                    Şablon üret
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
