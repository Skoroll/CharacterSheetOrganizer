import EasyAccessAria from "./EasyAccessAria/EasyAccessAria";
import type { Character } from "../../../types/Character";

interface EasyAccessRouterProps {
  game: string;
  character: Character;
  playerId: string;
  updateHealth: (character: Character, change: number) => void;
  openPanel: {
    playerId: string;
    panel: string;
  } | null;
  setOpenPanel: React.Dispatch<
    React.SetStateAction<{
      playerId: string;
      panel: string;
    } | null>
  >;
  setShowPersonalMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  easyAccessRef: React.RefObject<HTMLDivElement>;
  toggleButtonRef: React.RefObject<HTMLButtonElement>;
  tableId: string;
  socket: any;
  drawCard: (character: Character) => void;
  lastDrawnCard: string | null;
}

const EasyAccessRouter = ({
  game,
  character,
  playerId,
  openPanel,
  setOpenPanel,
  setShowPersonalMenuOpen,
  easyAccessRef,
  toggleButtonRef,
  tableId,
  socket,
}: Omit<EasyAccessRouterProps, 'updateHealth' | 'drawCard' | 'lastDrawnCard'>) => {
  switch (game) {
    case "Aria":
      return (
        <EasyAccessAria
          character={character}
          playerId={playerId}
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
          setShowPersonalMenuOpen={setShowPersonalMenuOpen}
          easyAccessRef={easyAccessRef}
          toggleButtonRef={toggleButtonRef}
          tableId={tableId}
          socket={socket}
        />
      );
    default:
      return null;
  }
};


export default EasyAccessRouter;
