/**
 * Date Utilities
 * 
 * Centralized date formatting using date-fns (per PROJECT_PLAN.md)
 */

import {
    format,
    formatDistanceToNow,
    isToday,
    isTomorrow,
    isYesterday,
    isPast,
    differenceInDays,
    parseISO,
} from 'date-fns'

/**
 * Format a date for display (e.g., "Dec 31, 2024")
 */
export function formatDate(date: Date | string | number): string {
    const d = ensureDate(date)
    return format(d, 'MMM d, yyyy')
}

/**
 * Format a date with time (e.g., "Dec 31, 2024 at 2:30 PM")
 */
export function formatDateTime(date: Date | string | number): string {
    const d = ensureDate(date)
    return format(d, "MMM d, yyyy 'at' h:mm a")
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string | number): string {
    const d = ensureDate(date)
    return formatDistanceToNow(d, { addSuffix: true })
}

/**
 * Format due date with smart relative display
 * Returns text and overdue status
 */
export function formatDueDate(date: Date | string | number): {
    text: string
    isOverdue: boolean
} {
    const d = ensureDate(date)
    const now = new Date()
    const diffDays = differenceInDays(d, now)

    if (isPast(d) && !isToday(d)) {
        return {
            text: `${Math.abs(diffDays)}d overdue`,
            isOverdue: true
        }
    }

    if (isToday(d)) {
        return { text: 'Today', isOverdue: false }
    }

    if (isTomorrow(d)) {
        return { text: 'Tomorrow', isOverdue: false }
    }

    if (isYesterday(d)) {
        return { text: 'Yesterday', isOverdue: true }
    }

    if (diffDays <= 7 && diffDays > 0) {
        return { text: `${diffDays}d`, isOverdue: false }
    }

    return { text: formatDate(d), isOverdue: false }
}

/**
 * Format timestamp for history/logs (e.g., "2 hours ago" or fallback to date)
 */
export function formatTimestamp(date: Date | string | number): string {
    const d = ensureDate(date)
    const now = new Date()
    const diffDays = Math.abs(differenceInDays(d, now))

    // Use relative for recent, absolute for older
    if (diffDays <= 7) {
        return formatDistanceToNow(d, { addSuffix: true })
    }

    return formatDate(d)
}

/**
 * Ensure input is a Date object
 */
function ensureDate(date: Date | string | number): Date {
    if (date instanceof Date) return date
    if (typeof date === 'string') return parseISO(date)
    return new Date(date)
}

/**
 * Format for ISO date input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string | number): string {
    const d = ensureDate(date)
    return format(d, 'yyyy-MM-dd')
}
