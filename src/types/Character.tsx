export interface Character {
  _id: string;
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
    image?: string;  // Le champ image est optionnel
    skills: Skill[];
    pros: string;
    cons: string;
    
  }
  
  export type Skill = {
    specialSkill: string;
    score: number;
    link1: string;
    link2: string;
  };
  