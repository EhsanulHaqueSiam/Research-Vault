/**
 * StatusBar Component
 * 
 * Bottom status bar showing app status information
 */

import { Clock, HardDrive, Wifi, WifiOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export function StatusBar() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    // Update time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    // Track online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <div className="flex items-center justify-between px-4 py-1.5 border-t bg-muted/30 text-xs text-muted-foreground">
            {/* Left section */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <HardDrive className="h-3 w-3" />
                    <span>Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {isOnline ? (
                        <>
                            <Wifi className="h-3 w-3 text-green-500" />
                            <span>Online</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="h-3 w-3 text-red-500" />
                            <span>Offline</span>
                        </>
                    )}
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{format(currentTime, 'HH:mm')}</span>
                </div>
            </div>
        </div>
    )
}

export default StatusBar
