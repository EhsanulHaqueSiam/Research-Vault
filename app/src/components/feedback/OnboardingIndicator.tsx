/**
 * Onboarding Indicator Component
 * 
 * Pulse animation for features users haven't tried
 */

import { cn } from '@/shared/utils/cn'

export interface OnboardingIndicatorProps {
    children: React.ReactNode
    show?: boolean
    label?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
}

export function OnboardingIndicator({
    children,
    show = true,
    label,
    position = 'top',
    className,
}: OnboardingIndicatorProps) {
    if (!show) {
        return <>{children}</>
    }

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }

    return (
        <div className={cn('relative', className)}>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-lg ring-2 ring-primary/50 animate-pulse pointer-events-none" />

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse pointer-events-none" />

            {/* Label tooltip */}
            {label && (
                <div className={cn(
                    'absolute z-10 px-2 py-1 text-xs font-medium',
                    'bg-primary text-primary-foreground rounded-md',
                    'whitespace-nowrap',
                    positionClasses[position]
                )}>
                    {label}
                    <span className="animate-bounce inline-block ml-1">→</span>
                </div>
            )}

            {children}
        </div>
    )
}

export default OnboardingIndicator
