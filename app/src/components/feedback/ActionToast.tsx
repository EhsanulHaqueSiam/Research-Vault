/**
 * Action Toast Component
 * 
 * Toast notifications with action buttons (undo, view, etc.)
 */

import { useState, useEffect, useCallback } from 'react'
import { Check, X, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface ToastAction {
    label: string
    onClick: () => void
}

export interface ActionToastProps {
    id: string
    type?: 'success' | 'error' | 'info' | 'warning'
    message: string
    actions?: ToastAction[]
    duration?: number // ms, 0 = no auto-dismiss
    onDismiss?: (id: string) => void
}

const icons = {
    success: Check,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
}

const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
}

export function ActionToast({
    id,
    type = 'success',
    message,
    actions = [],
    duration = 5000,
    onDismiss,
}: ActionToastProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isExiting, setIsExiting] = useState(false)

    const handleDismiss = useCallback(() => {
        setIsExiting(true)
        setTimeout(() => {
            setIsVisible(false)
            onDismiss?.(id)
        }, 200)
    }, [id, onDismiss])

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(handleDismiss, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, handleDismiss])

    if (!isVisible) return null

    const Icon = icons[type]

    return (
        <div className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
            'bg-card border backdrop-blur-sm',
            'transition-all duration-200',
            isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        )}>
            {/* Icon */}
            <div className={cn('p-1 rounded-full', colors[type])}>
                <Icon className="h-3.5 w-3.5" />
            </div>

            {/* Message */}
            <span className="text-sm flex-1">{message}</span>

            {/* Actions */}
            {actions.map((action, i) => (
                <button
                    key={i}
                    onClick={action.onClick}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    {action.label}
                </button>
            ))}

            {/* Close */}
            <button
                onClick={handleDismiss}
                className="p-1 hover:bg-muted rounded transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

// ============================================
// Toast Container & Hook
// ============================================

export type Toast = Omit<ActionToastProps, 'onDismiss'>

// Internal state type (not exported)
// interface ToastState {
//     toasts: Toast[]
//     addToast: (toast: Omit<Toast, 'id'>) => string
//     removeToast: (id: string) => void
// }

let toastCounter = 0
const listeners: Set<(toasts: Toast[]) => void> = new Set()
let toastsState: Toast[] = []

function notifyListeners() {
    listeners.forEach(listener => listener([...toastsState]))
}

export const toast = {
    success: (message: string, actions?: ToastAction[]) => {
        const id = `toast-${++toastCounter}`
        toastsState = [...toastsState, { id, type: 'success', message, actions }]
        notifyListeners()
        return id
    },
    error: (message: string, actions?: ToastAction[]) => {
        const id = `toast-${++toastCounter}`
        toastsState = [...toastsState, { id, type: 'error', message, actions }]
        notifyListeners()
        return id
    },
    info: (message: string, actions?: ToastAction[]) => {
        const id = `toast-${++toastCounter}`
        toastsState = [...toastsState, { id, type: 'info', message, actions }]
        notifyListeners()
        return id
    },
    dismiss: (id: string) => {
        toastsState = toastsState.filter(t => t.id !== id)
        notifyListeners()
    },
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        listeners.add(setToasts)
        return () => { listeners.delete(setToasts) }
    }, [])

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map(t => (
                <ActionToast
                    key={t.id}
                    {...t}
                    onDismiss={toast.dismiss}
                />
            ))}
        </div>
    )
}

export default ActionToast
