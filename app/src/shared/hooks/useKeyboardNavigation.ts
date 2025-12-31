/**
 * Keyboard Navigation Hook
 * 
 * Adds j/k navigation, Enter to open, Esc to close
 */

import { useEffect, useCallback, useState } from 'react'

export interface UseKeyboardNavigationOptions<T> {
    items: T[]
    onSelect?: (item: T, index: number) => void
    onOpen?: (item: T, index: number) => void
    onClose?: () => void
    enabled?: boolean
    loop?: boolean
}

export interface UseKeyboardNavigationReturn {
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    handleKeyDown: (e: React.KeyboardEvent) => void
}

export function useKeyboardNavigation<T>({
    items,
    onSelect,
    onOpen,
    onClose,
    enabled = true,
    loop = true,
}: UseKeyboardNavigationOptions<T>): UseKeyboardNavigationReturn {
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!enabled || items.length === 0) return

        switch (e.key) {
            case 'j':
            case 'ArrowDown': {
                e.preventDefault()
                const nextIndex = selectedIndex + 1
                if (nextIndex < items.length) {
                    setSelectedIndex(nextIndex)
                    onSelect?.(items[nextIndex], nextIndex)
                } else if (loop) {
                    setSelectedIndex(0)
                    onSelect?.(items[0], 0)
                }
                break
            }
            case 'k':
            case 'ArrowUp': {
                e.preventDefault()
                const prevIndex = selectedIndex - 1
                if (prevIndex >= 0) {
                    setSelectedIndex(prevIndex)
                    onSelect?.(items[prevIndex], prevIndex)
                } else if (loop) {
                    const lastIndex = items.length - 1
                    setSelectedIndex(lastIndex)
                    onSelect?.(items[lastIndex], lastIndex)
                }
                break
            }
            case 'Enter': {
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < items.length) {
                    onOpen?.(items[selectedIndex], selectedIndex)
                }
                break
            }
            case 'Escape': {
                e.preventDefault()
                setSelectedIndex(-1)
                onClose?.()
                break
            }
        }
    }, [enabled, items, selectedIndex, onSelect, onOpen, onClose, loop])

    // Reset selection when items change
    useEffect(() => {
        setSelectedIndex(-1)
    }, [items])

    return {
        selectedIndex,
        setSelectedIndex,
        handleKeyDown,
    }
}

export default useKeyboardNavigation
