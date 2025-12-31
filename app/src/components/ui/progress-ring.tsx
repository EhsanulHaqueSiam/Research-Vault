/**
 * Progress Ring Component
 * 
 * Circular progress indicator with percentage
 */

import { cn } from '@/shared/utils/cn'

export interface ProgressRingProps {
    progress: number // 0-100
    size?: 'sm' | 'md' | 'lg'
    strokeWidth?: number
    showLabel?: boolean
    label?: string
    color?: string
    className?: string
}

const sizeMap = {
    sm: 48,
    md: 80,
    lg: 120,
}

export function ProgressRing({
    progress,
    size = 'md',
    strokeWidth = 6,
    showLabel = true,
    label,
    color = '#3b82f6',
    className,
}: ProgressRingProps) {
    const dimension = sizeMap[size]
    const radius = (dimension - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg width={dimension} height={dimension} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={dimension / 2}
                    cy={dimension / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/30"
                />
                {/* Progress circle */}
                <circle
                    cx={dimension / 2}
                    cy={dimension / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-out"
                />
            </svg>

            {showLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn(
                        'font-bold',
                        size === 'sm' && 'text-xs',
                        size === 'md' && 'text-lg',
                        size === 'lg' && 'text-2xl'
                    )}>
                        {Math.round(progress)}%
                    </span>
                    {label && size !== 'sm' && (
                        <span className="text-xs text-muted-foreground">{label}</span>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProgressRing
