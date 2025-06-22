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

  // Ajouts pour affichage du profil
  name?: string;
  profilePicture?: string;
  createdAt?: string;
}
