import React from "react";
import EmrLoginSimulation from "@/components/simulation/EmrLoginSimulation";

interface AuthEmrLoginPageProps {
  searchParams?: Promise<{
    token?: string;
  }>;
}

export default async function AuthEmrLoginPage({ searchParams }: AuthEmrLoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const token = resolvedSearchParams?.token || "demo-token";

  return (
    <EmrLoginSimulation
      token={token}
      scenarioName="EMR RSMAD - Verifikasi Akses Masuk"
      department="Unit Layanan Rawat Inap & Poliklinik"
      employeeName="Staf Medis / Pegawai Rumah Sakit"
    />
  );
}
