export type Table = {
    _id: string;
    name: string;
    players?: { playerId: string }[];
    bannerImage?: string;
    gameMaster: string;
    gameMasterName: string;
    game: string;
    selectedFont?: string;
    tableBG?: string;
    borderWidth: string;
    borderColor: string;
    bannerStyle: string;
    
  };
  