export interface Credentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export interface ChatInfo {
  chatId: string;
  title: string;
}

export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  text: string;
  direction: 'in' | 'out';
  timestamp: number;
  status: MessageStatus;
}

export interface Notification {
  receiptId: number;
  body: {
    typeWebhook: string;
    idMessage?: string;
    timestamp?: number;
    senderData?: { chatId: string };
    messageData?: {
      typeMessage: string;
      textMessageData?: { textMessage: string };
      extendedTextMessageData?: { text: string };
    };
  };
}
