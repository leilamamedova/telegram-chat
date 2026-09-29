import { FormEvent, useState } from 'react';
import { resolveChatId } from '../api/api';
import { useChatStore } from '../store/store';
import type { Credentials } from '../types';
import { digitsOnly } from '../utils';

export function NewChatForm({ creds }: { creds: Credentials }) {
  const openChat = useChatStore((s) => s.openChat);
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = target.trim();
    const isUsername = value.startsWith('@');
    const digits = digitsOnly(value);

    if (isUsername ? value.length < 6 : digits.length < 10) {
      setError(
        'Введите номер в международном формате (79001234567) или @username',
      );
      return;
    }

    setLoading(true);
    setError('');
    try {
      const chatId = await resolveChatId(creds, value);
      openChat({ chatId, title: isUsername ? value : `+${digits}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать чат');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h1>Новый чат</h1>
      <p className="hint">
        Номер получателя без плюса и пробелов или его @username.
      </p>

      <label>
        Номер телефона или @username
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="79001234567"
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Ищем…' : 'Создать чат'}
      </button>
    </form>
  );
}
