import { useEffect, useState, useRef } from "react";
import "./Chat.scss";

type MessageType = {
  message: string;
  characterName: string;
  senderName: string;
  tableId: string;
  messageType?: string;
};

interface ChatProps {
  userCharacterName: string;
  userPseudo: string;
  tableId: string;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  socket: any;
}

const Chat = ({
  userCharacterName,
  userPseudo,
  tableId,
  messages,
  setMessages,
  socket,
}: ChatProps) => {
  const [inputValue, setInputValue] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Vérifier si l'utilisateur est déjà en bas AVANT d'ajouter un message
  useEffect(() => {
    if (!chatMessagesRef.current) return;

    const chatContainer = chatMessagesRef.current;
    const isAtBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 10;

    if (isAtBottom) {
      chatContainer.scrollTop = chatContainer.scrollHeight; // ✅ On force le scroll en bas
    }
  }, [messages]);

  // Rejoindre la salle de chat via Socket.io
  useEffect(() => {
    socket.emit("joinTable", tableId);

    const handleNewMessage = (newMessage: MessageType) => {
      if (newMessage.tableId === tableId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [tableId, socket, setMessages]);

  // Récupérer les derniers messages depuis l'API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/chat/last20?tableId=${tableId}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
      }
    };

    fetchMessages();
  }, [tableId, setMessages, API_URL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim()) {
      const newMessage: MessageType = {
        message: inputValue,
        characterName: userCharacterName,
        senderName: userPseudo,
        tableId: tableId,
      };

      try {
        const response = await fetch(`${API_URL}/api/chat/postChat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du message");
        }

        // Mise à jour locale immédiate pour l'expéditeur
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Envoyer au serveur pour diffusion aux autres
        socket.emit("newMessage", newMessage);
        setInputValue("");
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  };

  return (
    <div className={`chat ${chatOpen ? "chat--open" : ""}`}>
      <div
        onClick={() => setChatOpen((prev) => !prev)}
        className="chat__header"
      >
        <i className="fa-regular fa-comment ui-button" />
        <p className="chat__label">Discussion</p>
      </div>
      {chatOpen && (
        <>
          <div ref={chatMessagesRef} className="chat__messages">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`chat__messages-item 
                  ${
                    msg.senderName === "Système" ? "chat__messages--system" : ""
                  } 
                  ${
                    msg.messageType === "diceRoll"
                      ? "chat__messages--diceRoll"
                      : ""
                  }`}
              >
                <span className="chat__messages--player">
                  {msg.characterName || "Nom du personnage non défini"}
                </span>{" "}
                <br />
                <span>{msg.message}</span>
              </p>
            ))}
          </div>
          <form
            className="chat__box"
            autoComplete="off"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              name="chat"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Écrivez votre message..."
            />
            <button 
            aria-label="Envoyer un message"
              type="submit"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
