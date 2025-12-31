/**
 * Quick Access Store
 * 
 * Manages recent files, favorites, and breadcrumb navigation
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================
// Types
// ============================================

export interface QuickAccessItem {
    id: string
    type: 'project' | 'note' | 'task'
    title: string
    path: string
    accessedAt: Date
}

export interface Breadcrumb {
    id: string
    type: 'project' | 'note' | 'task' | 'home'
    title: string
    path: string
}

interface QuickAccessState {
    // Recent items (last accessed)
    recentItems: QuickAccessItem[]
    maxRecentItems: number

    // Favorites (pinned items)
    favorites: QuickAccessItem[]

    // Breadcrumb navigation
    breadcrumbs: Breadcrumb[]

    // Actions
    addRecentItem: (item: Omit<QuickAccessItem, 'accessedAt'>) => void
    clearRecentItems: () => void

    addFavorite: (item: Omit<QuickAccessItem, 'accessedAt'>) => void
    removeFavorite: (id: string) => void
    isFavorite: (id: string) => boolean

    pushBreadcrumb: (crumb: Breadcrumb) => void
    popBreadcrumb: () => void
    setBreadcrumbs: (crumbs: Breadcrumb[]) => void
    clearBreadcrumbs: () => void
}

// ============================================
// Store
// ============================================

export const useQuickAccess = create<QuickAccessState>()(
    persist(
        (set, get) => ({
            recentItems: [],
            maxRecentItems: 20,
            favorites: [],
            breadcrumbs: [],

            addRecentItem: (item) => {
                set((state) => {
                    // Remove existing entry for same item
                    const filtered = state.recentItems.filter(
                        (r) => !(r.id === item.id && r.type === item.type)
                    )

                    // Add to front
                    const newItem: QuickAccessItem = {
                        ...item,
                        accessedAt: new Date(),
                    }

                    // Keep only max items
                    const updated = [newItem, ...filtered].slice(0, state.maxRecentItems)

                    return { recentItems: updated }
                })
            },

            clearRecentItems: () => set({ recentItems: [] }),

            addFavorite: (item) => {
                set((state) => {
                    // Don't add duplicates
                    if (state.favorites.some((f) => f.id === item.id && f.type === item.type)) {
                        return state
                    }

                    return {
                        favorites: [
                            ...state.favorites,
                            { ...item, accessedAt: new Date() },
                        ],
                    }
                })
            },

            removeFavorite: (id) => {
                set((state) => ({
                    favorites: state.favorites.filter((f) => f.id !== id),
                }))
            },

            isFavorite: (id) => {
                return get().favorites.some((f) => f.id === id)
            },

            pushBreadcrumb: (crumb) => {
                set((state) => {
                    // Don't add duplicate at end
                    const last = state.breadcrumbs[state.breadcrumbs.length - 1]
                    if (last?.id === crumb.id && last?.type === crumb.type) {
                        return state
                    }

                    // Check if already in path, truncate if so
                    const existingIndex = state.breadcrumbs.findIndex(
                        (b) => b.id === crumb.id && b.type === crumb.type
                    )

                    if (existingIndex >= 0) {
                        return {
                            breadcrumbs: [...state.breadcrumbs.slice(0, existingIndex + 1)],
                        }
                    }

                    return {
                        breadcrumbs: [...state.breadcrumbs, crumb],
                    }
                })
            },

            popBreadcrumb: () => {
                set((state) => ({
                    breadcrumbs: state.breadcrumbs.slice(0, -1),
                }))
            },

            setBreadcrumbs: (crumbs) => set({ breadcrumbs: crumbs }),

            clearBreadcrumbs: () => set({ breadcrumbs: [] }),
        }),
        {
            name: 'quick-access',
        }
    )
)
