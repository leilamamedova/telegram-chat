import { Chat } from './components/Chat';
import { LoginForm } from './components/LoginForm';
import { NewChatForm } from './components/NewChatForm';
import { useChatStore } from './store/store';

export default function App() {
  const creds = useChatStore((s) => s.creds);
  const chat = useChatStore((s) => s.chat);
  const logout = useChatStore((s) => s.logout);

  if (!creds) {
    return (
      <main className="center">
        <LoginForm />
      </main>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <span>Telegram Chat</span>
        <button className="link" onClick={logout}>
          Выйти
        </button>
      </header>

      {chat ? (
        <Chat creds={creds} chat={chat} />
      ) : (
        <main className="center">
          <NewChatForm creds={creds} />
        </main>
      )}
    </div>
  );
}
