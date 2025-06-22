import { useEffect, useState, useRef } from "react";
import { MessageType } from "../../types/Messages";
import "./Chat.scss";

interface ChatProps {
  userCharacterName: string;
  userPseudo: string;
  tableId: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  socket: any;
  isGameMaster: boolean;
  user: any;
  isPremium: boolean;
  onOpenUserProfile: (userId: string) => void;
}

type ChatMessage = MessageType & {
  animate?: boolean;
  isPremium?: boolean;
};

const Chat = ({
  userCharacterName,
  userPseudo,
  tableId,
  messages,
  setMessages,
  isGameMaster,
  socket,
  user,
  onOpenUserProfile,
}: ChatProps) => {
  const [inputValue, setInputValue] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedMessages = useRef(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!chatMessagesRef.current) return;
    const chatContainer = chatMessagesRef.current;
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }, [messages]);

  useEffect(() => {
    if (hasFetchedMessages.current) return;
    hasFetchedMessages.current = true;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/chat/last20?tableId=${tableId}`
        );
        if (!response.ok)
          throw new Error("Erreur lors du chargement des messages");

        const data: MessageType[] = await response.json();

        const sortedMessages = [...data].sort((a, b) => {
          const dateA = new Date(a.createdAt ?? 0);
          const dateB = new Date(b.createdAt ?? 0);
          return dateA.getTime() - dateB.getTime();
        });

        setMessages((prevMessages) => {
          const existingMessageIds = new Set(
            prevMessages.map((msg) => msg._id)
          );
          const newMessages = sortedMessages.filter(
            (msg) => !existingMessageIds.has(msg._id)
          );

          return [...prevMessages, ...newMessages];
        });
      } catch (error) {
        console.error("❌ Erreur lors du chargement des messages:", error);
      }
    };

    fetchMessages();
  }, [tableId, setMessages, API_URL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const handleNewMessage = (msg: MessageType) => {
      setMessages((prev) => [...prev, { ...msg, animate: true }]);
    };

    if (!socket.hasListeners || !socket.hasListeners("newMessage")) {
      socket.on("newMessage", handleNewMessage);
    }

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Omit<MessageType, "_id"> & { isPremium?: boolean } = {
      message: inputValue,
      characterName: isGameMaster ? "Maître du jeu" : userCharacterName,
      senderName: userPseudo,
      senderId: user._id,
      tableId,
      isPremium: user?.isPremium,
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

      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      socket.emit("newMessage", savedMessage);

      setInputValue("");
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.animate ? { ...msg, animate: false } : msg))
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, [messages, setMessages]);

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
            {messages.map((msg: ChatMessage, index) => {
              const key =
                msg._id ?? `diceRoll-${index}-${msg.message}-${Math.random()}`;

              const animationClass =
                msg.messageType === "diceRoll" && msg.animate
                  ? "chat__messages--diceRoll popIn"
                  : msg.messageType === "diceRoll"
                  ? "chat__messages--diceRoll"
                  : "";

              return (
                <p
                  key={key}
                  className={`chat__messages-item 
        ${msg.senderName === "Système" ? "chat__messages--system" : ""} 
        ${animationClass}`}
                >
                  <span
                    className="chat__messages--player"
                    onClick={() =>
                      msg.senderName !== "Système" &&
                      msg.senderId &&
                      onOpenUserProfile(msg.senderId)
                    }
                    style={{
                      cursor:
                        msg.senderName !== "Système" && msg.senderId
                          ? "pointer"
                          : "default",
                    }}
                  >
                    {msg.isPremium && (
                      <i
                        className="fa-solid fa-crown"
                        style={{ marginRight: "4px", color: "gold" }}
                      ></i>
                    )}
                    {msg.characterName ||
                      msg.senderName ||
                      "Nom du personnage non défini"}
                  </span>
                  <br />
                  <span>{msg.message || msg.content || "[Message vide]"}</span>
                </p>
              );
            })}
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
