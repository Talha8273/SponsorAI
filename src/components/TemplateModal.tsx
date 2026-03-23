import { Copy, Mail, Save, Sparkles, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Company, SavedEmailTemplate } from "../types";
import { deleteSavedTemplate, subscribeSavedTemplates, upsertSavedTemplate } from "../lib/savedTemplates";

type Props = {
  company: Company | null;
  onClose: () => void;
};

const DEFAULT_SUBJECT_TEMPLATE = "Sponsorluk iş birliği — [FİRMA_ADI]";

const DEFAULT_BODY_TEMPLATE = `Sayın [FİRMA_ADI] Yetkilileri,

${"Marmara Üniversitesi Psikoloji ve Gelişim Kulübü"} olarak kampüs içi etkinliklerimizde [SEKTÖR] alanında faaliyet gösteren markanızla bir iş birliği geliştirmek istiyoruz.

Kısa özet:
• Hedef kitle: üniversite öğrencileri ve genç profesyoneller
• Sunulan değer: sosyal medya duyuruları, stant / sampling imkânı, logo kullanımı (detaylar görüşmeye göre)

Uygun olduğunuz bir tarihte 15 dakikalık bir görüşme ayarlayabilirsek çok memnun oluruz.

Saygılarımızla,
Talha Cürmen
Finans Komünite Lideri
[Telefon]
[E-posta]`;

function normalizePlaceholderKey(key: string): string {
  const noDiacritics = key.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  return noDiacritics
    .toLocaleUpperCase("tr")
    .replace(/[\s-]+/g, "")
    .replace(/[^A-Z0-9_]/g, "");
}

function applySmartReplacements(template: string, company: Company): string {
  return template.replace(/\[([^\]]+)\]/g, (fullMatch, rawToken: string) => {
    const normalized = normalizePlaceholderKey(rawToken);
    if (normalized === "FIRMA_ADI" || normalized === "FIRMAADI") return company.name;
    if (normalized === "SEKTOR") return company.sector;
    return fullMatch;
  });
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

