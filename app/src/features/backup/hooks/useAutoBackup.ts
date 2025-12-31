/**
 * useAutoBackup Hook
 * 
 * Automatic backup on specified intervals or before updates
 */

import { useEffect, useCallback, useRef } from 'react'
import { BackupService, type BackupProgress } from '../services'

// ============================================
// Types
// ============================================

export interface UseAutoBackupOptions {
    enabled?: boolean
    intervalMs?: number
    projectId?: string
    onProgress?: (progress: BackupProgress) => void
    onComplete?: (blob: Blob) => void
    onError?: (error: Error) => void
}

// ============================================
// Hook
// ============================================

export function useAutoBackup(options: UseAutoBackupOptions = {}) {
    const {
        enabled = false,
        intervalMs = 24 * 60 * 60 * 1000, // 24 hours default
        projectId,
        onProgress,
        onComplete,
        onError,
    } = options

    const lastBackupRef = useRef<Date | null>(null)

    const createBackup = useCallback(async () => {
        try {
            const blob = await BackupService.createBackup({
                projectId,
                includeGit: true,
                onProgress,
            })

            lastBackupRef.current = new Date()
            onComplete?.(blob)

            return blob
        } catch (error) {
            onError?.(error as Error)
            throw error
        }
    }, [projectId, onProgress, onComplete, onError])

    // Auto backup interval
    useEffect(() => {
        if (!enabled) return

        const timer = setInterval(() => {
            createBackup()
        }, intervalMs)

        return () => clearInterval(timer)
    }, [enabled, intervalMs, createBackup])

    return {
        createBackup,
        lastBackup: lastBackupRef.current,
    }
}

/**
 * useBackupBeforeUpdate Hook
 * 
 * Create backup before critical updates
 */
export function useBackupBeforeUpdate() {
    const createBackupBeforeAction = useCallback(async <T>(
        action: () => Promise<T>,
        projectId?: string
    ): Promise<T> => {
        // Create backup first
        await BackupService.createBackup({ projectId })

        // Then execute action
        return action()
    }, [])

    return { createBackupBeforeAction }
}
