/**
 * Search Worker Client
 * 
 * Client wrapper for communicating with the search web worker
 */

import type { SearchableItem } from '../services/search.service'

// ============================================
// Types
// ============================================

interface WorkerMessage {
    type: 'index' | 'search' | 'add' | 'remove' | 'clear'
    payload?: unknown
    requestId: string
}

interface WorkerResponse {
    type: 'indexed' | 'results' | 'added' | 'removed' | 'cleared' | 'error'
    payload?: unknown
    requestId: string
    error?: string
}

type PendingRequest = {
    resolve: (value: unknown) => void
    reject: (error: Error) => void
}

// ============================================
// Worker Client
// ============================================

class SearchWorkerClient {
    private worker: Worker | null = null
    private pendingRequests = new Map<string, PendingRequest>()
    private requestCounter = 0

    /**
     * Initialize the worker
     */
    init(): void {
        if (this.worker) return

        // Create worker from blob for better compatibility
        const workerCode = `
            importScripts('https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js');
            
            let items = [];
            let fuse = null;
            
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
            };
            
            self.onmessage = function(event) {
                const { type, payload, requestId } = event.data;
                
                try {
                    switch (type) {
                        case 'index':
                            items = payload;
                            fuse = new Fuse(items, fuseOptions);
                            self.postMessage({ type: 'indexed', payload: items.length, requestId });
                            break;
                        case 'search':
                            const { query, limit = 10 } = payload;
                            if (!fuse || !query.trim()) {
                                self.postMessage({ type: 'results', payload: [], requestId });
                                break;
                            }
                            const results = fuse.search(query, { limit });
                            const mapped = results.map(r => ({ ...r.item, score: r.score }));
                            self.postMessage({ type: 'results', payload: mapped, requestId });
                            break;
                        case 'add':
                            const item = payload;
                            const existingIndex = items.findIndex(i => i.id === item.id && i.type === item.type);
                            if (existingIndex >= 0) {
                                items[existingIndex] = item;
                            } else {
                                items.push(item);
                            }
                            fuse = new Fuse(items, fuseOptions);
                            self.postMessage({ type: 'added', requestId });
                            break;
                        case 'remove':
                            const { id, itemType } = payload;
                            items = items.filter(i => !(i.id === id && i.type === itemType));
                            fuse = new Fuse(items, fuseOptions);
                            self.postMessage({ type: 'removed', requestId });
                            break;
                        case 'clear':
                            items = [];
                            fuse = null;
                            self.postMessage({ type: 'cleared', requestId });
                            break;
                    }
                } catch (error) {
                    self.postMessage({ type: 'error', error: error.message, requestId });
                }
            };
        `

        const blob = new Blob([workerCode], { type: 'application/javascript' })
        this.worker = new Worker(URL.createObjectURL(blob))

        this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            const { requestId, type, payload, error } = event.data
            const pending = this.pendingRequests.get(requestId)

            if (pending) {
                this.pendingRequests.delete(requestId)

                if (type === 'error') {
                    pending.reject(new Error(error || 'Worker error'))
                } else {
                    pending.resolve(payload)
                }
            }
        }

        this.worker.onerror = (error) => {
            console.error('Search worker error:', error)
        }
    }

    /**
     * Send message to worker and get response
     */
    private send<T>(type: WorkerMessage['type'], payload?: unknown): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.worker) {
                this.init()
            }

            const requestId = `req-${++this.requestCounter}`

            this.pendingRequests.set(requestId, {
                resolve: resolve as (value: unknown) => void,
                reject,
            })

            this.worker!.postMessage({ type, payload, requestId })
        })
    }

    /**
     * Index items in the worker
     */
    async indexItems(items: SearchableItem[]): Promise<number> {
        return this.send<number>('index', items)
    }

    /**
     * Search for items
     */
    async search(query: string, limit = 10): Promise<SearchableItem[]> {
        return this.send<SearchableItem[]>('search', { query, limit })
    }

    /**
     * Add or update an item
     */
    async addItem(item: SearchableItem): Promise<void> {
        return this.send('add', item)
    }

    /**
     * Remove an item
     */
    async removeItem(id: string, type: string): Promise<void> {
        return this.send('remove', { id, itemType: type })
    }

    /**
     * Clear the index
     */
    async clear(): Promise<void> {
        return this.send('clear')
    }

    /**
     * Terminate the worker
     */
    terminate(): void {
        if (this.worker) {
            this.worker.terminate()
            this.worker = null
        }
        this.pendingRequests.clear()
    }
}

// Singleton
export const searchWorker = new SearchWorkerClient()
