import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { formatTime } from '../utils';

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return <div className="messages empty">Напишите первое сообщение</div>;
  }

  return (
    <div className="messages">
      {messages.map((m) => (
        <div key={m.id} className={`bubble ${m.direction}`}>
          <span className="text">{m.text}</span>
          <span className="meta">
            {formatTime(m.timestamp)}
            {m.status === 'sending' && ' · отправляется'}
            {m.status === 'error' && ' · не отправлено'}
          </span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