export function TemplateModal({ company, onClose }: Props) {
  const [savedTemplates, setSavedTemplates] = useState<SavedEmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("default");

  const [subjectTemplate, setSubjectTemplate] = useState<string>(DEFAULT_SUBJECT_TEMPLATE);
  const [bodyTemplate, setBodyTemplate] = useState<string>(DEFAULT_BODY_TEMPLATE);

  const [saveName, setSaveName] = useState<string>("");

  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [sendError, setSendError] = useState<string>("");

  useEffect(() => {
    if (!company) return;
    setSavedTemplates([]);
    setSelectedTemplateId("default");
    setSubjectTemplate(DEFAULT_SUBJECT_TEMPLATE);
    setBodyTemplate(DEFAULT_BODY_TEMPLATE);
    setSaveName("");
    setCopyState("idle");
    setSendError("");

    const unsubscribe = subscribeSavedTemplates(setSavedTemplates);
    return () => unsubscribe();
  }, [company?.id]);

  useEffect(() => {
    if (!company) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [company, onClose]);

  const selectedTemplate = useMemo(() => {
    if (selectedTemplateId === "default") return null;
    return savedTemplates.find((t) => t.id === selectedTemplateId) ?? null;
  }, [savedTemplates, selectedTemplateId]);

  const toEmail = company?.corporateEmail.trim() ?? "";

  const finalSubject = useMemo(() => {
    if (!company) return subjectTemplate;
    return applySmartReplacements(subjectTemplate, company);
  }, [company, subjectTemplate]);

  const finalBody = useMemo(() => {
    if (!company) return bodyTemplate;
    return applySmartReplacements(bodyTemplate, company);
  }, [company, bodyTemplate]);

  const mailHref = useMemo(() => {
    if (!company) return undefined;
    const mailtoLink = `mailto:${company.corporateEmail || ""}?subject=${encodeURIComponent(
      finalSubject,
    )}&body=${encodeURIComponent(finalBody)}`;
    if (!toEmail) return undefined;
    return mailtoLink;
  }, [company, toEmail, finalSubject, finalBody]);

  const handleCopy = useCallback(async () => {
    setCopyState("idle");
    setSendError("");
    const text = `Konu: ${finalSubject}\n\n${finalBody}`.trim();
    try {
      await copyToClipboard(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("error");
    }
  }, [finalBody, finalSubject]);

  const handleSaveTemplate = useCallback(async () => {
    const name = saveName.trim();
    if (!name) return;

    const subject = subjectTemplate;
    const body = bodyTemplate;
    if (!subject.trim() || !body.trim()) return;

    if (selectedTemplateId === "default") {
      const newTemplate: SavedEmailTemplate = {
        id: crypto.randomUUID(),
        name,
        subject,
        body,
        createdAt: Date.now(),
      };
      await upsertSavedTemplate(newTemplate);
      setSelectedTemplateId(newTemplate.id);
      return;
    }

    if (!selectedTemplate) return;
    const updated: SavedEmailTemplate = { ...selectedTemplate, name, subject, body };
    await upsertSavedTemplate(updated);
  }, [bodyTemplate, saveName, selectedTemplate, selectedTemplateId, subjectTemplate]);

  const handleDeleteTemplate = useCallback(async () => {
    if (!selectedTemplate) return;
    const ok = window.confirm(`"${selectedTemplate.name}" şablonunu silmek istiyor musunuz?`);
    if (!ok) return;

    await deleteSavedTemplate(selectedTemplate.id);

    setSelectedTemplateId("default");
    setSaveName("");
    setSubjectTemplate(DEFAULT_SUBJECT_TEMPLATE);
    setBodyTemplate(DEFAULT_BODY_TEMPLATE);
  }, [selectedTemplate]);

  const handleSelectedTemplateChange = useCallback(
    (nextId: string) => {
      setSelectedTemplateId(nextId);
      setSendError("");

      if (nextId === "default") {
        setSubjectTemplate(DEFAULT_SUBJECT_TEMPLATE);
        setBodyTemplate(DEFAULT_BODY_TEMPLATE);
        setSaveName("");
        return;
      }

      const t = savedTemplates.find((x) => x.id === nextId);
      if (!t) return;
      setSubjectTemplate(t.subject);
      setBodyTemplate(t.body);
      setSaveName(t.name);
    },
    [savedTemplates],
  );

  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        aria-label="Modali kapat"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 left-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Şablon oluştur"
          className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow-md dark:from-slate-200 dark:to-slate-400 dark:text-slate-900">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Şablon üret</h2>
                <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                  {company.name} · {company.sector}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto px-5 py-4">
            <section className="space-y-4">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Yer tutucular
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  Şablonunuzda şu ifadeleri kullanabilirsiniz:{" "}
                  <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-900 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700">
                    [FİRMA_ADI]
                  </code>{" "}
                  ve{" "}
                  <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-900 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700">
                    [SEKTÖR]
                  </code>
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="template-picker"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Kaydedilmiş şablon
                  </label>
                  <select
                    id="template-picker"
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectedTemplateChange(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
                  >
                    <option value="default">Varsayılan (yer tutucu)</option>
                    {savedTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="template-subject"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Konu
                </label>
                <input
                  id="template-subject"
                  type="text"
                  value={subjectTemplate}
                  onChange={(e) => setSubjectTemplate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400/30 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="template-body"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Mesaj
                </label>
                <textarea
                  id="template-body"
                  value={bodyTemplate}
                  onChange={(e) => setBodyTemplate(e.target.value)}
                  rows={10}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none ring-slate-400/30 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
                  spellCheck
                />
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Önizleme</p>
                <p className="mt-2 break-words text-sm font-semibold text-slate-900 dark:text-white">{finalSubject}</p>
                <pre className="mt-2 max-h-56 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {finalBody}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex-1">
                    <label
                      htmlFor="template-save-name"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      Şablon adı
                    </label>
                    <input
                      id="template-save-name"
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="Örn. İkram + Stant (Genel)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400/30 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveTemplate}
                      disabled={!saveName.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    >
                      <Save className="h-4 w-4" aria-hidden />
                      {selectedTemplateId === "default" ? "Kaydet" : "Güncelle"}
                    </button>

                    {selectedTemplate && (
                      <button
                        type="button"
                        onClick={handleDeleteTemplate}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-300/80 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-900 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100 dark:hover:bg-rose-950/60"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/90 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50">
            {sendError ? <p className="mb-3 text-sm font-medium text-rose-700 dark:text-rose-300">{sendError}</p> : null}
            <div className="flex gap-3">
              <a
                href={mailHref}
                onClick={(e) => {
                  if (!toEmail) {
                    e.preventDefault();
                    setSendError("Mail göndermek için kurumsal e-posta alanını doldurun.");
                  }
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Mail Gönder
              </a>

              <button
                type="button"
                onClick={() => void handleCopy()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <Copy className="h-4 w-4" aria-hidden />
                {copyState === "copied" ? "Kopyalandı" : copyState === "error" ? "Kopyalama hatası" : "Panoya Kopyala"}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Kopyalama: konu + mesaj birlikte panoya alınır.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
