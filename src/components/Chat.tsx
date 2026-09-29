import { useIncomingMessages } from '../hooks/useIncomingMessages';
import { useChatStore } from '../store/store';
import type { ChatInfo, Credentials } from '../types';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

interface Props {
  creds: Credentials;
  chat: ChatInfo;
}

export function Chat({ creds, chat }: Props) {
  const messages = useChatStore((s) => s.messages);
  const closeChat = useChatStore((s) => s.closeChat);

  useIncomingMessages(creds, chat);

  return (
    <section className="chat">
      <div className="chat-header">
        <strong>{chat.title}</strong>
        <button className="link" onClick={closeChat}>
          Сменить чат
        </button>
      </div>
      <MessageList messages={messages} />
      <MessageInput creds={creds} chat={chat} />
    </section>
  );
}
