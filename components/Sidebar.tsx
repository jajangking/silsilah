"use client";

import { useState, useEffect } from "react";
import { FamilyTree, FamilyMember } from "@/types/family";

interface SidebarProps {
  trees: Record<string, FamilyTree>;
  activeTreeId: string;
  members: Record<string, FamilyMember>;
  isOpen: boolean;
  onClose: () => void;
  onSelectTree: (treeId: string) => void;
  onCreateTree: () => void;
  onDeleteTree: (treeId: string) => void;
  onResetAll?: () => void;
}

export function Sidebar({
  trees,
  activeTreeId,
  members,
  isOpen,
  onClose,
  onSelectTree,
  onCreateTree,
  onDeleteTree,
  onResetAll,
}: SidebarProps) {
  const activeTree = trees[activeTreeId];
  const allTrees = Object.values(trees);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderMemberTree = (tree: FamilyTree, memberId: string, depth = 0, visited = new Set<string>()) => {
    const member = members[memberId];
    if (!member || visited.has(memberId)) return null;
    
    visited.add(memberId);

    return (
      <div key={memberId}>
        <div
          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              member.gender === "male"
                ? "bg-blue-100 dark:bg-blue-900"
                : "bg-pink-100 dark:bg-pink-900"
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${
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
          <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate flex-1">
            {member.name}
          </span>
        </div>
        {member.partnerIds.map((partnerId) => {
          const partner = members[partnerId];
          if (!partner) return null;
          return (
            <div key={partnerId}>
              <div
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    partner.gender === "male"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-pink-100 dark:bg-pink-900"
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 ${
                      partner.gender === "male"
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-pink-600 dark:text-pink-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate flex-1">
                  {partner.name}
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">
                    (Pasangan)
                  </span>
                </span>
              </div>
            </div>
          );
        })}
        {member.childIds.map((childId) => renderMemberTree(tree, childId, depth + 1, new Set(visited)))}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:h-auto lg:w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Daftar Keluarga
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-5 h-5 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-2">
              {isMounted ? (
                <select
                  value={activeTreeId}
                  onChange={(e) => onSelectTree(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                >
                  {allTrees.map((tree) => (
                    <option key={tree.id} value={tree.id}>
                      {tree.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              )}
              <button
                onClick={onCreateTree}
                className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Tambah keluarga baru"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              {isMounted && allTrees.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm(`Hapus "${trees[activeTreeId]?.name}" beserta semua anggotanya?`)) {
                      onDeleteTree(activeTreeId);
                    }
                  }}
                  className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Hapus keluarga"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              {isMounted && allTrees.length > 0 && onResetAll && (
                <button
                  onClick={onResetAll}
                  className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  title="Reset semua data"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {!activeTree ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
                Belum ada anggota keluarga
              </p>
            ) : (
              <div className="space-y-1">
                {activeTree.rootIds.map((rootId) => renderMemberTree(activeTree, rootId))}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              {activeTree ? Object.keys(activeTree.members).length : 0} anggota • {allTrees.length} keluarga
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
