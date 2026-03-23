import { Building2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SECTORS, type Sector } from "../types";

type Props = {
  onAdd: (name: string, sector: Sector) => void;
};

export function AddCompanyForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState<Sector>("Gıda");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAdd(name, sector);
    setName("");
    setSector("Gıda");
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          <Building2 className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Yeni firma ekle</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Şirket adı ve sektör seçerek listeye ekleyin.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="company-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Şirket adı
          </label>
          <input
            id="company-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn. Örnek Gıda A.Ş."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-slate-400/30 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
            autoComplete="organization"
          />
        </div>
        <div className="sm:w-48">
          <label htmlFor="sector" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sektör
          </label>
          <select
            id="sector"
            value={sector}
            onChange={(e) => setSector(e.target.value as Sector)}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-slate-400/30 transition focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Listeye ekle
        </button>
      </form>
    </section>
  );
}
