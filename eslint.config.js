import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === 'development' && eslintPlugin(), // 개발 모드에서만 ESLint 적용
  ].filter(Boolean),
});
