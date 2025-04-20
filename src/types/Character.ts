export interface Character {
  _id: string;
  game: string;
  name: string;
  className: string;
  age: number;
  strength: number;
  dexterity: number;
  endurance: number;
  intelligence: number;
  charisma: number;
  pointsOfLife: number;
  gold: number;
  injuries: string;
  protection: string;
  background: string;
  origin: string;
  weapons: Array<{ name: string; damage: string }>;
  userId: string;
  inventory: Array<{ item: string; quantity: number }>;
  image?: string | File;
  skills: Skill[];
  pros: string;
  cons: string;
  baseSkills: BaseSkill[];
  tableId?: string;
  magic?: {
    ariaMagic: boolean;
    ariaMagicLevel: number;
    ariaMagicCards: string[];
    ariaMagicUsedCards: string[];
    deathMagic: boolean;
    deathMagicCount: number;
    deathMagicMax: number;
  } 
}

export interface BaseSkill {
  name: string;
  link1: string;
  link2: string;
  bonusMalus: number;
}

export type Skill = {
  specialSkill: string;
  score: number;
  link1: string;
  link2: string;
};

export type EditableCharacter = Omit<Character, "image"> & {
  image?: string | File;
  baseSkills: BaseSkill[];
  tableId?: string;
  magic?: {
    ariaMagic: boolean;
    ariaMagicLevel: number;
    ariaMagicCards: string[];
    ariaMagicUsedCards: string[];
    deathMagic: boolean;
    deathMagicCount: number;
    deathMagicMax: number;
  }
};

