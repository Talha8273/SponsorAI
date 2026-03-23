import { useCallback, useEffect, useState } from "react";
import type { Company, Status } from "../types";
import {
  bulkSetStatus as bulkSetStatusDoc,
  createCompany,
  deleteCompanies as deleteCompaniesDoc,
  subscribeCompanies,
  updateCompany as updateCompanyDoc,
} from "../lib/storage";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCompanies((next) => {
      setCompanies(next);
      setHydrated(true);
    });
    return () => unsubscribe();
  }, []);

  const addCompany = useCallback((name: string, sector: Company["sector"]) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const next: Company = {
      id: crypto.randomUUID(),
      name: trimmed,
      sector,
      status: "Beklemede",
      createdAt: Date.now(),
      corporateEmail: "",
      contactName: "",
      contactTitle: "",
      contactInfo: "",
      meetingNotes: "",
      estimatedBudget: null,
    };
    void createCompany(next).catch((e) => console.error("Failed to create company:", e));
  }, []);

  const setStatus = useCallback((id: string, status: Status) => {
    void updateCompanyDoc(id, { status }).catch((e) => console.error("Failed to update status:", e));
  }, []);

  const updateCompany = useCallback((id: string, patch: Partial<Omit<Company, "id" | "createdAt">>) => {
    void updateCompanyDoc(id, patch).catch((e) => console.error("Failed to update company:", e));
  }, []);

  const deleteCompanies = useCallback((ids: string[]) => {
    void deleteCompaniesDoc(ids).catch((e) => console.error("Failed to delete companies:", e));
  }, []);

  const bulkSetStatus = useCallback((ids: string[], status: Status) => {
    void bulkSetStatusDoc(ids, status).catch((e) => console.error("Failed to bulk set status:", e));
  }, []);

  return {
    companies,
    hydrated,
    addCompany,
    setStatus,
    updateCompany,
    deleteCompanies,
    bulkSetStatus,
  };
}
