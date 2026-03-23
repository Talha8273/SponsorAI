import { Mail, Moon, Sparkles, Sun } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddCompanyForm } from "./components/AddCompanyForm";
import { BulkActions } from "./components/BulkActions";
import { CompanyDrawer } from "./components/CompanyDrawer";
import { CompanyList } from "./components/CompanyList";
import { DashboardCards } from "./components/DashboardCards";
import { FilterBar } from "./components/FilterBar";
import { TemplateModal } from "./components/TemplateModal";
import { useCompanies } from "./hooks/useCompanies";
import type { Company, Sector, Status } from "./types";

const THEME_KEY = "sponsorai:theme";

function readInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function App() {
  const { companies, hydrated, addCompany, setStatus, updateCompany, deleteCompanies, bulkSetStatus } = useCompanies();
  const [query, setQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState<Sector | "Tümü">("Tümü");
  const [statusFilter, setStatusFilter] = useState<Status | "Tümü">("Tümü");
  const [templateFor, setTemplateFor] = useState<Company | null>(null);
  const [dark, setDark] = useState(readInitialDark);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    setSelectedIds([]);
  }, [query, sectorFilter, statusFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return companies.filter((c) => {
      const sectorOk = sectorFilter === "Tümü" || c.sector === sectorFilter;
      const statusOk = statusFilter === "Tümü" || c.status === statusFilter;
      const nameOk = !q || c.name.toLocaleLowerCase("tr").includes(q);
      return sectorOk && statusOk && nameOk;
    });
  }, [companies, query, sectorFilter, statusFilter]);

  const visibleIds = useMemo(() => filtered.map((c) => c.id), [filtered]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id));
  const someVisibleSelected = filtered.some((c) => selectedIds.includes(c.id));

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return Array.from(next);
      });
    }
  }, [allVisibleSelected, visibleIds]);

  const selectedCompanies = useMemo(
    () => companies.filter((c) => selectedIds.includes(c.id)),
    [companies, selectedIds],
  );

  const copyEmails = useCallback(async () => {
    const emails = selectedCompanies
      .map((c) => c.corporateEmail.trim())
      .filter(Boolean);
    const text = emails.join(", ");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }, [selectedCompanies]);

  const bulkSendMail = useCallback(() => {
    const emails = selectedCompanies
      .map((c) => c.corporateEmail.trim())
      .filter(Boolean);
    if (emails.length === 0) return;

    const href = `mailto:?bcc=${emails.join(",")}`;
    window.location.href = href;
  }, [selectedCompanies]);

  const onBulkStatus = useCallback(
    (status: Status) => {
      if (selectedIds.length === 0) return;
      bulkSetStatus(selectedIds, status);
    },
    [bulkSetStatus, selectedIds],
  );

  const onBulkDelete = useCallback(() => {
    if (selectedIds.length === 0) return;
    const ok = window.confirm(`${selectedIds.length} firmayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`);
    if (!ok) return;
    deleteCompanies(selectedIds);
    setSelectedIds([]);
  }, [deleteCompanies, selectedIds]);

  const detailCompany = useMemo(
    () => (detailId ? companies.find((c) => c.id === detailId) ?? null : null),
    [companies, detailId],
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        Yükleniyor…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow-md dark:from-slate-200 dark:to-slate-400 dark:text-slate-900">
              <Sparkles className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SponsorAI</h1>
              <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                Sponsor adaylarını takip edin, sektöre göre filtreleyin ve tek tıkla profesyonel teklif e-postası şablonu oluşturun.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              aria-label={dark ? "Açık tema" : "Koyu tema"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {dark ? "Açık" : "Koyu"}
            </button>
            <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:inline-flex">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Veriler Firestore'da saklanır
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <DashboardCards companies={companies} />

        <AddCompanyForm onAdd={addCompany} />

        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Firmalar</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Liste görünümü · satıra tıklayarak detayları düzenleyin, toplu işlemler ve şablon kullanın.
              </p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{filtered.length}</span> /{" "}
              {companies.length} kayıt
            </p>
          </div>

          <FilterBar
            query={query}
            onQueryChange={setQuery}
            sector={sectorFilter}
            onSectorChange={setSectorFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <BulkActions
            selectedCount={selectedIds.length}
            selectedCompanies={selectedCompanies}
            onCopyEmails={() => void copyEmails()}
            onBulkSendMail={bulkSendMail}
            onBulkStatus={onBulkStatus}
            onBulkDelete={onBulkDelete}
          />

          <CompanyList
            companies={filtered}
            hasAnyCompanies={companies.length > 0}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            allVisibleSelected={allVisibleSelected}
            someVisibleSelected={someVisibleSelected}
            onStatusChange={(id: string, status: Status) => setStatus(id, status)}
            onOpenTemplate={setTemplateFor}
            onOpenDetail={(c: Company) => setDetailId(c.id)}
          />
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        SponsorAI · MVP — Firestore · Şablon motoru mock
      </footer>

      <TemplateModal company={templateFor} onClose={() => setTemplateFor(null)} />

      <CompanyDrawer
        company={detailCompany}
        onClose={() => setDetailId(null)}
        onSave={(id, patch) => updateCompany(id, patch)}
      />
    </div>
  );
}
