"use client";

import { useState } from "react";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { AddMemberForm } from "@/components/AddMemberForm";
import { FamilyTree } from "@/components/FamilyTree";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const {
    tree,
    trees,
    activeTreeId,
    createTree,
    setActiveTree,
    deleteTree,
    getAllTrees,
    getAllMembers,
    addMember,
    addPartner,
    addChild,
    removeMember,
    updateMember,
    toggleDeceased,
    linkPartner,
    linkChild,
  } = useFamilyTree();
  const [addingRoot, setAddingRoot] = useState(false);
  const [addingPartnerTo, setAddingPartnerTo] = useState<string | null>(null);
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const [selectingPartnerFor, setSelectingPartnerFor] = useState<string | null>(null);
  const [selectingChildFor, setSelectingChildFor] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Clear all data function
  const handleResetAll = () => {
    if (confirm("Hapus SEMUA data keluarga? Ini tidak bisa dibatalkan!")) {
      localStorage.removeItem("silsilah-family-trees-v4");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex">
      <Sidebar
        trees={trees}
        activeTreeId={activeTreeId}
        members={tree?.members || {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectTree={setActiveTree}
        onCreateTree={() => {
          const name = prompt("Nama keluarga:", "Keluarga Baru");
          if (name) createTree(name);
        }}
        onDeleteTree={deleteTree}
        onResetAll={handleResetAll}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
                <svg className="w-4 h-4 text-white dark:text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {tree?.name || "Silsilah Keluarga"}
                </h1>
                {getAllTrees().length > 1 && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {getAllTrees().length} keluarga
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setAddingRoot(true)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            + Tambah Anggota
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {!tree || tree.rootIds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                {getAllTrees().length === 0
                  ? "Belum ada keluarga. Buat keluarga pertama Anda."
                  : "Belum ada anggota keluarga"}
              </p>
              <div className="flex gap-2 justify-center">
                {getAllTrees().length === 0 ? (
                  <button
                    onClick={() => {
                      const name = prompt("Nama keluarga:", "Keluarga Saya");
                      if (name) createTree(name);
                    }}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                  >
                    + Buat Keluarga
                  </button>
                ) : (
                  <button
                    onClick={() => setAddingRoot(true)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                  >
                    + Tambah Anggota
                  </button>
                )}
              </div>
            </div>
          ) : (
            <FamilyTree
              tree={tree}
              allMembers={getAllMembers()}
              addingPartnerTo={addingPartnerTo}
              addingChildTo={addingChildTo}
              selectingPartnerFor={selectingPartnerFor}
              selectingChildFor={selectingChildFor}
              setAddingPartnerTo={setAddingPartnerTo}
              setAddingChildTo={setAddingChildTo}
              setSelectingPartnerFor={setSelectingPartnerFor}
              setSelectingChildFor={setSelectingChildFor}
              addPartner={addPartner}
              addChild={addChild}
              removeMember={removeMember}
              updateMember={updateMember}
              toggleDeceased={toggleDeceased}
              linkPartner={linkPartner}
              linkChild={linkChild}
            />
          )}
        </div>

        {addingRoot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <AddMemberForm
              submitLabel="Tambah"
              onSubmit={(name, gender, birthDate) => {
                addMember(name, gender, birthDate);
                setAddingRoot(false);
              }}
              onCancel={() => setAddingRoot(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
