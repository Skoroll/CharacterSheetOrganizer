import { useState, useEffect, useRef } from "react";
import { useUser } from "../../Context/UserContext";
import axios from "axios"; 

type MessageType = {
  pseudo: string;
  message: string;
};

const Chat = () => {
  const { userPseudo, isAuthenticated } = useUser(); // Récupérer userPseudo et isAuthenticated du contexte

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get<MessageType[]>("/api/chat/last20");
          setMessages(response.data);
        } catch (error) {
          console.error("Erreur lors du chargement des messages:", error);
        }
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: MessageType = { pseudo: userPseudo, message: inputValue };

      try {
        await axios.post("/api/chat/postChat", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputValue("");
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  };

  const toggleChat = () => {
    setChatOpen((prevState) => !prevState);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`chat ${chatOpen ? "chat--open" : ""}`}>
      <div className="chat__header">
        <i className="fa-regular fa-comment ui-button" onClick={toggleChat}></i>
        <i className="fa-solid fa-broom ui-button"></i>
      </div>
      <p className="chat__label">Discussion</p>
      {chatOpen && (
        <>
          <div className="chat__messages">
            {messages.map((msg, index) => (
              <p key={index}>
                <span className="chat__messages--player">{msg.pseudo}</span>
                <span> : </span>
                {msg.message}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat__box" onSubmit={handleSendMessage}>
            <input
              type="text"
              name="chat"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Écrivez votre message..."
            />
            <button type="submit">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
