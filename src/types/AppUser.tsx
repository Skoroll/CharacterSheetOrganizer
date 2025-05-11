export interface AppUser {
    _id?: string;
    userPseudo: string;
    isAuthenticated: boolean;
    token?: string;
    selectedCharacterName?: string;
    isAdmin?: boolean;
    isPremium?: boolean;
  }
  