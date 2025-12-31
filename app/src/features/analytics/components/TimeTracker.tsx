/**
 * Time Tracker Component
 * 
 * Track time spent on projects and tasks
 */

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, Square, Clock } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// ============================================
// Types
// ============================================

export interface TimeEntry {
    id: string
    projectId: string
    taskId?: string
    description: string
    startTime: Date
    endTime?: Date
    duration: number // in seconds
}

export interface TimeTrackerProps {
    projectId?: string
    taskId?: string
    onTimeLogged?: (entry: TimeEntry) => void
}

// ============================================
// Format time
// ============================================

function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// ============================================
// Component
// ============================================

export function TimeTracker({ projectId, taskId, onTimeLogged }: TimeTrackerProps) {
    const [isRunning, setIsRunning] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [description, setDescription] = useState('')

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning) {
            interval = setInterval(() => {
                setElapsed((prev) => prev + 1)
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning])

    const handleStart = useCallback(() => {
        setIsRunning(true)
        setStartTime(new Date())
    }, [])

    const handlePause = useCallback(() => {
        setIsRunning(false)
    }, [])

    const handleStop = useCallback(() => {
        if (startTime && elapsed > 0) {
            const entry: TimeEntry = {
                id: crypto.randomUUID(),
                projectId: projectId || '',
                taskId,
                description: description || 'Time tracked',
                startTime,
                endTime: new Date(),
                duration: elapsed,
            }
            onTimeLogged?.(entry)
        }

        setIsRunning(false)
        setElapsed(0)
        setStartTime(null)
        setDescription('')
    }, [startTime, elapsed, projectId, taskId, description, onTimeLogged])

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            {/* Timer Display */}
            <div className="flex items-center justify-center mb-4">
                <div className={cn(
                    'text-4xl font-mono font-bold tabular-nums',
                    isRunning ? 'text-green-500' : 'text-slate-700 dark:text-slate-300'
                )}>
                    {formatDuration(elapsed)}
                </div>
            </div>

            {/* Description Input */}
            <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                className="w-full px-3 py-2 mb-4 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
                {!isRunning ? (
                    <button
                        onClick={handleStart}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <Play size={18} />
                        {elapsed > 0 ? 'Resume' : 'Start'}
                    </button>
                ) : (
                    <button
                        onClick={handlePause}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        <Pause size={18} />
                        Pause
                    </button>
                )}

                {elapsed > 0 && (
                    <button
                        onClick={handleStop}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <Square size={18} />
                        Stop & Save
                    </button>
                )}
            </div>

            {/* Stats */}
            {startTime && (
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Started: {startTime.toLocaleTimeString()}
                    </span>
                </div>
            )}
        </div>
    )
}

export default TimeTracker
