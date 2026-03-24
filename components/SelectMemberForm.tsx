"use client";

import { useState } from "react";
import { FamilyMember } from "@/types/family";

interface SelectMemberFormProps {
  members: Record<string, FamilyMember>;
  memberTrees: Record<string, string>; // memberId -> treeId
  excludeIds?: string[];
  onSubmit: (memberId: string) => void;
  onCancel: () => void;
  submitLabel: string;
  title: string;
}

export function SelectMemberForm({
  members,
  memberTrees,
  excludeIds = [],
  onSubmit,
  onCancel,
  submitLabel,
  title,
}: SelectMemberFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter to only show members that have a name (are valid/active)
  const filteredMembers = Object.values(members).filter(
    (m) =>
      !excludeIds.includes(m.id) &&
      m.name && // Only show members with a name (not deleted/orphaned)
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId) {
      onSubmit(selectedId);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 min-w-[320px]">
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
        {title}
      </h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari nama..."
        className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        autoFocus
      />
      <div className="max-h-48 overflow-y-auto space-y-1">
        {filteredMembers.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            Tidak ditemukan
          </p>
        ) : (
          filteredMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => setSelectedId(member.id)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                selectedId === member.id
                  ? "bg-zinc-200 dark:bg-zinc-700"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  member.gender === "male"
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "bg-pink-100 dark:bg-pink-900"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    member.gender === "male"
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-pink-600 dark:text-pink-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {member.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {member.gender === "male" ? "Laki-laki" : "Perempuan"}
                </p>
              </div>
              {selectedId === member.id && (
                <svg
                  className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))
        )}
      </div>
      <div className="flex gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
        <button
          type="button"
          onClick={() => selectedId && handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
          disabled={!selectedId}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
