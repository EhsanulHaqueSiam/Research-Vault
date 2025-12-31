/**
 * useSearch Hook
 * 
 * React hook for interacting with the SearchService
 */

import { useState, useCallback, useEffect } from 'react'
import { SearchService, type SearchableItem, type SearchResultType } from '@/core/search'

export interface UseSearchOptions {
    limit?: number
    type?: SearchResultType
    debounceMs?: number
}

export interface UseSearchReturn {
    query: string
    setQuery: (query: string) => void
    results: SearchableItem[]
    isSearching: boolean
    clearResults: () => void
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
    const { limit = 10, type, debounceMs = 200 } = options

    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchableItem[]>([])
    const [isSearching, setIsSearching] = useState(false)

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        setIsSearching(true)

        const timer = setTimeout(() => {
            const searchResults = type
                ? SearchService.searchByType(query, type, limit)
                : SearchService.search(query, limit)

            setResults(searchResults)
            setIsSearching(false)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [query, limit, type, debounceMs])

    const clearResults = useCallback(() => {
        setQuery('')
        setResults([])
    }, [])

    return {
        query,
        setQuery,
        results,
        isSearching,
        clearResults,
    }
}

/**
 * useSearchIndex Hook
 * 
 * Register items in the search index
 */
export function useSearchIndex(items: SearchableItem[]) {
    useEffect(() => {
        if (items.length > 0) {
            SearchService.indexItems(items)
        }

        return () => {
            // Optional: clear on unmount if needed
        }
    }, [items])
}
