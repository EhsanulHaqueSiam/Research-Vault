/**
 * Search Service
 * 
 * Provides fuzzy search across projects, notes, and tasks using Fuse.js
 */

import Fuse from 'fuse.js'

// ============================================
// Types
// ============================================

export type SearchResultType = 'project' | 'note' | 'task' | 'action'

export interface SearchResult {
    id: string
    type: SearchResultType
    title: string
    description?: string
    icon?: string
    path?: string
    score?: number
    onSelect: () => void
}

export interface SearchableItem {
    id: string
    type: SearchResultType
    title: string
    content?: string
    tags?: string[]
    path?: string
}

// ============================================
// Fuse Options
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
// Search Service
// ============================================

class SearchServiceClass {
    private index: Fuse<SearchableItem> | null = null
    private items: SearchableItem[] = []

    /**
     * Index items for searching
     */
    indexItems(items: SearchableItem[]): void {
        this.items = items
        this.index = new Fuse(items, fuseOptions)
    }

    /**
     * Add or update an item in the index
     */
    addItem(item: SearchableItem): void {
        const existingIndex = this.items.findIndex(i => i.id === item.id && i.type === item.type)
        if (existingIndex >= 0) {
            this.items[existingIndex] = item
        } else {
            this.items.push(item)
        }
        this.index = new Fuse(this.items, fuseOptions)
    }

    /**
     * Remove an item from the index
     */
    removeItem(id: string, type: SearchResultType): void {
        this.items = this.items.filter(i => !(i.id === id && i.type === type))
        this.index = new Fuse(this.items, fuseOptions)
    }

    /**
     * Search for items
     */
    search(query: string, limit = 10): SearchableItem[] {
        if (!this.index || !query.trim()) {
            return []
        }

        const results = this.index.search(query, { limit })
        return results.map(r => ({
            ...r.item,
            score: r.score,
        }))
    }

    /**
     * Get recent items (for empty search)
     */
    getRecent(limit = 5): SearchableItem[] {
        return this.items.slice(0, limit)
    }

    /**
     * Filter by type
     */
    searchByType(query: string, type: SearchResultType, limit = 10): SearchableItem[] {
        const results = this.search(query, limit * 2)
        return results.filter(r => r.type === type).slice(0, limit)
    }

    /**
     * Get all items of a type
     */
    getByType(type: SearchResultType): SearchableItem[] {
        return this.items.filter(i => i.type === type)
    }

    /**
     * Clear the index
     */
    clear(): void {
        this.items = []
        this.index = null
    }
}

// Singleton
export const SearchService = new SearchServiceClass()
