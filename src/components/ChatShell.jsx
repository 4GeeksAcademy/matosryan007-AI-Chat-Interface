import { useMemo, useState } from 'react';

const starterMessages = [
  { role: 'user', text: 'Can you help me plan a focused launch week for my new product?' },
  { role: 'assistant', text: 'Absolutely. A focused launch week works best when every day has one clear goal. Here’s a lightweight plan to get you from final checks to your first customers.', detail: 'I’d start by locking the essentials: a clear landing page, one primary launch channel, and a simple way to collect feedback. Then build momentum with a small, deliberate sequence rather than trying to be everywhere at once.' },
];

const initialConversations = [
  { title: 'Launch week plan', time: 'Just now', active: true },
  { title: 'Product positioning notes', time: 'Yesterday' },
  { title: 'Homepage headline ideas', time: 'Yesterday' },
  { title: 'Customer interview guide', time: 'Oct 22' },
  { title: 'Q4 content calendar', time: 'Oct 19' },
];

function Icon({ name, size = 16 }) {
  const paths = {
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    down: <><path d="M12 5v14M19 12l-7 7-7-7" /></>,
    sidebar: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function HistoryPanel({ conversations, onNew, onSelect, selected }) {
  return <aside className="history-panel" aria-label="Message history">
    <div className="history-top"><div className="brand-mark"><span className="brand-glyph">v</span><span>converse</span></div><button className="icon-button panel-toggle" aria-label="Collapse history"><Icon name="sidebar" /></button></div>
    <button className="new-chat" onClick={onNew}><Icon name="plus" /> <span>New chat</span><kbd>⌘ K</kbd></button>
    <button className="search-history"><Icon name="search" /><span>Search conversations</span><kbd>⌘ /</kbd></button>
    <div className="history-label">YOUR CHATS <button className="icon-button tiny" aria-label="More chat options"><Icon name="more" /></button></div>
    <nav className="conversation-list" aria-label="Conversations">
      {conversations.map((item, index) => <button key={`${item.title}-${index}`} className={`conversation-item ${selected === index ? 'selected' : ''}`} onClick={() => onSelect(index)}>
        <span className="conversation-name">{item.title}</span><span className="conversation-time">{item.time}</span>
      </button>)}
    </nav>
    <div className="history-footer"><div className="avatar">R</div><div className="account"><strong>Ryan Matos</strong><span>Free plan</span></div><button className="icon-button tiny" aria-label="Account options"><Icon name="more" /></button></div>
  </aside>;
}

function UsageSidebar({ total, promptTokens, completionTokens }) {
  const used = Math.min(100, Math.round(total / 50000 * 100));
  return <aside className="usage-sidebar" aria-label="Token usage statistics">
    <div className="usage-heading"><div><span className="eyebrow">WORKSPACE</span><h2>Usage</h2></div><button className="icon-button" aria-label="More usage options"><Icon name="more" /></button></div>
    <section className="usage-card">
      <div className="card-topline"><span>THIS MONTH</span><span className="live-dot">● LIVE</span></div>
      <div className="total-tokens">{total.toLocaleString()}<span> tokens</span></div>
      <div className="usage-track"><span style={{ width: `${used}%` }} /></div>
      <div className="usage-foot"><span>{used}% of 50,000</span><span>Resets Nov 30</span></div>
    </section>
    <section className="usage-section"><div className="section-heading"><h3>Token breakdown</h3><button className="period-select">This week <span>⌄</span></button></div>
      <div className="token-row"><div className="token-label"><span className="token-dot input-dot" />Input tokens</div><strong>{promptTokens.toLocaleString()}</strong></div>
      <div className="mini-track"><span className="input-fill" style={{ width: `${Math.max(8, promptTokens / Math.max(1, promptTokens + completionTokens) * 100)}%` }} /></div>
      <div className="token-row second-row"><div className="token-label"><span className="token-dot output-dot" />Output tokens</div><strong>{completionTokens.toLocaleString()}</strong></div>
      <div className="mini-track"><span className="output-fill" style={{ width: `${Math.max(8, completionTokens / Math.max(1, promptTokens + completionTokens) * 100)}%` }} /></div>
    </section>
    <section className="usage-section model-section"><div className="section-heading"><h3>By model</h3><button className="text-link">View all</button></div>
      <div className="model-row"><span className="model-icon">✳</span><span className="model-name">GPT-4o</span><strong>{Math.max(0, total - 1240).toLocaleString()}</strong></div>
      <div className="model-caption">Primary model · 98% of usage</div>
      <div className="model-row second-model"><span className="model-icon model-icon-muted">✧</span><span className="model-name">GPT-4o mini</span><strong>{Math.min(total, 1240).toLocaleString()}</strong></div>
      <div className="model-caption">Quick tasks · 2% of usage</div>
    </section>
    <div className="usage-note"><span className="note-icon"><Icon name="spark" size={14} /></span><p><strong>Make every token count.</strong><br />Track your usage as you work.</p></div>
  </aside>;
}

export default function ChatShell({ title }) {
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState('');
  const [conversations, setConversations] = useState(initialConversations);
  const [selected, setSelected] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [usageOpen, setUsageOpen] = useState(true);
  const promptTokens = useMemo(() => 1842 + messages.reduce((sum, item) => sum + Math.ceil(item.text.split(/\s+/).length * 1.35), 0), [messages]);
  const completionTokens = useMemo(() => 920 + messages.filter(item => item.role === 'assistant').reduce((sum, item) => sum + Math.ceil(item.text.split(/\s+/).length * 1.45), 0), [messages]);
  const total = promptTokens + completionTokens;

  function submitMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages(current => [...current, { role: 'user', text }, { role: 'assistant', text: `That’s a great question. I’d approach “${text}” by breaking it into a few clear, manageable steps. Start with the outcome you want, choose the smallest useful next action, then refine from there.`, detail: 'Want me to turn that into a more detailed plan?' }]);
    setDraft('');
    setSentCount(count => count + 1);
  }

  function newChat() {
    const next = [{ title: 'New conversation', time: 'Just now', active: true }, ...conversations.map(item => ({ ...item, active: false }))];
    setConversations(next);
    setSelected(0);
    setMessages([]);
    setSentCount(0);
  }

  function selectConversation(index) {
    setSelected(index);
    if (index !== selected) {
      setMessages(index === 0 ? starterMessages : [{ role: 'user', text: conversations[index].title }, { role: 'assistant', text: 'Let’s pick up where we left off. What would you like to explore next?', detail: 'Your conversation is ready when you are.' }]);
    }
  }

  return <main className="app-frame">
    {historyOpen && <HistoryPanel conversations={conversations} onNew={newChat} onSelect={selectConversation} selected={selected} />}
    <section className="chat-workspace">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setHistoryOpen(!historyOpen)} aria-label="Toggle message history"><Icon name="sidebar" /></button><div className="model-picker"><span className="model-status" />{title === 'AI Chat' ? 'GPT-4o' : title}<span className="model-caret">⌄</span><span className="model-divider" /><span className="model-subtitle">Balanced</span></div></div><div className="topbar-right"><span className="saved-indicator"><span /> All changes saved</span><button className="icon-button" onClick={() => setUsageOpen(!usageOpen)} aria-label="Toggle usage sidebar"><Icon name="sidebar" /></button><button className="share-button">Share</button></div></header>
      <div className="chat-content">
        <div className="thread-header"><div><div className="thread-kicker"><span className="thread-orb">✳</span> NEW CONVERSATION</div><h1>{conversations[selected]?.title || 'A little clarity goes a long way.'}</h1></div><button className="thread-more icon-button" aria-label="Conversation options"><Icon name="more" /></button></div>
        <div className="message-list" aria-live="polite">
          {messages.length === 0 ? <div className="welcome-state"><div className="welcome-orb">✳</div><h2>What can I help you think through?</h2><p>A clear space for big ideas, little questions, and everything in between.</p><div className="prompt-chips"><button onClick={() => setDraft('Help me brainstorm a new idea')}>✧ &nbsp;Brainstorm ideas</button><button onClick={() => setDraft('Help me make a clear plan')}>▤ &nbsp;Make a plan</button><button onClick={() => setDraft('Explain a complex topic simply')}>◉ &nbsp;Learn something</button></div></div> : messages.map((message, index) => <article className={`message ${message.role}`} key={`${index}-${message.text.slice(0, 12)}`}>
            {message.role === 'assistant' ? <div className="assistant-avatar">✳</div> : <div className="user-avatar">R</div>}
            <div className="message-body"><div className="message-meta"><strong>{message.role === 'user' ? 'You' : 'Converse'}</strong><span>{message.role === 'user' ? '2:41 PM' : 'Just now'}</span></div><p>{message.text}</p>{message.detail && <p className="message-detail">{message.detail}</p>}{message.role === 'assistant' && <div className="message-actions"><button aria-label="Copy response"><Icon name="copy" size={14} /></button><button aria-label="More response actions"><Icon name="more" size={14} /></button></div>}</div>
          </article>)}
          {messages.length > 0 && <div className="thread-end"><span /> You&apos;re all caught up <span /></div>}
        </div>
        <form className="composer" onSubmit={submitMessage}><label className="sr-only" htmlFor="message-input">Write a message</label><textarea id="message-input" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} placeholder="Message Converse..." rows={2} /><div className="composer-bottom"><div className="composer-tools"><button type="button" className="tool-button" aria-label="Add attachment"><span>＋</span></button><span className="composer-hint">Shift + Return to add a new line</span></div><div className="composer-right"><span className="token-estimate">{draft ? Math.ceil(draft.length / 4) : 0} tokens</span><button type="submit" className="send-button" aria-label="Send message" disabled={!draft.trim()}><Icon name="send" size={15} /></button></div></div></form>
        <div className="model-footnote"><span className="lock-mark">◈</span> Converse can make mistakes. Check important info.</div>
      </div>
    </section>
    {usageOpen && <UsageSidebar total={total} promptTokens={promptTokens} completionTokens={completionTokens} />}
    {!usageOpen && <button className="floating-usage" onClick={() => setUsageOpen(true)}>Usage overview <Icon name="chevron" /></button>}
  </main>;
}
