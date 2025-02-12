export interface Character {
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

    inventory: Array<{ item: string; quantity: number }>;
    image?: string;  // Le champ image est optionnel
    skills: Skill[];
    
  }
  
  export type Skill = {
    specialSkill: string;
    score: number;
    link1: string;
    link2: string;
  };
  