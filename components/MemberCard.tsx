"use client";

import { useState } from "react";
import { FamilyMember } from "@/types/family";

interface MemberCardProps {
  member: FamilyMember;
  label?: string;
  onAddPartner: () => void;
  onAddExistingPartner: () => void;
  onAddChild: () => void;
  onAddExistingChild: () => void;
  onRemove: () => void;
  onToggleDeceased: () => void;
}

export function MemberCard({
  member,
  label,
  onAddPartner,
  onAddExistingPartner,
  onAddChild,
  onAddExistingChild,
  onRemove,
  onToggleDeceased,
}: MemberCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`flex flex-col items-center p-4 bg-white dark:bg-zinc-900 rounded-xl border transition-all duration-200 ${
        member.isDeceased
          ? "border-zinc-300 dark:border-zinc-700 opacity-75"
          : "border-zinc-200 dark:border-zinc-800"
      } ${showActions ? "ring-2 ring-zinc-400 dark:ring-zinc-600" : "shadow-sm"}`}
      onClick={() => setShowActions(!showActions)}
    >
      {label && (
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${
            member.photoUrl
              ? ''
              : member.isDeceased
              ? "bg-zinc-200 dark:bg-zinc-800"
              : member.gender === "male"
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-pink-100 dark:bg-pink-900"
          }`}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className={`w-5 h-5 ${
                member.isDeceased
                  ? "text-zinc-500 dark:text-zinc-500"
                  : member.gender === "male"
                  ? "text-blue-600 dark:text-blue-300"
                  : "text-pink-600 dark:text-pink-300"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        <div>
          <p
            className={`font-medium ${
              member.isDeceased
                ? "text-zinc-500 dark:text-zinc-500"
                : "text-zinc-900 dark:text-white"
            }`}
          >
            {member.name}
            {member.isDeceased && (
              <span className="ml-1 text-zinc-400 dark:text-zinc-600">(Alm)</span>
            )}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {member.gender === "male" ? "Laki-laki" : "Perempuan"}
          </p>
          {(member.birthDate || member.deathDate) && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              {member.birthDate && (
                <span>
                  {member.isDeceased ? "Lahir: " : ""}
                  {formatDate(member.birthDate)}
                </span>
              )}
              {member.isDeceased && member.deathDate && (
                <span className="mx-1">•</span>
              )}
              {member.isDeceased && member.deathDate && (
                <span>Meninggal: {formatDate(member.deathDate)}</span>
              )}
            </p>
          )}
        </div>
      </div>
      {showActions && (
        <div
          className="flex gap-2 flex-wrap justify-center w-full pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onToggleDeceased}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              member.isDeceased
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            }`}
            title={member.isDeceased ? "Hidup kembali" : "Tandai wafat"}
          >
            {member.isDeceased ? "✓ Hidup" : "Wafat"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onAddPartner}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Tambah pasangan baru"
            >
              + Psgn
            </button>
            <button
              onClick={onAddExistingPartner}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              title="Pilih pasangan yang sudah ada"
            >
              ✓ Psgn
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAddChild}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Tambah anak baru"
            >
              + Anak
            </button>
            <button
              onClick={onAddExistingChild}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              title="Pilih anak yang sudah ada"
            >
              ✓ Anak
            </button>
          </div>
          <button
            onClick={onRemove}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}
