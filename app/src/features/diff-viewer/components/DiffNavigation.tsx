/**
 * Diff Navigation Component
 * 
 * Controls for navigating between changes in a diff
 */

import { memo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui'
import type { DiffNavigationProps } from '../types'

function DiffNavigationComponent({
    totalChanges,
    currentIndex,
    onPrevious,
    onNext,
}: DiffNavigationProps) {
    if (totalChanges === 0) return null

    return (
        <div className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30">
            <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                disabled={currentIndex <= 0}
                className="h-7"
            >
                <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[80px] text-center">
                Change {currentIndex + 1} of {totalChanges}
            </span>
            <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={currentIndex >= totalChanges - 1}
                className="h-7"
            >
                <ChevronDown className="h-4 w-4" />
            </Button>
        </div>
    )
}

export const DiffNavigation = memo(DiffNavigationComponent)
