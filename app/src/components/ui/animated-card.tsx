/**
 * Animated Card Component
 * 
 * Card wrapper with hover animations and glassmorphism support
 */

import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated'
    hoverEffect?: 'scale' | 'lift' | 'glow' | 'none'
    children: React.ReactNode
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(({
    variant = 'default',
    hoverEffect = 'lift',
    className,
    children,
    ...props
}, ref) => {
    const variantClasses = {
        default: 'bg-card border border-border',
        glass: 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg',
        elevated: 'bg-card border border-border shadow-md',
    }

    const hoverClasses = {
        none: '',
        scale: 'hover:scale-[1.02] transition-transform duration-200',
        lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
        glow: 'hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-200',
    }

    return (
        <div
            ref={ref}
            className={cn(
                'rounded-xl',
                variantClasses[variant],
                hoverClasses[hoverEffect],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})

AnimatedCard.displayName = 'AnimatedCard'

export default AnimatedCard
