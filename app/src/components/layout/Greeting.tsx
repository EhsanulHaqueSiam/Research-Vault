/**
 * Personalized Greeting Component
 * 
 * Time-based greeting with user personalization
 */

import { useMemo } from 'react'
import { Sun, Sunrise, Moon, Coffee } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface GreetingProps {
    userName?: string
    subtitle?: string
    className?: string
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
}

const greetings = {
    morning: { text: 'Good morning', icon: Sunrise, emoji: '☀️' },
    afternoon: { text: 'Good afternoon', icon: Sun, emoji: '🌤️' },
    evening: { text: 'Good evening', icon: Coffee, emoji: '🌆' },
    night: { text: 'Good night', icon: Moon, emoji: '🌙' },
}

export function Greeting({ userName, subtitle, className }: GreetingProps) {
    const timeOfDay = useMemo(() => getTimeOfDay(), [])
    const greeting = greetings[timeOfDay]

    return (
        <div className={cn('space-y-1', className)}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
                {greeting.text}{userName ? `, ${userName}` : ''}
                <span className="text-xl" role="img" aria-label={timeOfDay}>
                    {greeting.emoji}
                </span>
            </h1>
            <p className="text-muted-foreground">
                {subtitle || "Here's an overview of your research progress"}
            </p>
        </div>
    )
}

export default Greeting
