export default function ChatShell({ title }) {
  return (
    <main className="chat-shell">
      <header className="chat-header">
        <h1>{title}</h1>
      </header>
      <section className="chat-empty" aria-label="Conversation">
        <p>No messages yet.</p>
      </section>
    </main>
  );
}