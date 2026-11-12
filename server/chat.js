export const CHAT_MODEL = 'qwen/qwen3.8-27b';

export function createChatMiddleware(env) {
  return async function chatMiddleware(request, response, next) {
    if (request.url?.split('?')[0] !== '/api/chat') return next();

    const send = (status, body) => {
      response.writeHead(status, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body));
    };

    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return send(405, { error: 'Use POST to send a message.' });
    }

    const apiKey = env.GROQ_API_KEY || env.OPENAI_API_KEY;
    if (!apiKey) return send(503, { error: 'Configure GROQ_API_KEY or OPENAI_API_KEY on the server.' });

    try {
      let rawBody = '';
      for await (const chunk of request) {
        rawBody += chunk.toString();
        if (Buffer.byteLength(rawBody) > 65536) {
          return send(413, { error: 'Conversation is too long. Start a new chat.' });
        }
      }

      let body;
      try {
        body = JSON.parse(rawBody);
      } catch {
        return send(400, { error: 'Invalid JSON request.' });
      }

      if (!Array.isArray(body?.messages) || body.messages.length === 0 ||
        !body.messages.every(message => message && ['user', 'assistant'].includes(message.role) &&
          typeof message.content === 'string' && message.content.trim())) {
        return send(400, { error: 'Provide nonempty user or assistant messages.' });
      }

      const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages: body.messages.map(({ role, content }) => ({ role, content })),
          max_tokens: 2048,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!upstream.ok) {
        return send(upstream.status === 429 ? 429 : 502, {
          error: upstream.status === 429
            ? 'Groq is rate limiting requests. Please try again shortly.'
            : 'Groq could not complete the request. Check the server key and model access.',
        });
      }

      const result = await upstream.json();
      const message = result.choices?.[0]?.message?.content;
      if (typeof message !== 'string' || !message.trim()) {
        return send(502, { error: 'Groq returned an empty reply. Please try again.' });
      }

      return send(200, { message, model: result.model || CHAT_MODEL, usage: result.usage });
    } catch (error) {
      return send(error.name === 'TimeoutError' ? 504 : 502, {
        error: error.name === 'TimeoutError'
          ? 'The response timed out. Please try again.'
          : 'Unable to reach Groq. Please try again.',
      });
    }
  };
}