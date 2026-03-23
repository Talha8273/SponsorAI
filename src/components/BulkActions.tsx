import { Copy, Mail, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { STATUSES, type Company, type Status } from "../types";

type Props = {
  selectedCount: number;
  selectedCompanies: Company[];
  onCopyEmails: () => void;
  onBulkStatus: (status: Status) => void;
  onBulkDelete: () => void;
};

export function BulkActions({
  selectedCount,
  selectedCompanies,
  onCopyEmails,
  onBulkStatus,
  onBulkDelete,
}: Props) {
  const [statusPick, setStatusPick] = useState<Status>("Beklemede");

  if (selectedCount === 0) return null;

  const withEmail = selectedCompanies.filter((c) => c.corporateEmail.trim().length > 0).length;

  // İşte Toplu Mail Motorumuz!
  const handleBulkMailClick = () => {
    const emails = selectedCompanies
      .map((c) => c.corporateEmail.trim())
      .filter((email) => email.length > 0);

    if (emails.length === 0) return;

    // Tüm mailleri BCC (Gizli) olarak virgülle birleştir
    const bccList = emails.join(",");
    const subject = encodeURIComponent("Sponsorluk ve İş Birliği");
    
    // Güvenlik ve Outlook uyumluluğu için mailto linkini oluştur
    const mailtoLink = `mailto:?bcc=${bccList}&subject=${subject}`;
    
    // Varsayılan mail uygulamasını (Outlook/Gmail) aç
    window.location.href = mailtoLink;
  };

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/90 px-4 py-3 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/40 sm:flex-row sm:items-center sm:justify-between"
      role="region"
      aria-label="Toplu işlemler"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-sky-950 dark:text-sky-100">
        <Users className="h-4 w-4 shrink-0" aria-hidden />
        <span>
          Toplu işlemler · <span className="font-semibold">{selectedCount}</span> seçili
          {withEmail < selectedCount && (
            <span className="ml-1 text-xs font-normal text-sky-800/80 dark:text-sky-300/90">
              ({withEmail} kurumsal mail dolu)
            </span>
          )}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopyEmails}
          className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300/80 bg-white px-3 py-2 text-xs font-semibold text-sky-950 shadow-sm transition hover:bg-sky-100/80 dark:border-sky-700 dark:bg-slate-900 dark:text-sky-50 dark:hover:bg-slate-800"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Mailleri kopyala
        </button>
        
        {/* Yenilenmiş Toplu Mail Butonu */}
        <button
          type="button"
          onClick={handleBulkMailClick}
          disabled={withEmail === 0}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-700 px-3 py-2 text-xs font-semibold text-white shadow transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden />
          Toplu Mail Gönder
        </button>

        <div className="flex items-center gap-1.5">
          <select
            value={statusPick}
            onChange={(e) => setStatusPick(e.target.value as Status)}
            className="min-w-[9.5rem] cursor-pointer rounded-xl border border-sky-300/80 bg-white px-2 py-2 text-xs outline-none ring-sky-400/30 focus:ring-2 dark:border-sky-700 dark:bg-slate-950 dark:focus:ring-sky-600"
            aria-label="Toplu durum"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onBulkStatus(statusPick)}
            className="rounded-xl bg-sky-700 px-3 py-2 text-xs font-semibold text-white shadow transition hover:bg-sky-800 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            Durum güncelle
          </button>
        </div>
        <button
          type="button"
          onClick={onBulkDelete}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300/90 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-900 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-100 dark:hover:bg-rose-950"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Toplu sil
        </button>
      </div>
    </div>
  );
}
