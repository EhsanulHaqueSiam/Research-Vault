/**
 * Search Worker
 * 
 * Web Worker for offloading search indexing and querying
 */

import Fuse from 'fuse.js'

// ============================================
// Types
// ============================================

interface SearchableItem {
    id: string
    type: 'project' | 'note' | 'task' | 'action'
    title: string
    content?: string
    tags?: string[]
    path?: string
}

interface WorkerMessage {
    type: 'index' | 'search' | 'add' | 'remove' | 'clear'
    payload?: unknown
    requestId?: string
}

interface WorkerResponse {
    type: 'indexed' | 'results' | 'added' | 'removed' | 'cleared' | 'error'
    payload?: unknown
    requestId?: string
    error?: string
}

// ============================================
// Fuse Configuration
// ============================================

const fuseOptions = {
    keys: [
        { name: 'title', weight: 2 },
        { name: 'content', weight: 1 },
        { name: 'tags', weight: 1.5 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
}

// ============================================
// Worker State
// ============================================

let items: SearchableItem[] = []
let fuse: Fuse<SearchableItem> | null = null

// ============================================
// Message Handler
// ============================================

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { type, payload, requestId } = event.data

    try {
        switch (type) {
            case 'index': {
                items = payload as SearchableItem[]
                fuse = new Fuse(items, fuseOptions)
                respond({ type: 'indexed', payload: items.length, requestId })
                break
            }

            case 'search': {
                const { query, limit = 10 } = payload as { query: string; limit?: number }
                if (!fuse || !query.trim()) {
                    respond({ type: 'results', payload: [], requestId })
                    break
                }
                const results = fuse.search(query, { limit })
                const mapped = results.map(r => ({ ...r.item, score: r.score }))
                respond({ type: 'results', payload: mapped, requestId })
                break
            }

            case 'add': {
                const item = payload as SearchableItem
                const existingIndex = items.findIndex(i => i.id === item.id && i.type === item.type)
                if (existingIndex >= 0) {
                    items[existingIndex] = item
                } else {
                    items.push(item)
                }
                fuse = new Fuse(items, fuseOptions)
                respond({ type: 'added', requestId })
                break
            }

            case 'remove': {
                const { id, itemType } = payload as { id: string; itemType: string }
                items = items.filter(i => !(i.id === id && i.type === itemType))
                fuse = new Fuse(items, fuseOptions)
                respond({ type: 'removed', requestId })
                break
            }

            case 'clear': {
                items = []
                fuse = null
                respond({ type: 'cleared', requestId })
                break
            }

            default:
                respond({ type: 'error', error: `Unknown message type: ${type}`, requestId })
        }
    } catch (error) {
        respond({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            requestId,
        })
    }
}

function respond(response: WorkerResponse) {
    self.postMessage(response)
}
