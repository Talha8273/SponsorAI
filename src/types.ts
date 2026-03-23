export const SECTORS = [
  "Gıda",
  "Kozmetik",
  "Kırtasiye",
  "Çekiliş",
  "Kupon",
  "İçecek",
  "Hediye",
  "Finans",
  "Teknoloji",
  "Diğer",
] as const;
export type Sector = (typeof SECTORS)[number];

export const STATUSES = ["Beklemede", "Görüşüldü", "Red", "Onaylandı"] as const;
export type Status = (typeof STATUSES)[number];

export interface Company {
  id: string;
  name: string;
  sector: Sector;
  status: Status;
  createdAt: number;
  /** Kurumsal / sponsorluk iletişim e-postası (BCC toplu gönderim için) */
  corporateEmail: string;
  contactName: string;
  contactTitle: string;
  contactInfo: string;
  meetingNotes: string;
  /** Tahmini bütçe (TRY); boş ise null */
  estimatedBudget: number | null;
}

export interface SavedEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: number;
}
