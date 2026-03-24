"use client";

import { useState } from "react";

interface AddMemberFormProps {
  onSubmit: (name: string, gender: "male" | "female", birthDate?: string) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function AddMemberForm({ onSubmit, onCancel, submitLabel }: AddMemberFormProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthDate, setBirthDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), gender, birthDate || undefined);
      setName("");
      setBirthDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
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
          Tanggal Lahir (opsional)
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
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
    </form>
  );
}
