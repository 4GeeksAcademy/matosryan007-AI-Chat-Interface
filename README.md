# AI Chat Interface

A React + Vite chat interface connected to Groq using `qwen/qwen3.8-27b`.
Send a message with the send button or Enter; Shift + Enter adds a new line.

## Getting Started

Requires Node.js 22.12+ and npm.

```sh
npm install
```

Create a local `.env` containing `GROQ_API_KEY=your_groq_key`.
The existing `OPENAI_API_KEY` variable is also supported for your Groq key.
Keep this file out of Git and never put a secret in a `VITE_` variable.

```sh
npm run dev
```

Open the local URL printed by Vite. Run `npm run build` for a production build
and `npm run preview` to preview it locally.

The `/api/chat` endpoint runs inside the local Vite development and preview
servers. Deploying only `dist/` will not provide this endpoint; production
hosting needs a separate backend or serverless function. This local endpoint
has no authentication or per-user rate limits; do not expose it publicly as-is.

## Structure

```text
src/
	components/    Reusable UI components
	services/      Browser client for the local chat API
	App.jsx        Application root
	main.jsx       React entry point
	styles.css     Global styles
server/chat.js   Server-side Groq request handler
vite.config.js   Development and build configuration
```

## Environment and Secrets

- `VITE_APP_TITLE` controls the visible app heading.
- `GROQ_API_KEY` (or `OPENAI_API_KEY`) holds the Groq credential and is read
	only by the server-side request handler.
- Variables prefixed with `VITE_` are public and bundled into browser code.
	Never prefix a secret or API key with `VITE_`.
- AI provider requests must go through a backend that keeps credentials private.
	Do not call the provider directly from this browser app with a secret key.
- Keep `.env` local. Never commit real credentials.
- Restart the development server after changing environment variables.

The usage sidebar accumulates prompt and completion tokens reported by Groq
across successful responses in the current page session, and displays their
combined total plus the last response's model name. New chats and conversation
switching preserve these counters; reloading the page resets them. These are
session metrics, not account-wide monthly usage or billing. Each request's
prompt usage includes any conversation history sent again with that request.

## Conversation History

Conversation history and the selected chat are saved in this browser's
localStorage and restored on page load. Clear conversation removes all saved
chat history, the current messages, and the draft without changing session
token usage or unrelated browser storage. Clearing is disabled during a request.
History is stored locally, not encrypted or synced to an account; avoid storing
sensitive messages on shared devices. Storage failures display a warning.
