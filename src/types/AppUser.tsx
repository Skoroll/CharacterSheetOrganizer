import { Character } from "./Character";
export interface AppUser {
  _id?: string;
  userPseudo: string;
  isAuthenticated: boolean;
  token?: string;
  selectedCharacterName?: string;
  isAdmin?: boolean;
  isPremium?: boolean;
  stripeCustomerId?: string;
  selectedCharacter?: string;
  characters?: Character[];
  questsCreated?: number;
  tablesJoined?: {
  _id: string;
  name: string;
  banner?: string;
  gameMaster?: string;
}[];

  friendList?: string;

  // Ajouts pour affichage du profil
  name?: string;
  profilePicture?: string;
  createdAt?: string;
}
