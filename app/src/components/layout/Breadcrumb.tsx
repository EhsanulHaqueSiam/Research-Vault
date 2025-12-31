/**
 * Breadcrumb Navigation Component
 * 
 * Shows path-based navigation with clickable segments
 */

import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface BreadcrumbItem {
    label: string
    href?: string
    onClick?: () => void
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center text-sm', className)}
        >
            {/* Home */}
            <button
                className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => items[0]?.onClick?.()}
            >
                <Home className="h-4 w-4" />
            </button>

            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
                    {index === items.length - 1 ? (
                        <span className="font-medium text-foreground">
                            {item.label}
                        </span>
                    ) : (
                        <button
                            onClick={item.onClick}
                            className={cn(
                                'text-muted-foreground hover:text-foreground transition-colors',
                                'hover:underline underline-offset-2'
                            )}
                        >
                            {item.label}
                        </button>
                    )}
                </div>
            ))}
        </nav>
    )
}

export default Breadcrumb
