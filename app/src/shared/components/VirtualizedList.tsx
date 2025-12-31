/**
 * Virtualized List Component
 * 
 * Efficiently render large lists with windowing
 */

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

// ============================================
// Types
// ============================================

export interface VirtualizedListProps<T> {
    items: T[]
    itemHeight: number
    renderItem: (item: T, index: number) => ReactNode
    overscan?: number
    className?: string
    containerHeight?: number
}

// ============================================
// Component
// ============================================

export function VirtualizedList<T>({
    items,
    itemHeight,
    renderItem,
    overscan = 3,
    className,
    containerHeight = 400,
}: VirtualizedListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)

    const totalHeight = items.length * itemHeight

    // Calculate visible range
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    const visibleItems = items.slice(startIndex, endIndex)
    const offsetY = startIndex * itemHeight

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop)
    }, [])

    return (
        <div
            ref={containerRef}
            className={cn('overflow-auto', className)}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((item, i) => (
                        <div
                            key={startIndex + i}
                            style={{ height: itemHeight }}
                        >
                            {renderItem(item, startIndex + i)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============================================
// Dynamic Height Virtualized List
// ============================================

export interface DynamicVirtualizedListProps<T> {
    items: T[]
    estimatedItemHeight: number
    renderItem: (item: T, index: number) => ReactNode
    className?: string
    containerHeight?: number
}

export function DynamicVirtualizedList<T>({
    items,
    estimatedItemHeight,
    renderItem,
    className,
    containerHeight = 400,
}: DynamicVirtualizedListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [measuredHeights, setMeasuredHeights] = useState<Map<number, number>>(new Map())

    // Calculate positions based on measured or estimated heights
    const getItemOffset = useCallback((index: number) => {
        let offset = 0
        for (let i = 0; i < index; i++) {
            offset += measuredHeights.get(i) || estimatedItemHeight
        }
        return offset
    }, [measuredHeights, estimatedItemHeight])

    const totalHeight = getItemOffset(items.length)

    // Find visible range
    let startIndex = 0
    let offset = 0
    while (offset < scrollTop && startIndex < items.length) {
        offset += measuredHeights.get(startIndex) || estimatedItemHeight
        startIndex++
    }
    startIndex = Math.max(0, startIndex - 1)

    let endIndex = startIndex
    while (offset < scrollTop + containerHeight && endIndex < items.length) {
        offset += measuredHeights.get(endIndex) || estimatedItemHeight
        endIndex++
    }
    endIndex = Math.min(items.length, endIndex + 1)

    const visibleItems = items.slice(startIndex, endIndex)
    const offsetY = getItemOffset(startIndex)

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop)
    }, [])

    const measureItem = useCallback((index: number, height: number) => {
        setMeasuredHeights(prev => {
            const next = new Map(prev)
            next.set(index, height)
            return next
        })
    }, [])

    return (
        <div
            ref={containerRef}
            className={cn('overflow-auto', className)}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((item, i) => (
                        <MeasuredItem
                            key={startIndex + i}
                            index={startIndex + i}
                            onMeasure={measureItem}
                        >
                            {renderItem(item, startIndex + i)}
                        </MeasuredItem>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============================================
// Measured Item
// ============================================

interface MeasuredItemProps {
    index: number
    children: ReactNode
    onMeasure: (index: number, height: number) => void
}

function MeasuredItem({ index, children, onMeasure }: MeasuredItemProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            onMeasure(index, ref.current.offsetHeight)
        }
    }, [index, onMeasure])

    return <div ref={ref}>{children}</div>
}

export default VirtualizedList
