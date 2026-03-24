"use client";

import { useState, useCallback, useEffect } from "react";
import { FamilyMember, FamilyTree } from "@/types/family";

const STORAGE_KEY = "silsilah-family-trees-v4";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getInitialData(): { trees: Record<string, FamilyTree>; activeTreeId: string } {
  if (typeof window === "undefined") {
    return { trees: {}, activeTreeId: "" };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const treeIds = Object.keys(data.trees || {});
      return {
        trees: data.trees || {},
        activeTreeId: data.activeTreeId || treeIds[0] || "",
      };
    }
  } catch (e) {
    console.error("Failed to load family tree from localStorage", e);
  }
  return { trees: {}, activeTreeId: "" };
}

// Helper function to sync partner relationships across all trees
function syncPartnersInTrees(trees: Record<string, FamilyTree>): Record<string, FamilyTree> {
  const partnerMap = new Map<string, Set<string>>();
  
  // Build complete partner map from all trees
  Object.values(trees).forEach((t) => {
    Object.values(t.members).forEach((m) => {
      if (!partnerMap.has(m.id)) {
        partnerMap.set(m.id, new Set(m.partnerIds));
      } else {
        m.partnerIds.forEach((pid) => partnerMap.get(m.id)!.add(pid));
      }
    });
  });

  const newTrees = { ...trees };
  let hasChanges = false;

  // Sync all trees
  Object.entries(newTrees).forEach(([treeId, t]) => {
    const treeMembers = { ...t.members };
    let treeHasChanges = false;
    
    Object.keys(treeMembers).forEach((mid) => {
      const partners = partnerMap.get(mid);
      if (partners && partners.size > 0) {
        const existingMember = treeMembers[mid];
        const existingPartnerIds = new Set(existingMember.partnerIds);
        partners.forEach((pid) => existingPartnerIds.add(pid));
        const newPartnerIds = Array.from(existingPartnerIds);
        if (newPartnerIds.length !== existingMember.partnerIds.length) {
          treeMembers[mid] = {
            ...existingMember,
            partnerIds: newPartnerIds,
          };
          treeHasChanges = true;
        }
      }
    });
    
    if (treeHasChanges) {
      hasChanges = true;
      newTrees[treeId] = {
        ...t,
        members: treeMembers,
      };
    }
  });

  return hasChanges ? newTrees : trees;
}

