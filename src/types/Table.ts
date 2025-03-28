export type Table = {
    _id: string;
    name: string;
    players?: { playerId: string }[];
    bannerImage?: string;
    gameMaster: string;
    gameMasterName: string;
    game: string;
  };
  