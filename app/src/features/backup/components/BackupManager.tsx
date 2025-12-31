/**
 * Backup Manager Component
 * 
 * UI for creating, restoring, and managing backups
 */

import { useState, useCallback } from 'react'
import {
    Download,
    Upload,
    Archive,
    Check,
    AlertCircle,
    Loader2,
    HardDrive,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { BackupService, type BackupProgress } from '../services'

// ============================================
// Types
// ============================================

export interface BackupManagerProps {
    projectId?: string
    projectName?: string
}

// ============================================
// Component
// ============================================

export function BackupManager({ projectId, projectName }: BackupManagerProps) {
    const [isCreating, setIsCreating] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)
    const [progress, setProgress] = useState<BackupProgress | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleCreateBackup = useCallback(async () => {
        setIsCreating(true)
        setError(null)
        setSuccess(null)

        try {
            const blob = await BackupService.createBackup({
                projectId,
                includeGit: true,
                onProgress: setProgress,
            })

            const filename = BackupService.generateFilename(projectName)
            BackupService.downloadBackup(blob, filename)

            setSuccess(`Backup created: ${filename}`)
        } catch (err) {
            setError(`Backup failed: ${err}`)
        } finally {
            setIsCreating(false)
            setProgress(null)
        }
    }, [projectId, projectName])

    const handleRestoreBackup = useCallback(async (file: File) => {
        setIsRestoring(true)
        setError(null)
        setSuccess(null)

        try {
            // Verify first
            const verification = await BackupService.verifyBackup(file)
            if (!verification.valid) {
                throw new Error(verification.errors.join(', '))
            }

            await BackupService.restoreBackup(file, {
                onProgress: setProgress,
            })

            setSuccess('Restore complete!')
        } catch (err) {
            setError(`Restore failed: ${err}`)
        } finally {
            setIsRestoring(false)
            setProgress(null)
        }
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleRestoreBackup(file)
        }
    }, [handleRestoreBackup])

    const isLoading = isCreating || isRestoring

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Archive size={20} className="text-blue-500" />
                    Backup Manager
                </h2>
                <p className="text-sm text-slate-500">
                    {projectName ? `Backup "${projectName}"` : 'Backup entire workspace'}
                </p>
            </div>

            {/* Progress */}
            {progress && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Loader2 size={16} className="animate-spin text-blue-500" />
                        <span className="text-sm font-medium">{progress.message}</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${progress.percent}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Status Messages */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                    <Check size={16} />
                    <span className="text-sm">{success}</span>
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Create Backup */}
                <button
                    onClick={handleCreateBackup}
                    disabled={isLoading}
                    className={cn(
                        'flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed transition-colors',
                        isLoading
                            ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-not-allowed'
                            : 'border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    )}
                >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Download size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Create Backup</p>
                        <p className="text-xs text-slate-500">Download a ZIP of your data</p>
                    </div>
                </button>

                {/* Restore Backup */}
                <label
                    className={cn(
                        'flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed transition-colors cursor-pointer',
                        isLoading
                            ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-not-allowed'
                            : 'border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                    )}
                >
                    <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileSelect}
                        disabled={isLoading}
                        className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Upload size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Restore Backup</p>
                        <p className="text-xs text-slate-500">Import from a ZIP file</p>
                    </div>
                </label>
            </div>

            {/* Info */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                    <HardDrive size={16} className="text-slate-500" />
                    Backup includes:
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• All projects and metadata</li>
                    <li>• Tasks and their status</li>
                    <li>• Notes and content</li>
                    <li>• Tags and categories</li>
                </ul>
            </div>
        </div>
    )
}

export default BackupManager
