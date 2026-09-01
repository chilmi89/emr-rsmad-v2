"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  Edit2,
  Trash2,
} from "lucide-react";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newEmp, setNewEmp] = useState({
    code: "",
    name: "",
    department: "Keperawatan",
    email: "",
  });

  const [employees, setEmployees] = useState([
    { id: "1", code: "PEG-001", name: "dr. Hendra Pratama, Sp.PD", department: "Dokter", email: "hendra.pratama@rsmad.internal", active: true },
    { id: "2", code: "PEG-002", name: "dr. Ratna Kartika, Sp.A", department: "Dokter", email: "ratna.kartika@rsmad.internal", active: true },
    { id: "3", code: "PEG-003", name: "Ns. Siti Rahmawati, S.Kep", department: "Keperawatan", email: "siti.rahma@rsmad.internal", active: true },
    { id: "4", code: "PEG-004", name: "Ns. Budi Santoso, Amd.Kep", department: "Keperawatan", email: "budi.santoso@rsmad.internal", active: true },
    { id: "5", code: "PEG-005", name: "Apt. Dewi Lestari, S.Farm", department: "Farmasi", email: "dewi.farmasi@rsmad.internal", active: true },
    { id: "6", code: "PEG-006", name: "Ahmad Fauzi, A.Md.AK", department: "Laboratorium", email: "ahmad.lab@rsmad.internal", active: true },
    { id: "7", code: "PEG-007", name: "Rina Wulandari, S.E", department: "Administrasi", email: "rina.adm@rsmad.internal", active: true },
    { id: "8", code: "PEG-008", name: "Agus Prasetyo, S.Kom", department: "IT/EDP", email: "agus.it@rsmad.internal", active: true },
    { id: "9", code: "PEG-009", name: "Nurul Hidayah, Amd.Rad", department: "Radiologi", email: "nurul.rad@rsmad.internal", active: true },
    { id: "10", code: "PEG-010", name: "Tri Wahyuni, A.Md.PK", department: "Rekam Medis", email: "tri.rm@rsmad.internal", active: true },
  ]);

  const departments = ["ALL", "Dokter", "Keperawatan", "Farmasi", "Laboratorium", "Administrasi", "IT/EDP", "Radiologi", "Rekam Medis"];

  const filtered = employees.filter((e) => {
    const matchesDept = selectedDept === "ALL" || e.department === selectedDept;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.code) return;

    setEmployees([
      ...employees,
      {
        id: String(Date.now()),
        code: newEmp.code,
        name: newEmp.name,
        department: newEmp.department,
        email: newEmp.email || `${newEmp.code.toLowerCase()}@rsmad.internal`,
        active: true,
      },
    ]);

    setNewEmp({ code: "", name: "", department: "Keperawatan", email: "" });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Manajemen Pegawai & Peserta Simulasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data minimal pegawai untuk target evaluasi kesadaran keamanan informasi rumah sakit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pegawai</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NIP/Kode, departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="flex items-center gap-1.5">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Kode/NIP</th>
                <th className="px-5 py-3.5">Nama Pegawai</th>
                <th className="px-5 py-3.5">Departemen / Unit</th>
                <th className="px-5 py-3.5">Email / Identifier</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-500">{emp.code}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{emp.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <Building2 className="w-3 h-3" />
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{emp.email}</td>
                  <td className="px-5 py-3.5">
                    {emp.active ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Tambah Pegawai Baru
            </h2>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / Kode Pegawai
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PEG-011"
                  value={newEmp.code}
                  onChange={(e) => setNewEmp({ ...newEmp, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap (dengan Gelar)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: dr. Andi Wijaya, Sp.An"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departemen / Unit Layanan
                </label>
                <select
                  value={newEmp.department}
                  onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Dokter">Dokter</option>
                  <option value="Keperawatan">Keperawatan</option>
                  <option value="Farmasi">Farmasi</option>
                  <option value="Laboratorium">Laboratorium</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="IT/EDP">IT/EDP</option>
                  <option value="Radiologi">Radiologi</option>
                  <option value="Rekam Medis">Rekam Medis</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Internal / Identifier
                </label>
                <input
                  type="email"
                  placeholder="andi.anestesi@rsmad.internal"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
