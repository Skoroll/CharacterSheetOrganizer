// src/Context/UserContext.d.ts
declare module 'src/Context/UserContext' {
  export const useUser: () => { userPseudo: string; isAuthenticated: boolean };
}
