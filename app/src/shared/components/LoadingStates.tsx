/**
 * Loading State Components
 * 
 * Consistent loading indicators for the application
 */

import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// ============================================
// Spinner
// ============================================

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-10 h-10',
    }

    return (
        <Loader2 className={cn('animate-spin text-blue-500', sizeClasses[size], className)} />
    )
}

// ============================================
// Page Loading
// ============================================

export interface PageLoadingProps {
    message?: string
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-slate-500">{message}</p>
        </div>
    )
}

// ============================================
// Skeleton Loaders
// ============================================

export interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn(
            'animate-pulse bg-slate-200 dark:bg-slate-700 rounded',
            className
        )} />
    )
}

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </div>
    )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// ============================================
// Button Loading State
// ============================================

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    loadingText?: string
    children: React.ReactNode
}

export function LoadingButton({
    isLoading,
    loadingText = 'Loading...',
    children,
    disabled,
    className,
    ...props
}: LoadingButtonProps) {
    return (
        <button
            disabled={isLoading || disabled}
            className={cn(
                'flex items-center justify-center gap-2 transition-opacity',
                (isLoading || disabled) && 'opacity-70 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {isLoading && <Spinner size="sm" />}
            {isLoading ? loadingText : children}
        </button>
    )
}
