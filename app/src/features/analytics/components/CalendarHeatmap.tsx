/**
 * Calendar Heatmap Component
 * 
 * Activity heatmap showing daily contribution levels
 */

import { useMemo } from 'react'
import { cn } from '@/shared/utils/cn'

// ============================================
// Types
// ============================================

export interface HeatmapData {
    date: string // YYYY-MM-DD
    count: number
}

export interface CalendarHeatmapProps {
    data: HeatmapData[]
    startDate?: Date
    endDate?: Date
    colorScale?: string[]
    onDayClick?: (date: string, count: number) => void
}

// ============================================
// Helpers
// ============================================

function getMonthLabel(date: Date): string {
    return date.toLocaleDateString('en', { month: 'short' })
}

function getWeekdayLabel(day: number): string {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
}

function getColorFromScale(count: number, max: number, scale: string[]): string {
    if (count === 0) return scale[0]
    const level = Math.min(Math.ceil((count / max) * (scale.length - 1)), scale.length - 1)
    return scale[level]
}

// ============================================
// Component
// ============================================

export function CalendarHeatmap({
    data,
    startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate = new Date(),
    colorScale = [
        '#ebedf0', // 0 - empty
        '#9be9a8', // 1-2
        '#40c463', // 3-5
        '#30a14e', // 6-9
        '#216e39', // 10+
    ],
    onDayClick,
}: CalendarHeatmapProps) {
    // Create a map for quick lookup
    const dataMap = useMemo(() => {
        const map = new Map<string, number>()
        data.forEach((d) => map.set(d.date, d.count))
        return map
    }, [data])

    // Calculate max for color scaling
    const maxCount = useMemo(() => {
        return Math.max(...data.map((d) => d.count), 1)
    }, [data])

    // Generate weeks
    const weeks = useMemo(() => {
        const result: { date: Date; dateStr: string }[][] = []
        let currentWeek: { date: Date; dateStr: string }[] = []

        const current = new Date(startDate)
        current.setHours(0, 0, 0, 0)

        // Pad start to beginning of week
        while (current.getDay() !== 0) {
            current.setDate(current.getDate() - 1)
        }

        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0]
            currentWeek.push({ date: new Date(current), dateStr })

            if (current.getDay() === 6) {
                result.push(currentWeek)
                currentWeek = []
            }

            current.setDate(current.getDate() + 1)
        }

        if (currentWeek.length > 0) {
            result.push(currentWeek)
        }

        return result
    }, [startDate, endDate])

    // Get month labels
    const monthLabels = useMemo(() => {
        const labels: { week: number; label: string }[] = []
        let lastMonth = -1

        weeks.forEach((week, weekIndex) => {
            const firstDay = week[0]?.date
            if (firstDay) {
                const month = firstDay.getMonth()
                if (month !== lastMonth) {
                    labels.push({ week: weekIndex, label: getMonthLabel(firstDay) })
                    lastMonth = month
                }
            }
        })

        return labels
    }, [weeks])

    return (
        <div className="inline-block">
            {/* Month labels */}
            <div className="flex mb-1 pl-8 text-xs text-slate-500">
                {monthLabels.map((m, i) => (
                    <span
                        key={i}
                        className="absolute"
                        style={{ marginLeft: `${m.week * 12}px` }}
                    >
                        {m.label}
                    </span>
                ))}
            </div>

            <div className="flex gap-1">
                {/* Weekday labels */}
                <div className="flex flex-col gap-0.5 text-xs text-slate-500 pr-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <div key={day} className="h-2.5 flex items-center">
                            {day % 2 === 1 && <span>{getWeekdayLabel(day).charAt(0)}</span>}
                        </div>
                    ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex gap-0.5">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-0.5">
                            {week.map(({ dateStr }) => {
                                const count = dataMap.get(dateStr) || 0
                                const color = getColorFromScale(count, maxCount, colorScale)

                                return (
                                    <div
                                        key={dateStr}
                                        className={cn(
                                            'w-2.5 h-2.5 rounded-sm cursor-pointer',
                                            'hover:ring-1 hover:ring-slate-400 dark:hover:ring-slate-500'
                                        )}
                                        style={{ backgroundColor: color }}
                                        title={`${dateStr}: ${count} activities`}
                                        onClick={() => onDayClick?.(dateStr, count)}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-2 text-xs text-slate-500">
                <span>Less</span>
                {colorScale.map((color, i) => (
                    <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: color }}
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    )
}

export default CalendarHeatmap
