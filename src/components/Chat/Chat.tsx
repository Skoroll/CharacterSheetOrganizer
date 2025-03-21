import { useEffect, useState, useRef } from "react";
import { MessageType } from "../../types/Messages";
import "./Chat.scss";

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
  const hasFetchedMessages = useRef(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Vérifier si l'utilisateur est en bas avant d'ajouter un message
  useEffect(() => {
    if (!chatMessagesRef.current) return;
    const chatContainer = chatMessagesRef.current;
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }, [messages]);

  // ✅ Gestion des messages reçus via WebSocket sans duplication
  useEffect(() => {
    const handleNewMessage = (newMessage: MessageType) => {
      console.log("📡 [WebSocket] Nouveau message reçu :", newMessage);
  
      setMessages((prevMessages) => {
        console.log("📋 [Avant mise à jour] Messages actuels :", prevMessages);
  
        const existingMessageIds = new Set(prevMessages.map((msg) => msg._id));
  
        if (newMessage.messageType === "diceRoll") {
          console.log("🎲 [Ajout d'un jet de dés] :", newMessage);
          return [...prevMessages, newMessage];
        }
  
        if (existingMessageIds.has(newMessage._id)) {
          console.warn("⚠️ [WebSocket] Message ignoré (déjà présent) :", newMessage);
          return prevMessages;
        }
  
        console.log("📩 [Ajout d'un message normal] :", newMessage);
        return [...prevMessages, newMessage];
      });
    };
  
    socket.on("newMessage", handleNewMessage);
  
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [tableId, socket, setMessages]);
  

  // ✅ Récupération des derniers messages via API sans duplication
  useEffect(() => {
    if (hasFetchedMessages.current) return;
    hasFetchedMessages.current = true;
  
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chat/last20?tableId=${tableId}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des messages");
  
        const data: MessageType[] = await response.json();
        console.log("🔍 [API] Messages récupérés :", data);
  
        setMessages((prevMessages) => {
          const existingMessageIds = new Set(prevMessages.map((msg) => msg._id));
          const newMessages = data.filter((msg) => !existingMessageIds.has(msg._id));
  
          console.log("✅ [API] Messages après filtrage :", newMessages);
          return [...prevMessages, ...newMessages];
        });
  
      } catch (error) {
        console.error("❌ Erreur lors du chargement des messages:", error);
      }
    };
  
    fetchMessages();
  }, [tableId, setMessages, API_URL]);
  

  // ✅ Gestion de l'input utilisateur
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // ✅ Envoi d'un message et affichage immédiat sans duplication
const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!inputValue.trim()) return;

  const newMessage: Omit<MessageType, "_id"> = { // Ne met pas de `_id` temporaire
    message: inputValue,
    characterName: userCharacterName,
    senderName: userPseudo,
    tableId,
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

    const savedMessage: MessageType = await response.json();
    console.log("📨 [WebSocket] Envoi du message via WebSocket :", savedMessage);

    // ✅ Ajoute directement le message valide renvoyé par l'API
    setMessages((prevMessages) => [...prevMessages, savedMessage]);

    // ✅ Envoie le message via WebSocket
    socket.emit("newMessage", savedMessage);

    setInputValue("");
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message:", error);
  }
};


  return (
    <div className={`chat ${chatOpen ? "chat--open" : ""}`}>
      <div onClick={() => setChatOpen((prev) => !prev)} className="chat__header">
        <i className="fa-regular fa-comment ui-button" />
        <p className="chat__label">Discussion</p>
      </div>
      {chatOpen && (
        <>
          <div ref={chatMessagesRef} className="chat__messages">
            {messages.map((msg: MessageType) => {
              if (!msg._id) return null; // ✅ Empêche l'affichage des messages sans `_id`
              return (
                <p
                  key={msg._id} // ✅ Corrige l'erreur React "Each child in a list should have a unique key"
                  className={`chat__messages-item 
                    ${msg.senderName === "Système" ? "chat__messages--system" : ""} 
                    ${msg.messageType === "diceRoll" ? "chat__messages--diceRoll" : ""}`}
                >
                  <span className="chat__messages--player">
                    {msg.characterName || "Nom du personnage non défini"}
                  </span>
                  <br />
                  <span>{msg.message}</span>
                </p>
              );
            })}
          </div>
          <form className="chat__box" autoComplete="off" onSubmit={handleSendMessage}>
            <input
              type="text"
              name="chat"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Écrivez votre message..."
            />
            <button aria-label="Envoyer un message" type="submit">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
