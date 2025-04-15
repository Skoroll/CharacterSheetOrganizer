export interface Npc {
    type: "Friendly" | "Hostile";
    _id: string;
    name: string;
    age: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    endurance: number;
    inventory: { item: string; quantity: number }[];
    specialSkills: { name: string; score: number }[];
    story: string;
    tableId?: string;
    image?: string | File | null;
    location?: string;
    isGameMaster?: boolean;
  }
  