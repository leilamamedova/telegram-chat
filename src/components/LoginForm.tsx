import { FormEvent, useState } from 'react';
import { checkCredentials } from '../api/api';
import { useChatStore } from '../store/store';

export function LoginForm() {
  const setCreds = useChatStore((s) => s.setCreds);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = idInstance.trim();
    const creds = {
      apiUrl: `https://${id.slice(0, 4)}.api.green-api.com`,
      idInstance: id,
      apiTokenInstance: apiTokenInstance.trim(),
    };

    setLoading(true);
    setError('');
    try {
      await checkCredentials(creds);
      setCreds(creds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h1>Вход в GREEN-API (Telegram)</h1>
      <p className="hint">Данные берутся в личном кабинете вашего инстанса.</p>

      <label>
        idInstance
        <input
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          required
        />
      </label>

      <label>
        apiTokenInstance
        <input
          type="password"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Проверяем…' : 'Войти'}
      </button>
    </form>
  );
}
