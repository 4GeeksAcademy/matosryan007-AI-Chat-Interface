# AI Chat Interface

A minimal React + Vite foundation for an AI chat interface. Includes a starter
screen only; message sending, AI integration, and a backend are not implemented.

## Getting Started

Requires Node.js 22.12+ and npm.

```sh
npm install
```

Copy `.env.example` to `.env` if it does not exist. A local `.env` is included
in the initial setup but is ignored by Git.

```sh
npm run dev
```

Open the local URL printed by Vite. Run `npm run build` for a production build
and `npm run preview` to preview it locally.

## Structure

```text
src/
	components/    Reusable UI components
	services/      Future API client functions
	App.jsx        Application root
	main.jsx       React entry point
	styles.css     Global styles
.env.example     Safe environment template
vite.config.js   Development and build configuration
```

## Environment and Secrets

- `VITE_APP_TITLE` controls the visible app heading.
- `OPENAI_API_KEY` is a placeholder for a future server-side integration;
	the frontend does not read or use it.
- Variables prefixed with `VITE_` are public and bundled into browser code.
	Never prefix a secret or API key with `VITE_`.
- AI provider requests must go through a backend that keeps credentials private.
	Do not call the provider directly from this browser app with a secret key.
- Keep `.env` local. Commit only `.env.example`, with no real credentials.
- Restart the development server after changing environment variables.
