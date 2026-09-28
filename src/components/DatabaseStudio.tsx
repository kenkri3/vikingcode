"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  Table as TableIcon,
  Plus,
  Trash2,
  Search,
  Download,
  Check,
  RefreshCw,
  FileCode,
  ShieldCheck,
  Filter,
  Layers,
  X,
} from "lucide-react";
import { ProjectFile } from "@/lib/types";

interface DatabaseStudioProps {
  files: ProjectFile[];
  projectName: string;
}

interface ParsedField {
  name: string;
  type: string;
  isId: boolean;
  isOptional: boolean;
}

interface ParsedModel {
  name: string;
  fields: ParsedField[];
  records: Record<string, any>[];
}

export function DatabaseStudio({ files, projectName }: DatabaseStudioProps) {
  const prismaFile = files.find((f) => f.path.includes("schema.prisma"));
  const rawSchema =
    prismaFile?.content ||
    `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Booking {
  id           String   @id @default(uuid())
  service      String
  squareMeters Int?
  totalPrice   Int
  contactInfo  String
  status       String   @default("PENDING")
  createdAt    DateTime @default(now())
}

model PatientConsultation {
  id               String   @id @default(uuid())
  patientName      String
  patientPhone     String
  serviceTitle     String
  consultationType String   @default("video")
  appointmentSlot  String
  price            Int
  status           String   @default("CONFIRMED")
  createdAt        DateTime @default(now())
}

model Prescription {
  id             String   @id @default(uuid())
  medicationName String
  doctorName     String
  validUntil     String
  renewRequested Boolean  @default(false)
  createdAt      DateTime @default(now())
}

model Lead {
  id        String   @id @default(uuid())
  title     String
  client    String
  amount    String
  stage     String   @default("lead")
  createdAt DateTime @default(now())
}
`;

  // Parse models from prisma schema
  const initialModels: ParsedModel[] = useMemo(() => {
    const models: ParsedModel[] = [];
    const modelRegex = /model\s+([A-Za-z0-9_]+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = modelRegex.exec(rawSchema)) !== null) {
      const modelName = match[1];
      const body = match[2];
      const fields: ParsedField[] = [];

      const lines = body.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) continue;
        const tokens = trimmed.split(/\s+/);
        if (tokens.length >= 2) {
          const fName = tokens[0];
          const fType = tokens[1];
          const isId = trimmed.includes("@id");
          const isOptional = fType.endsWith("?");
          fields.push({
            name: fName,
            type: fType.replace("?", ""),
            isId,
            isOptional,
          });
        }
      }

      // Generate seed data matching domain
      const seedRecords: Record<string, any>[] = [];
      if (modelName === "PatientConsultation") {
        seedRecords.push(
          {
            id: "pc-891",
            patientName: "Kari Nordmann",
            patientPhone: "+47 912 34 567",
            serviceTitle: "Allmennlege & Akuttimer",
            consultationType: "video",
            appointmentSlot: "I dag kl. 14:30",
            price: 650,
            status: "CONFIRMED",
            createdAt: "2026-09-28T14:00:00Z",
          },
          {
            id: "pc-892",
            patientName: "Ola Hansen",
            patientPhone: "+47 988 11 223",
            serviceTitle: "Fysioterapi & Manuell",
            consultationType: "clinic",
            appointmentSlot: "I morgen kl. 09:15",
            price: 820,
            status: "PENDING",
            createdAt: "2026-09-28T14:15:00Z",
          },
          {
            id: "pc-893",
            patientName: "Ingrid Bakke",
            patientPhone: "+47 415 67 890",
            serviceTitle: "Psykolog & Samtaleterapi",
            consultationType: "video",
            appointmentSlot: "I morgen kl. 11:00",
            price: 1190,
            status: "CONFIRMED",
            createdAt: "2026-09-28T14:25:00Z",
          }
        );
      } else if (modelName === "Prescription") {
        seedRecords.push(
          {
            id: "rx-101",
            medicationName: "Ventoline Inhalasjonspulver 0.2mg",
            doctorName: "Dr. Anne Lise Berg (Allmennlege)",
            validUntil: "15.11.2026",
            renewRequested: false,
            createdAt: "2026-09-20T10:00:00Z",
          },
          {
            id: "rx-102",
            medicationName: "Cetirizin 10mg mikstur",
            doctorName: "Dr. Jonas Lind (Hudlege)",
            validUntil: "22.04.2027",
            renewRequested: true,
            createdAt: "2026-09-21T11:30:00Z",
          },
          {
            id: "rx-103",
            medicationName: "Somac 20mg enterotabletter",
            doctorName: "Dr. Henrik Dale (Gastro)",
            validUntil: "08.01.2027",
            renewRequested: true,
            createdAt: "2026-09-25T09:15:00Z",
          }
        );
      } else if (modelName === "Booking") {
        seedRecords.push(
          {
            id: "bk-1",
            service: "Terrasse & Veranda",
            squareMeters: 45,
            totalPrice: 43200,
            contactInfo: "+47 912 34 567",
            status: "CONFIRMED",
            createdAt: "2026-09-28T11:00:00Z",
          },
          {
            id: "bk-2",
            service: "Tilbygg & Råloft",
            squareMeters: 80,
            totalPrice: 125000,
            contactInfo: "+47 988 22 334",
            status: "INSPECTION_PENDING",
            createdAt: "2026-09-28T12:30:00Z",
          }
        );
      } else if (modelName === "Lead") {
        seedRecords.push(
          {
            id: "ld-1",
            title: "Takomlegging Villa Bærum",
            client: "Lars Holm",
            amount: "185 000 kr",
            stage: "lead",
            createdAt: "2026-09-28T09:00:00Z",
          },
          {
            id: "ld-2",
            title: "Rehabilitering Bad",
            client: "Kari Lie",
            amount: "240 000 kr",
            stage: "befaring",
            createdAt: "2026-09-28T10:15:00Z",
          }
        );
      } else {
        seedRecords.push({
          id: "item-1",
          name: "Standard testelement",
          status: "Aktiv",
          createdAt: new Date().toISOString(),
        });
      }

      models.push({
        name: modelName,
        fields,
        records: seedRecords,
      });
    }

    return models;
  }, [rawSchema]);

  const [modelsData, setModelsData] = useState<ParsedModel[]>(initialModels);
  const [selectedModelName, setSelectedModelName] = useState<string>(
    initialModels[0]?.name || "Booking"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "schema">("table");
  const [isNewRowModalOpen, setIsNewRowModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  const [copiedStatus, setCopiedStatus] = useState(false);

  const activeModel =
    modelsData.find((m) => m.name === selectedModelName) || modelsData[0];

  const filteredRecords = useMemo(() => {
    if (!activeModel) return [];
    if (!searchQuery.trim()) return activeModel.records;
    const q = searchQuery.toLowerCase();
    return activeModel.records.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [activeModel, searchQuery]);

  const handleDeleteRecord = (id: string) => {
    setModelsData((prev) =>
      prev.map((m) =>
        m.name === activeModel.name
          ? { ...m, records: m.records.filter((r) => r.id !== id) }
          : m
      )
    );
  };

  const handleOpenAddModal = () => {
    const initial: Record<string, any> = {};
    activeModel.fields.forEach((f) => {
      if (f.name === "id") {
        initial[f.name] = `${activeModel.name.slice(0, 3).toLowerCase()}-${Date.now().toString().slice(-4)}`;
      } else if (f.type === "Int") {
        initial[f.name] = 100;
      } else if (f.type === "Boolean") {
        initial[f.name] = false;
      } else if (f.type === "DateTime") {
        initial[f.name] = new Date().toISOString();
      } else {
        initial[f.name] = "";
      }
    });
    setNewRowData(initial);
    setIsNewRowModalOpen(true);
  };

  const handleSaveNewRow = () => {
    setModelsData((prev) =>
      prev.map((m) =>
        m.name === activeModel.name
          ? { ...m, records: [newRowData, ...m.records] }
          : m
      )
    );
    setIsNewRowModalOpen(false);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(activeModel.records, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeModel.name}-data.json`;
    a.click();
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#0A0D12] text-slate-100 overflow-hidden font-sans">
      {/* LEFT: Models / Tables Sidebar */}
      <div className="w-full md:w-64 bg-[#0E121A] border-r border-[#1F2937] flex flex-col h-full shrink-0">
        <div className="p-3.5 border-b border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs text-white">PostgreSQL Tabeller</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            {modelsData.length} Tabeller
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {modelsData.map((m) => {
            const isSelected = m.name === selectedModelName;
            return (
              <button
                key={m.name}
                onClick={() => setSelectedModelName(m.name)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-between border ${
                  isSelected
                    ? "bg-purple-950/50 border-[#7C3AED] text-white shadow-sm"
                    : "bg-[#12161F]/40 border-[#1F2937] text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <TableIcon className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                  <span className="font-semibold truncate">{m.name}</span>
                </div>
                <span className="font-mono text-[10px] bg-[#0A0D12] px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                  {m.records.length} rader
                </span>
              </button>
            );
          })}
        </div>

        {/* Database Connection Status Card */}
        <div className="p-3 bg-[#0A0D12] border-t border-[#1F2937] text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PostgreSQL 16 Tilkoblet</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Host: Railway Nixpacks</p>
          <p className="text-[10px] text-slate-500 font-mono">SSL: Påkrevd • Pool aktiv</p>
        </div>
      </div>

      {/* RIGHT: Table Grid & Controls */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0D12]">
        {/* Table Header Toolbar */}
        <div className="p-3 bg-[#12161F]/60 border-b border-[#1F2937] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-[#A78BFA]" />
                <span>Tabell: {activeModel?.name}</span>
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {activeModel?.fields.length} kolonner • {filteredRecords.length} rader funnet
              </p>
            </div>

            <div className="flex items-center bg-[#0E121A] p-0.5 rounded-lg border border-[#1F2937]">
              <button
                onClick={() => setViewMode("table")}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  viewMode === "table" ? "bg-[#1E2430] text-white font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Datatabell
              </button>
              <button
                onClick={() => setViewMode("schema")}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  viewMode === "schema" ? "bg-[#1E2430] text-white font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                Prisma Skjema
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer rader..."
                className="bg-[#0E121A] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none w-44 transition"
              />
            </div>

            {/* Export */}
            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-[#0E121A] border border-[#1F2937] hover:border-slate-600 text-slate-300 hover:text-white transition cursor-pointer"
              title="Eksporter som JSON"
            >
              {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            </button>

            {/* Add Row Button */}
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ny rad</span>
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "table" ? (
            <div className="border border-[#1F2937] rounded-xl overflow-hidden shadow-2xl bg-[#0E121A]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#12161F] border-b border-[#1F2937] text-[11px] font-mono text-slate-400">
                      {activeModel?.fields.map((f) => (
                        <th key={f.name} className="p-3 font-semibold whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white">{f.name}</span>
                            <span
                              className={`text-[9px] px-1 rounded ${
                                f.isId
                                  ? "bg-purple-950 text-[#C4B5FD] border border-purple-800"
                                  : "bg-[#0A0D12] text-slate-500 border border-slate-800"
                              }`}
                            >
                              {f.type}
                            </span>
                          </div>
                        </th>
                      ))}
                      <th className="p-3 w-10 text-right">Handlinger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2937] text-xs">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((rec, rIdx) => (
                        <tr key={rec.id || rIdx} className="hover:bg-[#161B26] transition">
                          {activeModel?.fields.map((f) => {
                            const val = rec[f.name];
                            const isBool = typeof val === "boolean";
                            return (
                              <td key={f.name} className="p-3 font-mono text-[11px] text-slate-200 whitespace-nowrap">
                                {isBool ? (
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] ${
                                      val
                                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                        : "bg-slate-900 text-slate-400 border border-slate-800"
                                    }`}
                                  >
                                    {val ? "true" : "false"}
                                  </span>
                                ) : (
                                  <span>{val !== undefined && val !== null ? String(val) : "null"}</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteRecord(rec.id)}
                              className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/40 transition cursor-pointer"
                              title="Slett rad"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={activeModel?.fields.length + 1}
                          className="p-8 text-center text-slate-500 text-xs"
                        >
                          Ingen rader funnet i denne tabellen.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full bg-[#0E121A] border border-[#1F2937] rounded-xl p-4 overflow-auto">
              <pre className="text-xs font-mono text-[#C4B5FD] whitespace-pre leading-relaxed">
                {rawSchema}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Insert New Row Modal */}
      {isNewRowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Legg til ny rad i {activeModel?.name}</h3>
              </div>
              <button
                onClick={() => setIsNewRowModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              {activeModel?.fields.map((f) => (
                <div key={f.name}>
                  <label className="text-slate-300 font-mono block mb-1 flex items-center justify-between">
                    <span>{f.name}</span>
                    <span className="text-[10px] text-slate-500">{f.type}</span>
                  </label>
                  <input
                    type="text"
                    value={newRowData[f.name] ?? ""}
                    onChange={(e) => {
                      const val = f.type === "Int" ? Number(e.target.value) : e.target.value;
                      setNewRowData((prev) => ({ ...prev, [f.name]: val }));
                    }}
                    className="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1F2937] flex justify-end gap-2">
              <button
                onClick={() => setIsNewRowModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#12161F] text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveNewRow}
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-900/30 cursor-pointer"
              >
                Lagre rad i database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
