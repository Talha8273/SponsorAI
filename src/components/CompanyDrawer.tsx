import { Building2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Company, Sector } from "../types";
import { SECTORS } from "../types";

type Props = {
  company: Company | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Omit<Company, "id" | "createdAt">>) => void;
};

function parseBudget(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function CompanyDrawer({ company, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState<Sector>("Gıda");
  const [corporateEmail, setCorporateEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [budgetInput, setBudgetInput] = useState("");

  useEffect(() => {
    if (!company) return;
    setName(company.name);
    setSector(company.sector);
    setCorporateEmail(company.corporateEmail);
    setContactName(company.contactName);
    setContactTitle(company.contactTitle);
    setContactInfo(company.contactInfo);
    setMeetingNotes(company.meetingNotes);
    setBudgetInput(company.estimatedBudget != null ? String(company.estimatedBudget) : "");
  }, [company]);

  useEffect(() => {
    if (!company) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [company, onClose]);

  if (!company) return null;

  const active = company;

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave(active.id, {
      name: trimmedName,
      sector,
      corporateEmail: corporateEmail.trim(),
      contactName: contactName.trim(),
      contactTitle: contactTitle.trim(),
      contactInfo: contactInfo.trim(),
      meetingNotes: meetingNotes.trim(),
      estimatedBudget: parseBudget(budgetInput),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        aria-label="Paneli kapat"
        onClick={onClose}
      />
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        aria-labelledby="drawer-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              <Building2 className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="drawer-title" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Firma detayı
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Bilgileri güncelleyip kaydedin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <div>
            <label htmlFor="company-name-edit" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Şirket adı
            </label>
            <input
              id="company-name-edit"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            />
          </div>
          <div>
            <label htmlFor="company-sector-edit" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Sektör
            </label>
            <select
              id="company-sector-edit"
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="corp-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Kurumsal e-posta
            </label>
            <input
              id="corp-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={corporateEmail}
              onChange={(e) => setCorporateEmail(e.target.value)}
              placeholder="ornek@sirket.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Yetkili bilgileri</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Ad
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
                />
              </div>
              <div>
                <label htmlFor="contact-title" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Unvan
                </label>
                <input
                  id="contact-title"
                  type="text"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
                />
              </div>
              <div>
                <label htmlFor="contact-info" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  İletişim
                </label>
                <input
                  id="contact-info"
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Telefon, e-posta veya LinkedIn"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="meeting-notes" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Görüşme notları
            </label>
            <textarea
              id="meeting-notes"
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
              spellCheck
            />
          </div>

          <div>
            <label htmlFor="budget" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Tahmini bütçe (TRY)
            </label>
            <input
              id="budget"
              type="text"
              inputMode="decimal"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Örn. 25000"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/90 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white sm:w-auto"
          >
            <Save className="h-4 w-4" aria-hidden />
            Kaydet ve kapat
          </button>
        </div>
      </aside>
    </div>
  );
}
