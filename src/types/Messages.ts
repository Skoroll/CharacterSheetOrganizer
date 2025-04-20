export interface MessageType {
  _id?: string;
  message?: string;
  content?: string; 
  characterName?: string;
  senderName?: string;
  tableId: string;
  isSystem?: boolean;
  createdAt?: string;
  messageType?: "diceRoll" | "text" | string;
}

  