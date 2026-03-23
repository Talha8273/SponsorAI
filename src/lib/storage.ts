import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { SECTORS, STATUSES, type Company, type Sector, type Status } from "../types";

function isSector(s: string): s is Sector {
  return (SECTORS as readonly string[]).includes(s);
}

function isStatus(s: string): s is Status {
  return (STATUSES as readonly string[]).includes(s);
}

function normalizeCompany(docId: string, raw: unknown): Company | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.name !== "string" ||
    typeof o.sector !== "string" ||
    typeof o.status !== "string" ||
    typeof o.createdAt !== "number"
  ) {
    return null;
  }
  if (!isSector(o.sector) || !isStatus(o.status)) return null;

  let estimatedBudget: number | null = null;
  if (o.estimatedBudget === null || o.estimatedBudget === undefined) {
    estimatedBudget = null;
  } else if (typeof o.estimatedBudget === "number" && Number.isFinite(o.estimatedBudget)) {
    estimatedBudget = o.estimatedBudget;
  }

  return {
    id: docId,
    name: o.name,
    sector: o.sector,
    status: o.status,
    createdAt: o.createdAt,
    corporateEmail: typeof o.corporateEmail === "string" ? o.corporateEmail : "",
    contactName: typeof o.contactName === "string" ? o.contactName : "",
    contactTitle: typeof o.contactTitle === "string" ? o.contactTitle : "",
    contactInfo: typeof o.contactInfo === "string" ? o.contactInfo : "",
    meetingNotes: typeof o.meetingNotes === "string" ? o.meetingNotes : "",
    estimatedBudget,
  };
}

const COMPANIES_COLLECTION = "companies";

export function subscribeCompanies(onCompanies: (next: Company[]) => void) {
  const q = query(collection(db, COMPANIES_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const next: Company[] = snap.docs
        .map((d) => normalizeCompany(d.id, d.data()))
        .filter((c): c is Company => c !== null);
      onCompanies(next);
    },
    (err) => {
      console.error("Failed to subscribe companies:", err);
    },
  );
}

export async function createCompany(company: Company): Promise<void> {
  // `merge:true` ile id/createdAt alanlarını da dahil aynı şemaya taşımış oluyoruz.
  await setDoc(doc(db, COMPANIES_COLLECTION, company.id), company, { merge: true });
}

export async function updateCompany(id: string, patch: Partial<Omit<Company, "id" | "createdAt">>): Promise<void> {
  await updateDoc(doc(db, COMPANIES_COLLECTION, id), patch);
}

export async function deleteCompanies(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, COMPANIES_COLLECTION, id)));
  await batch.commit();
}

export async function bulkSetStatus(ids: string[], status: Status): Promise<void> {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  ids.forEach((id) => batch.update(doc(db, COMPANIES_COLLECTION, id), { status }));
  await batch.commit();
}
