export interface FamilyMember {
  id: string;
  name: string;
  gender: "male" | "female";
  partnerIds: string[];
  childIds: string[];
  birthDate?: string;
  deathDate?: string;
  isDeceased?: boolean;
}

export interface FamilyTree {
  id: string;
  name: string;
  members: Record<string, FamilyMember>;
  rootIds: string[];
}
