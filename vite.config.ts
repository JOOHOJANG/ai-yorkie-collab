import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://openapi.naver.com/v1/search/image.json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [eslintPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),  // 라이브러리 진입점 파일
      name: 'AiYorkieCollab',  // UMD에서의 라이브러리 이름
      formats: ['es', 'umd'],  // ES 모듈과 UMD 형식으로 빌드
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['yorkie-js-sdk'],  // 외부 종속성
      output: {
        globals: {
          'yorkie-js-sdk': 'Yorkie'  // 브라우저 UMD 빌드에서 사용할 외부 종속성 이름
        }
      }
    }
  },
});
