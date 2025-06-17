export interface ComparativeFeature {
  label: string;
  free: boolean;
  premium: boolean;
}

export const featuresForAll: ComparativeFeature[] = [


  {
    label: "Badge premium dans le chat des tables",
    free: false,
    premium: true,
  },
  {
    label: "Accès anticipé aux nouveaux systèmes de jeu",
    free: false,
    premium: true,
  },
];

export const featuresForPlayers: ComparativeFeature[] = [
      { label: "Créer 1 personnage", free: true, premium: true },
  {
    label: "Créer jusqu'à 6 personnages",
    free: false,
    premium: true,
  },
  {
    label: "Export de fiches en PDF",
    free: false,
    premium: true,
  },
  {
    label: "Portrait personnalisable du personnage",
    free: false,
    premium: true,
  },
];

export const featuresForGMs: ComparativeFeature[] = [
      { label: "Créer une table de jeu", free: true, premium: true },
    { label: "Rejoindre une table de jeu ", free: true, premium: true },
  {
    label: "Soundboard (à venir)",
    free: false,
    premium: true,
  },
  {
    label: "Upload illimité de documents (cartes, images...)",
    free: false,
    premium: true,
  },
  {
    label: "Portraits personnalisés pour les PNJ",
    free: false,
    premium: true,
  },
  {
    label: "Accès complet à la bibliothèque de quêtes",
    free: false,
    premium: true,
  },
];
