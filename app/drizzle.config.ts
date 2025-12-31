import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/core/database/schema/index.ts',
    out: './src/core/database/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './research.db',
    },
})
