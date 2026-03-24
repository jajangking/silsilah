"use client";

import { useState } from "react";
import { FamilyMember } from "@/types/family";
import { PhotoUpload } from "@/components/PhotoUpload";

interface EditMemberFormProps {
  member: FamilyMember;
  onSubmit: (updates: Partial<FamilyMember>) => void;
  onCancel: () => void;
}

export function EditMemberForm({ member, onSubmit, onCancel }: EditMemberFormProps) {
  const [name, setName] = useState(member.name);
  const [gender, setGender] = useState<"male" | "female">(member.gender);
  const [birthDate, setBirthDate] = useState(member.birthDate || "");
  const [deathDate, setDeathDate] = useState(member.deathDate || "");
  const [isDeceased, setIsDeceased] = useState(member.isDeceased || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      gender,
      birthDate: birthDate || undefined,
      deathDate: isDeceased ? (deathDate || undefined) : undefined,
      isDeceased,
    });
  };

  const handlePhotoUpdate = (memberId: string, photoUrl: string) => {
    onSubmit({ photoUrl: photoUrl || undefined });
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 min-w-[320px]">
      <PhotoUpload
        memberId={member.id}
        currentPhotoUrl={member.photoUrl}
        onPhotoUpdate={handlePhotoUpdate}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
          className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          autoFocus
        />
        <div className="flex gap-2">
          <label className="flex items-center gap-2 flex-1">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={() => setGender("male")}
              className="text-blue-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Laki-laki</span>
          </label>
          <label className="flex items-center gap-2 flex-1">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={() => setGender("female")}
              className="text-pink-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Perempuan</span>
          </label>
        </div>
        <div>
          <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">
            Tanggal Lahir
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={isDeceased}
              onChange={(e) => {
                setIsDeceased(e.target.checked);
                if (!e.target.checked) setDeathDate("");
              }}
              className="rounded border-zinc-300 dark:border-zinc-700 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Sudah wafat</span>
          </label>
        </div>
        {isDeceased && (
          <div>
            <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">
              Tanggal Meninggal
            </label>
            <input
              type="date"
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
