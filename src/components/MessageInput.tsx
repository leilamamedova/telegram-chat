import { KeyboardEvent, useState } from 'react';
import { sendMessage } from '../api/api';
import { useChatStore } from '../store/store';
import type { ChatInfo, Credentials } from '../types';

interface Props {
  creds: Credentials;
  chat: ChatInfo;
}

export function MessageInput({ creds, chat }: Props) {
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const [value, setValue] = useState('');

  async function send() {
    const text = value.trim();
    if (!text) return;

    const localId = `local-${Date.now()}`;
    addMessage({
      id: localId,
      text,
      direction: 'out',
      timestamp: Date.now(),
      status: 'sending',
    });
    setValue('');

    try {
      const { idMessage } = await sendMessage(creds, chat.chatId, text);
      updateMessage(localId, { id: idMessage, status: 'sent' });
    } catch {
      updateMessage(localId, { status: 'error' });
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="composer">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение"
        rows={1}
      />
      <button onClick={send} disabled={!value.trim()}>
        Отправить
      </button>
    </div>
  );
}
