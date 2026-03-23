import type { Company, Sector } from "../types";

const ORG_NAME = "Marmara Üniversitesi Psikoloji ve Gelişim Kulübü";
const CONTACT_NAME = "Talha Cürmen";
const CONTACT_ROLE = "Finans Komünite Lideri";

const sectorHints: Record<Sector, string> = {
  Gıda: "kampüs etkinliklerinde ikram ve marka görünürlüğü",
  Kozmetik: "genç kitleye yönelik deneyim ve ürün tanıtımı",
  Kırtasiye: "etkinlik materyalleri ve öğrenci ihtiyaçları",
  Çekiliş: "kampüs etkinliklerinde çekiliş ve ödül sponsorluğu",
  Kupon: "öğrencilere yönelik indirim ve kampanya iş birlikleri",
  İçecek: "etkinlik ikramı ve marka deneyimi",
  Hediye: "ödül ve promosyon desteği",
  Finans: "finansal ürünler ve genç kitleye özel programlar",
  Teknoloji: "dijital çözümler ve kampüs teknoloji etkinlikleri",
  Diğer: "ortaklık ve sponsorluk iş birlikleri",
};

export function buildEmailTemplate(company: Company): { subject: string; body: string } {
  const hint = sectorHints[company.sector] ?? sectorHints["Diğer"];
  const subject = `Sponsorluk iş birliği — ${company.name}`;
  const body = `Sayın ${company.name} Yetkilileri,

${ORG_NAME} olarak kampüs içi etkinliklerimizde ${company.sector} alanında faaliyet gösteren markanızla ${hint} konusunda bir iş birliği geliştirmek istiyoruz.

Kısa özet:
• Hedef kitle: üniversite öğrencileri ve genç profesyoneller
• Sunulan değer: sosyal medya duyuruları, stant / sampling imkânı, logo kullanımı (detaylar görüşmeye göre)

Uygun olduğunuz bir tarihte 15 dakikalık bir görüşme ayarlayabilirsek çok memnun oluruz.

Saygılarımızla,
${CONTACT_NAME}
${CONTACT_ROLE}
[Telefon]
[E-posta]`;

  return { subject, body };
}

export function mailtoHref(to: string, subject: string, body: string): string {
  const q = new URLSearchParams({ subject, body });
  return `mailto:${encodeURIComponent(to)}?${q.toString()}`;
}
