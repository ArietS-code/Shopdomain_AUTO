import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import svgLoader from 'vite-svg-loader';

// Example appId constant would normally live in a constants file.
const appId = 'ai-in-action-workshop-level2-ui';

export default defineConfig(({ mode, command }) => {
  const isBuild = command === 'build';

  return {
    define: {
      'process.env': {},
    },
    plugins: [
      vue(),
      isBuild && cssInjectedByJsPlugin({ styleId: appId }),
      svgLoader({
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // Use runtime + template compiler build to support in-template (inline) compilation and avoid warning:
        // "Component provided template option but runtime compilation is not supported..."
        vue: 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    base: mode === 'development' ? '/' : './',
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          entryFileNames: 'js/app.js',
          chunkFileNames: 'js/[name].js',
          assetFileNames: 'assets/[name][extname]',
          format: 'system',
          exports: 'auto',
        },
      },
      sourcemap: true,
      emptyOutDir: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Import only tokens to avoid Sass module loop from directory recursion
          additionalData: '@use "@/theme/tokens.scss" as *;'
        }
      }
    },
  };
});
