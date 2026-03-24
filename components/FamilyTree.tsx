"use client";

import { useState } from "react";
import type { FamilyTree, FamilyMember } from "@/types/family";
import { MemberCard } from "@/components/MemberCard";
import { AddMemberForm } from "@/components/AddMemberForm";
import { EditMemberForm } from "@/components/EditMemberForm";
import { SelectMemberForm } from "@/components/SelectMemberForm";

interface FamilyTreeProps {
  tree: FamilyTree;
  allMembers: Record<string, FamilyMember>;
  addingPartnerTo: string | null;
  addingChildTo: string | null;
  selectingPartnerFor: string | null;
  selectingChildFor: string | null;
  setAddingPartnerTo: (id: string | null) => void;
  setAddingChildTo: (id: string | null) => void;
  setSelectingPartnerFor: (id: string | null) => void;
  setSelectingChildFor: (id: string | null) => void;
  addPartner: (memberId: string, name: string, gender: "male" | "female", birthDate?: string) => void;
  addChild: (memberId: string, name: string, gender: "male" | "female", birthDate?: string) => void;
  removeMember: (memberId: string) => void;
  updateMember?: (memberId: string, updates: Partial<FamilyMember>) => void;
  toggleDeceased?: (memberId: string) => void;
  linkPartner?: (memberId: string, partnerId: string) => void;
  linkChild?: (parentId: string, childId: string) => void;
}

interface MemberNodeProps {
  memberId: string;
  tree: FamilyTree;
  allMembers: Record<string, FamilyMember>;
  addingPartnerTo: string | null;
  addingChildTo: string | null;
  selectingPartnerFor: string | null;
  selectingChildFor: string | null;
  setAddingPartnerTo: (id: string | null) => void;
  setAddingChildTo: (id: string | null) => void;
  setSelectingPartnerFor: (id: string | null) => void;
  setSelectingChildFor: (id: string | null) => void;
  addPartner: (memberId: string, name: string, gender: "male" | "female", birthDate?: string) => void;
  addChild: (memberId: string, name: string, gender: "male" | "female", birthDate?: string) => void;
  removeMember: (memberId: string) => void;
  updateMember?: (memberId: string, updates: Partial<FamilyMember>) => void;
  toggleDeceased?: (memberId: string) => void;
  linkPartner?: (memberId: string, partnerId: string) => void;
  linkChild?: (parentId: string, childId: string) => void;
  label?: string;
}

function MemberNode({
  memberId,
  tree,
  allMembers,
  addingPartnerTo,
  addingChildTo,
  selectingPartnerFor,
  selectingChildFor,
  setAddingPartnerTo,
  setAddingChildTo,
  setSelectingPartnerFor,
  setSelectingChildFor,
  addPartner,
  addChild,
  removeMember,
  updateMember,
  toggleDeceased,
  linkPartner,
  linkChild,
  label,
}: MemberNodeProps) {
  const member = tree.members[memberId];
  const [isEditing, setIsEditing] = useState(false);
  if (!member) return null;

  const isSelectingPartner = selectingPartnerFor === memberId;
  const isSelectingChild = selectingChildFor === memberId;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-2">
        {isEditing ? (
          <EditMemberForm
            member={member}
            onSubmit={(updates) => {
              updateMember?.(memberId, updates);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : isSelectingPartner ? (
          <SelectMemberForm
            title="Pilih Pasangan"
            members={allMembers}
            memberTrees={{}}
            excludeIds={[memberId, ...member.partnerIds]}
            onSubmit={(partnerId) => {
              linkPartner?.(memberId, partnerId);
              setSelectingPartnerFor(null);
            }}
            onCancel={() => setSelectingPartnerFor(null)}
            submitLabel="Link Pasangan"
          />
        ) : isSelectingChild ? (
          <SelectMemberForm
            title="Pilih Anak"
            members={allMembers}
            memberTrees={{}}
            excludeIds={[memberId, ...member.childIds]}
            onSubmit={(childId) => {
              linkChild?.(memberId, childId);
              setSelectingChildFor(null);
            }}
            onCancel={() => setSelectingChildFor(null)}
            submitLabel="Link Anak"
          />
        ) : addingPartnerTo === memberId ? (
          <AddMemberForm
            submitLabel="Tambah Pasangan"
            onSubmit={(name, gender, birthDate) => {
              addPartner(memberId, name, gender, birthDate);
              setAddingPartnerTo(null);
            }}
            onCancel={() => setAddingPartnerTo(null)}
          />
        ) : addingChildTo === memberId ? (
          <AddMemberForm
            submitLabel="Tambah Anak"
            onSubmit={(name, gender, birthDate) => {
              addChild(memberId, name, gender, birthDate);
              setAddingChildTo(null);
            }}
            onCancel={() => setAddingChildTo(null)}
          />
        ) : (
          <div className="flex gap-3 items-center">
            <MemberCard
              member={member}
              label={label}
              onAddPartner={() => setAddingPartnerTo(memberId)}
              onAddExistingPartner={() => setSelectingPartnerFor(memberId)}
              onAddChild={() => setAddingChildTo(memberId)}
              onAddExistingChild={() => setSelectingChildFor(memberId)}
              onRemove={() => removeMember(memberId)}
              onToggleDeceased={() => toggleDeceased?.(memberId)}
            />
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {member.partnerIds.map((partnerId) => {
              const partner = tree.members[partnerId];
              if (!partner) return null;
              return (
                <div key={partnerId} className="flex items-center gap-3">
                  <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-700" />
                  <MemberCard
                    member={partner}
                    label="Pasangan"
                    onAddPartner={() => setAddingPartnerTo(partnerId)}
                    onAddExistingPartner={() => setSelectingPartnerFor(partnerId)}
                    onAddChild={() => setAddingChildTo(memberId)}
                    onAddExistingChild={() => setSelectingChildFor(partnerId)}
                    onRemove={() => removeMember(partnerId)}
                    onToggleDeceased={() => toggleDeceased?.(partnerId)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      {member.childIds.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex gap-4 relative pt-4">
            {member.childIds.length > 1 && (
              <div className="absolute top-0 left-4 right-4 h-px bg-zinc-300 dark:bg-zinc-700" />
            )}
            {member.childIds.map((childId) => (
              <div key={childId} className="flex flex-col items-center relative">
                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700" />
                <div className="mt-2">
                  <MemberNode
                    memberId={childId}
                    tree={tree}
                    allMembers={allMembers}
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
                    label="Anak"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FamilyTree({
  tree,
  allMembers,
  addingPartnerTo,
  addingChildTo,
  selectingPartnerFor,
  selectingChildFor,
  setAddingPartnerTo,
  setAddingChildTo,
  setSelectingPartnerFor,
  setSelectingChildFor,
  addPartner,
  addChild,
  removeMember,
  updateMember,
  toggleDeceased,
  linkPartner,
  linkChild,
}: FamilyTreeProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-12 min-w-max p-8">
        {tree.rootIds.map((rootId) => (
          <MemberNode
            key={rootId}
            memberId={rootId}
            tree={tree}
            allMembers={allMembers}
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
        ))}
      </div>
    </div>
  );
}
