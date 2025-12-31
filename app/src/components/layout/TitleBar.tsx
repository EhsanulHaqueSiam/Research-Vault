/**
 * TitleBar Component
 * 
 * Custom window title bar for Tauri app
 */

import { Minus, Square, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface TitleBarProps {
    title?: string
}

export function TitleBar({ title = 'Research Manager' }: TitleBarProps) {
    // Window controls for Tauri
    const handleMinimize = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window')
            await getCurrentWindow().minimize()
        } catch {
            console.log('Not running in Tauri')
        }
    }

    const handleMaximize = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window')
            const window = getCurrentWindow()
            if (await window.isMaximized()) {
                await window.unmaximize()
            } else {
                await window.maximize()
            }
        } catch {
            console.log('Not running in Tauri')
        }
    }

    const handleClose = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window')
            await getCurrentWindow().close()
        } catch {
            console.log('Not running in Tauri')
        }
    }

    return (
        <div
            data-tauri-drag-region
            className="flex items-center justify-between h-8 px-2 bg-card border-b select-none"
        >
            {/* Title */}
            <div
                data-tauri-drag-region
                className="flex-1 text-sm font-medium text-center"
            >
                {title}
            </div>

            {/* Window Controls */}
            <div className="flex items-center -mr-2">
                <button
                    onClick={handleMinimize}
                    className={cn(
                        'w-10 h-8 flex items-center justify-center',
                        'hover:bg-muted transition-colors'
                    )}
                    title="Minimize"
                >
                    <Minus className="h-4 w-4" />
                </button>
                <button
                    onClick={handleMaximize}
                    className={cn(
                        'w-10 h-8 flex items-center justify-center',
                        'hover:bg-muted transition-colors'
                    )}
                    title="Maximize"
                >
                    <Square className="h-3 w-3" />
                </button>
                <button
                    onClick={handleClose}
                    className={cn(
                        'w-10 h-8 flex items-center justify-center',
                        'hover:bg-red-500 hover:text-white transition-colors'
                    )}
                    title="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default TitleBar
