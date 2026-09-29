import type { Credentials, Notification } from '../types';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  query?: Record<string, string | number>;
  tail?: string;
}

// {apiUrl}/waInstance{idInstance}/{method}/{apiTokenInstance}
async function request<T>(
  creds: Credentials,
  method: string,
  opts: RequestOptions = {},
): Promise<T> {
  const base = creds.apiUrl.replace(/\/+$/, '');
  const query = opts.query
    ? `?${new URLSearchParams(Object.entries(opts.query).map(([k, v]) => [k, String(v)]))}`
    : '';
  const url = `${base}/waInstance${creds.idInstance}/${method}/${creds.apiTokenInstance}${opts.tail ?? ''}${query}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError('Нет соединения с сервером');
  }

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('Неверный idInstance или apiTokenInstance', res.status);
  }
  if (res.status === 469) {
    throw new ApiError(
      'Telegram временно ограничил проверку номеров, попробуйте позже',
      469,
    );
  }
  if (!res.ok) {
    throw new ApiError(`Ошибка сервера (${res.status})`, res.status);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export function checkCredentials(creds: Credentials) {
  return request<{ stateInstance?: string }>(creds, 'getStateInstance');
}

export async function resolveChatId(
  creds: Credentials,
  target: string,
): Promise<string> {
  const value = target.trim();
  const body = value.startsWith('@')
    ? { username: value }
    : { phoneNumber: Number(value.replace(/\D/g, '')) };

  const res = await request<{ exist?: boolean; chatId?: string }>(
    creds,
    'checkAccount',
    {
      method: 'POST',
      body,
    },
  );
  if (!res?.exist || !res.chatId) {
    throw new ApiError(
      'Аккаунт Telegram не найден. Возможно, номер скрыт настройками приватности.',
    );
  }
  return res.chatId;
}

export function sendMessage(
  creds: Credentials,
  chatId: string,
  message: string,
) {
  return request<{ idMessage: string }>(creds, 'sendMessage', {
    method: 'POST',
    body: { chatId, message },
  });
}

export function receiveNotification(creds: Credentials, signal: AbortSignal) {
  return request<Notification | null>(creds, 'receiveNotification', {
    signal,
    query: { receiveTimeout: 5 },
  });
}

export function deleteNotification(creds: Credentials, receiptId: number) {
  return request<{ result: boolean }>(creds, 'deleteNotification', {
    method: 'DELETE',
    tail: `/${receiptId}`,
  });
}

export function extractText(n: Notification): string | null {
  const data = n.body.messageData;
  if (!data) return null;
  if (data.typeMessage === 'textMessage')
    return data.textMessageData?.textMessage ?? null;
  if (data.typeMessage === 'extendedTextMessage')
    return data.extendedTextMessageData?.text ?? null;
  return null;
}
