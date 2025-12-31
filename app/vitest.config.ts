import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        include: ['src/**/*.{test,spec}.{js,ts,tsx}', 'tests/unit/**/*.{test,spec}.{js,ts,tsx}'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            'tests/e2e/**',  // E2E tests run with Playwright
            'tests/integration/**',  // Integration tests need native bindings
            'tests/unit/backup.service.test.ts',  // Has transitive dependency on better-sqlite3
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/stores': path.resolve(__dirname, './src/stores'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/services': path.resolve(__dirname, './src/services'),
            '@/lib': path.resolve(__dirname, './src/lib'),
            '@/types': path.resolve(__dirname, './src/lib/types'),
        },
    },
})
