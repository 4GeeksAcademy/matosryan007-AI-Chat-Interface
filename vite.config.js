import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createChatMiddleware } from './server/chat.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configureChat = server => {
    server.middlewares.use(createChatMiddleware(env));
  };

  return {
    plugins: [react(), {
      name: 'local-chat-api',
      configureServer: configureChat,
      configurePreviewServer: configureChat,
    }],
  };
});