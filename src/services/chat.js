export async function sendChatMessage(messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(message => ({
        role: message.role,
        content: [message.text, message.detail].filter(Boolean).join('\n\n'),
      })),
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to send your message.');
  return result;
}