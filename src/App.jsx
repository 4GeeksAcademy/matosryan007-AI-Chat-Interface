import ChatShell from './components/ChatShell.jsx';

export default function App() {
  return <ChatShell title={import.meta.env.VITE_APP_TITLE || 'AI Chat'} />;
}