export function useFamilyTree() {
  const [data, setData] = useState<{ trees: Record<string, FamilyTree>; activeTreeId: string }>(getInitialData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save family tree to localStorage", e);
    }
  }, [data]);

  const activeTree = data.trees[data.activeTreeId];

  const createTree = useCallback((name: string) => {
    const treeId = generateId();
    const newTree: FamilyTree = {
      id: treeId,
      name,
      members: {},
      rootIds: [],
    };
    setData((prev) => ({
      trees: {
        ...prev.trees,
        [treeId]: newTree,
      },
      activeTreeId: treeId,
    }));
    return treeId;
  }, []);

  const setActiveTree = useCallback((treeId: string) => {
    setData((prev) => ({ ...prev, activeTreeId: treeId }));
  }, []);

  const deleteTree = useCallback((treeId: string) => {
    setData((prev) => {
      const newTrees = { ...prev.trees };
      delete newTrees[treeId];
      const treeIds = Object.keys(newTrees);
      
      // Also remove members that only existed in deleted tree from allMembers
      const deletedTree = prev.trees[treeId];
      if (deletedTree) {
        // Remove references to this tree's members from other trees
        Object.values(newTrees).forEach((tree) => {
          Object.keys(tree.members).forEach((memberId) => {
            // Keep members that exist in multiple trees
            // Only remove if they were only in the deleted tree
          });
        });
      }
      
      return {
        trees: newTrees,
        activeTreeId: prev.activeTreeId === treeId ? treeIds[0] || "" : prev.activeTreeId,
      };
    });
  }, []);

  const getAllTrees = useCallback(() => {
    return Object.values(data.trees);
  }, [data.trees]);

  const getAllMembers = useCallback(() => {
    const allMembers: Record<string, FamilyMember> = {};
    Object.values(data.trees).forEach((tree) => {
      Object.entries(tree.members).forEach(([id, member]) => {
        if (!allMembers[id]) {
          allMembers[id] = member;
        }
      });
    });
    return allMembers;
  }, [data.trees]);

  const getActiveMembers = useCallback(() => {
    // Only return members that exist in at least one non-deleted tree
    const allMembers: Record<string, FamilyMember> = {};
    Object.values(data.trees).forEach((tree) => {
      Object.entries(tree.members).forEach(([id, member]) => {
        if (!allMembers[id]) {
          allMembers[id] = { ...member };
        }
      });
    });
    return allMembers;
  }, [data.trees]);

  const getAllMembersFromTrees = (trees: Record<string, FamilyTree>): Record<string, FamilyMember> => {
    const allMembers: Record<string, FamilyMember> = {};
    Object.values(trees).forEach((tree) => {
      Object.entries(tree.members).forEach(([id, member]) => {
        if (!allMembers[id]) {
          allMembers[id] = member;
        }
      });
    });
    return allMembers;
  };

  const updateTree = useCallback((treeId: string, updater: (tree: FamilyTree) => FamilyTree) => {
    setData((prev) => {
      const tree = prev.trees[treeId];
      if (!tree) return prev;
      return {
        ...prev,
        trees: {
          ...prev.trees,
          [treeId]: updater(tree),
        },
      };
    });
  }, []);

  const addMember = useCallback((name: string, gender: "male" | "female", birthDate?: string) => {
    if (!activeTree) return;
    setData((prev) => {
      const tree = prev.trees[prev.activeTreeId];
      if (!tree) return prev;
      
      const newMember: FamilyMember = {
        id: generateId(),
        name,
        gender,
        partnerIds: [],
        childIds: [],
        birthDate,
      };

      const updatedTree = {
        ...tree,
        members: {
          ...tree.members,
          [newMember.id]: newMember,
        },
        rootIds: [...tree.rootIds, newMember.id],
      };

      const newTrees = {
        ...prev.trees,
        [tree.id]: updatedTree,
      };

      // Sync partner relationships
      const syncedTrees = syncPartnersInTrees(newTrees);

      return {
        ...prev,
        trees: syncedTrees,
      };
    });
  }, [activeTree]);

  const addPartner = useCallback((memberId: string, partnerName: string, partnerGender: "male" | "female", birthDate?: string) => {
    setData((prev) => {
      const tree = prev.trees[prev.activeTreeId];
      if (!tree) return prev;

      const member = tree.members[memberId];
      if (!member) return prev;

      const newPartner: FamilyMember = {
        id: generateId(),
        name: partnerName,
        gender: partnerGender,
        partnerIds: [memberId],
        childIds: [],
        birthDate,
      };

      const updatedMember = {
        ...member,
        partnerIds: [...member.partnerIds, newPartner.id],
      };

      const newTrees = { ...prev.trees };
      newTrees[tree.id] = {
        ...tree,
        members: {
          ...tree.members,
          [newPartner.id]: newPartner,
          [memberId]: updatedMember,
        },
      };

      // Sync partner relationships
      const syncedTrees = syncPartnersInTrees(newTrees);

      return {
        ...prev,
        trees: syncedTrees,
      };
    });
  }, []);

  const addChild = useCallback((parentId: string, childName: string, childGender: "male" | "female", birthDate?: string) => {
    setData((prev) => {
      const tree = prev.trees[prev.activeTreeId];
      if (!tree) return prev;

      const parent = tree.members[parentId];
      if (!parent) return prev;

      const newChild: FamilyMember = {
        id: generateId(),
        name: childName,
        gender: childGender,
        partnerIds: [],
        childIds: [],
        birthDate,
      };

      const updatedParent = {
        ...parent,
        childIds: [...parent.childIds, newChild.id],
      };

      const newMembers: Record<string, FamilyMember> = {
        [newChild.id]: newChild,
        [parentId]: updatedParent,
      };

      // Update all partners of the parent
      parent.partnerIds.forEach((partnerId) => {
        let partner = tree.members[partnerId];
        if (!partner) {
          Object.values(prev.trees).forEach((t) => {
            if (t.members[partnerId] && !partner) {
              partner = t.members[partnerId];
            }
          });
        }
        
        if (partner) {
          newMembers[partnerId] = {
            ...partner,
            childIds: [...partner.childIds, newChild.id],
          };
        }
      });

      const newTrees = { ...prev.trees };
      newTrees[tree.id] = {
        ...tree,
        members: {
          ...tree.members,
          ...newMembers,
        },
      };

      // Also add child to other trees where parents exist
      Object.values(prev.trees).forEach((t) => {
        if (t.id === tree.id) return;
        
        const hasParent = t.members[parentId];
        const hasPartner = parent.partnerIds.some((pid) => t.members[pid]);
        
        if (hasParent || hasPartner) {
          const updatedMembers = { ...t.members };
          
          if (hasParent) {
            updatedMembers[parentId] = {
              ...updatedMembers[parentId],
              childIds: [...(updatedMembers[parentId]?.childIds || []), newChild.id],
            };
          }
          
          parent.partnerIds.forEach((partnerId) => {
            if (updatedMembers[partnerId]) {
              updatedMembers[partnerId] = {
                ...updatedMembers[partnerId],
                childIds: [...(updatedMembers[partnerId]?.childIds || []), newChild.id],
              };
            }
          });
          
          updatedMembers[newChild.id] = newChild;
          
          newTrees[t.id] = {
            ...t,
            members: updatedMembers,
          };
        }
      });

      // Sync partner relationships
      const syncedTrees = syncPartnersInTrees(newTrees);

      return {
        ...prev,
        trees: syncedTrees,
      };
    });
  }, []);

  const removeMember = useCallback((memberId: string) => {
    if (!activeTree) return;
    updateTree(activeTree.id, (prev) => {
      const member = prev.members[memberId];
      if (!member) return prev;

      const newMembers = { ...prev.members };

      member.partnerIds.forEach((partnerId) => {
        const partner = newMembers[partnerId];
        if (partner) {
          newMembers[partnerId] = {
            ...partner,
            partnerIds: partner.partnerIds.filter((id) => id !== memberId),
          };
        }
      });

      const newRootIds = [...prev.rootIds];
      member.childIds.forEach((childId) => {
        const child = newMembers[childId];
        if (child && !newRootIds.includes(childId)) {
          newRootIds.push(childId);
        }
      });

      delete newMembers[memberId];

      return {
        ...prev,
        members: newMembers,
        rootIds: prev.rootIds.filter((id) => id !== memberId),
      };
    });
  }, [activeTree, updateTree]);

  const updateMember = useCallback((memberId: string, updates: Partial<FamilyMember>) => {
    if (!activeTree) return;
    updateTree(activeTree.id, (prev) => {
      const member = prev.members[memberId];
      if (!member) return prev;

      return {
        ...prev,
        members: {
          ...prev.members,
          [memberId]: { ...member, ...updates },
        },
      };
    });
  }, [activeTree, updateTree]);

  const toggleDeceased = useCallback((memberId: string) => {
    if (!activeTree) return;
    updateTree(activeTree.id, (prev) => {
      const member = prev.members[memberId];
      if (!member) return prev;

      return {
        ...prev,
        members: {
          ...prev.members,
          [memberId]: {
            ...member,
            isDeceased: !member.isDeceased,
            deathDate: member.isDeceased ? undefined : member.deathDate,
          },
        },
      };
    });
  }, [activeTree, updateTree]);

  const linkPartner = useCallback((memberId: string, partnerId: string) => {
    setData((prev) => {
      const tree = prev.trees[prev.activeTreeId];
      if (!tree) return prev;
      
      const member = tree.members[memberId];
      if (!member) return prev;
      
      // Get partner from any tree
      let partner = tree.members[partnerId];
      if (!partner) {
        Object.entries(prev.trees).forEach(([, t]) => {
          if (t.members[partnerId] && !partner) {
            partner = t.members[partnerId];
          }
        });
      }
      
      if (!partner) return prev;
      if (member.partnerIds.includes(partnerId)) return prev;

      const newTrees = { ...prev.trees };

      // Update ALL trees - add partner relationship to both members
      Object.entries(newTrees).forEach(([treeId, t]) => {
        const treeMembers = { ...t.members };
        const existingMember = treeMembers[memberId];
        const existingPartner = treeMembers[partnerId];
        
        // Update or add member with new partner
        if (existingMember) {
          treeMembers[memberId] = {
            ...existingMember,
            partnerIds: [...new Set([...existingMember.partnerIds, partnerId])],
          };
        } else if (member) {
          treeMembers[memberId] = {
            ...member,
            partnerIds: [partnerId],
          };
        }
        
        // Update or add partner with new member
        if (existingPartner) {
          treeMembers[partnerId] = {
            ...existingPartner,
            partnerIds: [...new Set([...existingPartner.partnerIds, memberId])],
          };
        } else if (partner) {
          treeMembers[partnerId] = {
            ...partner,
            partnerIds: [memberId],
          };
        }
        
        newTrees[treeId] = {
          ...t,
          members: treeMembers,
        };
      });

      // Final sync to ensure consistency
      const syncedTrees = syncPartnersInTrees(newTrees);

      return {
        ...prev,
        trees: syncedTrees,
      };
    });
  }, []);

  const linkChild = useCallback((parentId: string, childId: string) => {
    setData((prev) => {
      const tree = prev.trees[prev.activeTreeId];
      if (!tree) return prev;
      
      const parent = tree.members[parentId];
      if (!parent) return prev;
      
      let child = tree.members[childId];
      if (!child) {
        Object.entries(prev.trees).forEach(([, t]) => {
          if (t.members[childId] && !child) {
            child = t.members[childId];
          }
        });
      }
      
      if (!child) return prev;
      if (parent.childIds.includes(childId)) return prev;

      const newTrees = { ...prev.trees };

      // Remove child from current parents in all trees
      Object.values(newTrees).forEach((t) => {
        Object.values(t.members).forEach((m) => {
          if (m.childIds.includes(childId)) {
            t.members[m.id] = {
              ...m,
              childIds: m.childIds.filter((id) => id !== childId),
            };
          }
        });
      });

      // Update current tree
      const currentTreeMembers = { ...tree.members };
      currentTreeMembers[parentId] = {
        ...parent,
        childIds: [...parent.childIds, childId],
      };
      
      if (!currentTreeMembers[childId]) {
        currentTreeMembers[childId] = child;
      }
      
      parent.partnerIds.forEach((partnerId) => {
        if (currentTreeMembers[partnerId]) {
          currentTreeMembers[partnerId] = {
            ...currentTreeMembers[partnerId],
            childIds: [...currentTreeMembers[partnerId].childIds, childId],
          };
        }
      });
      
      newTrees[tree.id] = {
        ...tree,
        members: currentTreeMembers,
        rootIds: tree.rootIds.filter((id) => id !== childId),
      };

      // Sync partner relationships
      const syncedTrees = syncPartnersInTrees(newTrees);

      return {
        ...prev,
        trees: syncedTrees,
      };
    });
  }, []);

  return {
    tree: activeTree,
    trees: data.trees,
    activeTreeId: data.activeTreeId,
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
  };
}
