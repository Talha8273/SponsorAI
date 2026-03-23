import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { SavedEmailTemplate } from "../types";

const TEMPLATES_COLLECTION = "templates";

function normalizeSavedTemplate(docId: string, raw: unknown): SavedEmailTemplate | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.name !== "string") return null;
  if (typeof o.subject !== "string") return null;
  if (typeof o.body !== "string") return null;
  if (typeof o.createdAt !== "number") return null;

  return {
    id: docId,
    name: o.name,
    subject: o.subject,
    body: o.body,
    createdAt: o.createdAt,
  };
}

export function subscribeSavedTemplates(onTemplates: (next: SavedEmailTemplate[]) => void) {
  const q = query(collection(db, TEMPLATES_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const next: SavedEmailTemplate[] = snap.docs
        .map((d) => normalizeSavedTemplate(d.id, d.data()))
        .filter((t): t is SavedEmailTemplate => t !== null);
      onTemplates(next);
    },
    (err) => {
      console.error("Failed to subscribe saved templates:", err);
    },
  );
}

export async function upsertSavedTemplate(template: SavedEmailTemplate): Promise<void> {
  await setDoc(doc(db, TEMPLATES_COLLECTION, template.id), template, { merge: true });
}

export async function deleteSavedTemplate(id: string): Promise<void> {
  await deleteDoc(doc(db, TEMPLATES_COLLECTION, id));
}
