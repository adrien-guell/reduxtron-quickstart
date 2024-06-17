import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    main: {
        plugins: [tsconfigPaths(), externalizeDepsPlugin()]
    },
    preload: {
        plugins: [tsconfigPaths(), externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        plugins: [tsconfigPaths(), react()]
    }
});
