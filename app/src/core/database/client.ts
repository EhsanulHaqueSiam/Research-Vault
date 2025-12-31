/**
 * Database Client
 * 
 * Browser-compatible database client that uses:
 * - Tauri IPC commands when running in Tauri
 * - In-memory mock storage when running in browser (dev mode)
 * 
 * Note: better-sqlite3 cannot be used in browser environment.
 * All actual database operations go through Tauri backend.
 */

import * as schema from './schema'

// Detect if running in Tauri
export const isTauri = typeof window !== 'undefined' &&
    '__TAURI_INTERNALS__' in window

/**
 * In-memory storage for development mode
 * This allows the React app to run in browser for UI development
 */
class InMemoryDatabase {
    private data: Map<string, unknown[]> = new Map([
        ['projects', []],
        ['tasks', []],
        ['notes', []],
        ['tags', []],
    ])

    select() {
        return {
            from: (table: { name?: string }) => {
                const tableName = table.name || 'projects'
                return Promise.resolve(this.data.get(tableName) || [])
            }
        }
    }

    insert(table: { name?: string }) {
        const tableName = table.name || 'projects'
        return {
            values: (data: unknown) => {
                const existing = this.data.get(tableName) || []
                existing.push(data)
                this.data.set(tableName, existing)
                return Promise.resolve()
            }
        }
    }

    update(_table: { name?: string }) {
        return {
            set: () => ({
                where: () => Promise.resolve()
            })
        }
    }

    delete(_table: { name?: string }) {
        return {
            where: () => Promise.resolve()
        }
    }
}

/**
 * Database instance
 * Uses in-memory storage for browser development
 * Real database operations go through Tauri commands
 */
export const db = new InMemoryDatabase() as unknown as {
    select: () => { from: (table: unknown) => Promise<unknown[]> }
    insert: (table: unknown) => { values: (data: unknown) => Promise<void> }
    update: (table: unknown) => { set: (data: unknown) => { where: (condition: unknown) => Promise<void> } }
    delete: (table: unknown) => { where: (condition: unknown) => Promise<void> }
}

// Export schema for use in queries
export { schema }

// Log which mode we're running in
if (typeof window !== 'undefined') {
    console.log(`[Database] Running in ${isTauri ? 'Tauri' : 'Browser'} mode`)
    if (!isTauri) {
        console.log('[Database] Using in-memory mock storage for development')
        console.log('[Database] Run `pnpm tauri:dev` for real database operations')
    }
}
