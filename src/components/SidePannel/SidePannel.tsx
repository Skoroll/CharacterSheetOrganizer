import Chat from "../Chat/Chat";
import DiceRoller from "../DiceRoller/DiceRoller";
import { MessageType } from "../../types/Messages";
import "./SidePannel.scss"

interface SidePanelProps {
    socket: any;
    tableId: string;
    userCharacterName: string;
    userPseudo: string;
    isGameMaster: boolean;
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  }
  

  export default function SidePanel({
    socket,
    tableId,
    userCharacterName,
    userPseudo,
    isGameMaster,
    messages,
    setMessages,
  }: SidePanelProps) {
  
  return (
    <div className="table-side-pannel">
      <DiceRoller
        socket={socket}
        tableId={tableId}
        userCharacterName={userCharacterName}
        userPseudo={userPseudo}
      />
<Chat
  messages={messages}
  setMessages={setMessages}
  tableId={tableId}
  socket={socket}
  userCharacterName={userCharacterName}
  userPseudo={userPseudo}
  isGameMaster={isGameMaster}
/>

    </div>
  );
} 
