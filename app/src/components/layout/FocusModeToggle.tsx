/**
 * Focus Mode Toggle Component
 * 
 * Toggle for distraction-free focus mode
 */

import { useState } from 'react'
import { Focus, Maximize2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui'

export interface FocusModeToggleProps {
    enabled?: boolean
    onToggle?: (enabled: boolean) => void
    className?: string
}

export function FocusModeToggle({
    enabled = false,
    onToggle,
    className,
}: FocusModeToggleProps) {
    const [isEnabled, setIsEnabled] = useState(enabled)

    const handleToggle = () => {
        const newState = !isEnabled
        setIsEnabled(newState)
        onToggle?.(newState)
    }

    return (
        <Button
            variant={isEnabled ? 'default' : 'ghost'}
            size="sm"
            onClick={handleToggle}
            className={cn('gap-2', className)}
            title={isEnabled ? 'Exit Focus Mode' : 'Enter Focus Mode'}
        >
            {isEnabled ? (
                <>
                    <Maximize2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Exit Focus</span>
                </>
            ) : (
                <>
                    <Focus className="h-4 w-4" />
                    <span className="hidden sm:inline">Focus</span>
                </>
            )}
        </Button>
    )
}

// Hook for focus mode state
export function useFocusMode(initialState = false) {
    const [focusMode, setFocusMode] = useState(initialState)

    const toggleFocusMode = () => {
        setFocusMode(prev => !prev)
    }

    const enterFocusMode = () => setFocusMode(true)
    const exitFocusMode = () => setFocusMode(false)

    return {
        focusMode,
        toggleFocusMode,
        enterFocusMode,
        exitFocusMode,
    }
}

export default FocusModeToggle
