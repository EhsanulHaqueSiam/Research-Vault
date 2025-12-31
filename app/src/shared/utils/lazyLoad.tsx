/**
 * Lazy Loading Utilities
 * 
 * Code splitting and lazy loading helpers for React components
 */

import { lazy, Suspense, type ReactNode } from 'react'
import { PageLoading } from '@/shared/components/LoadingStates'

// ============================================
// Types
// ============================================

export interface LazyLoadOptions {
    fallback?: ReactNode
    delay?: number
}

// ============================================
// Lazy Component Factory
// ============================================

/**
 * Create a lazy-loaded component with a loading fallback
 */
export function lazyLoad(
    importFn: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
    options: LazyLoadOptions = {}
) {
    const { fallback = <PageLoading />, delay = 0 } = options

    const LazyComponent = lazy(() => {
        if (delay > 0) {
            return Promise.all([
                importFn(),
                new Promise(resolve => setTimeout(resolve, delay))
            ]).then(([module]) => module)
        }
        return importFn()
    })

    return function LazyWrapper(props: Record<string, unknown>) {
        return (
            <Suspense fallback={fallback}>
                <LazyComponent {...props} />
            </Suspense>
        )
    }
}

// ============================================
// Route Lazy Loading
// ============================================

/**
 * Create lazy-loaded route components
 */
export function lazyRoute(
    importFn: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
    fallback?: ReactNode
) {
    return lazyLoad(importFn, { fallback: fallback || <PageLoading message="Loading page..." /> })
}

// ============================================
// Feature Lazy Loading
// ============================================

/**
 * Lazy load feature modules
 */
export function lazyFeature<T>(
    importFn: () => Promise<T>,
    options: { timeout?: number } = {}
): () => Promise<T> {
    const { timeout = 10000 } = options
    let cachedModule: T | null = null

    return async () => {
        if (cachedModule) return cachedModule

        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Feature load timeout')), timeout)
        })

        cachedModule = await Promise.race([importFn(), timeoutPromise])
        return cachedModule
    }
}

// ============================================
// Preload Utilities
// ============================================

/**
 * Preload a lazy component on hover or other trigger
 */
export function preload(importFn: () => Promise<unknown>): void {
    importFn()
}

/**
 * Create a preloadable lazy component
 */
export function createPreloadableLazy(
    importFn: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>
) {
    const Component = lazyLoad(importFn)

    return Object.assign(Component, {
        preload: () => importFn(),
    })
}
