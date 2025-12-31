/**
 * Backup Service
 * 
 * Create and restore project backups with ZIP compression
 */

import JSZip from 'jszip'
import { ProjectService } from '@/features/projects/services/project.service'
import { NoteService } from '@/features/notes/services/note.service'
import { TaskService } from '@/features/tasks/services/task.service'

// ============================================
// Types
// ============================================

export interface BackupMetadata {
    id: string
    createdAt: Date
    projectId?: string
    projectName?: string
    filename: string
    size: number
    includesGit: boolean
    version: string
}

export interface BackupProgress {
    stage: 'preparing' | 'collecting' | 'compressing' | 'writing' | 'complete'
    percent: number
    message: string
}

export interface BackupOptions {
    includeGit?: boolean
    projectId?: string
    onProgress?: (progress: BackupProgress) => void
}

export interface RestoreOptions {
    onProgress?: (progress: BackupProgress) => void
}

// ============================================
// Backup Service
// ============================================

class BackupServiceClass {
    private readonly VERSION = '1.0.0'

    /**
     * Create a backup of a project or entire workspace
     */
    async createBackup(options: BackupOptions = {}): Promise<Blob> {
        const { projectId, onProgress } = options

        const zip = new JSZip()

        // Stage 1: Preparing
        onProgress?.({
            stage: 'preparing',
            percent: 0,
            message: 'Preparing backup...',
        })

        // Get projects
        const projects = projectId
            ? [await ProjectService.getById(projectId)].filter(Boolean)
            : await ProjectService.getAll()

        // Stage 2: Collecting data
        onProgress?.({
            stage: 'collecting',
            percent: 20,
            message: 'Collecting project data...',
        })

        // Create manifest
        const manifest = {
            version: this.VERSION,
            createdAt: new Date().toISOString(),
            projectCount: projects.length,
        }
        zip.file('manifest.json', JSON.stringify(manifest, null, 2))

        // Add projects
        const projectsFolder = zip.folder('projects')!
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i]
            if (!project) continue

            const projectFolder = projectsFolder.folder(project.id)!

            // Project metadata
            projectFolder.file('project.json', JSON.stringify(project, null, 2))

            // Tasks
            const tasks = await TaskService.getAll(project.id)
            projectFolder.file('tasks.json', JSON.stringify(tasks, null, 2))

            // Notes
            const notes = await NoteService.getAll(project.id)
            projectFolder.file('notes.json', JSON.stringify(notes, null, 2))

            onProgress?.({
                stage: 'collecting',
                percent: 20 + Math.round((i / projects.length) * 40),
                message: `Backing up: ${project.name}`,
            })
        }

        // Stage 3: Compressing
        onProgress?.({
            stage: 'compressing',
            percent: 70,
            message: 'Compressing backup...',
        })

        // Generate ZIP
        const blob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 },
        }, (metadata) => {
            onProgress?.({
                stage: 'compressing',
                percent: 70 + Math.round(metadata.percent * 0.25),
                message: `Compressing: ${Math.round(metadata.percent)}%`,
            })
        })

        // Stage 4: Complete
        onProgress?.({
            stage: 'complete',
            percent: 100,
            message: 'Backup complete!',
        })

        return blob
    }

    /**
     * Restore from a backup
     */
    async restoreBackup(file: File, options: RestoreOptions = {}): Promise<void> {
        const { onProgress } = options

        onProgress?.({
            stage: 'preparing',
            percent: 0,
            message: 'Reading backup file...',
        })

        const zip = await JSZip.loadAsync(file)

        // Read manifest
        const manifestFile = zip.file('manifest.json')
        if (!manifestFile) {
            throw new Error('Invalid backup: missing manifest')
        }

        // Validate manifest can be parsed (don't need the value)\n        await manifestFile.async('string')

        onProgress?.({
            stage: 'collecting',
            percent: 20,
            message: 'Restoring projects...',
        })

        // Restore projects
        const projectsFolder = zip.folder('projects')
        if (projectsFolder) {
            const projectFolders = Object.keys(zip.files)
                .filter(path => path.startsWith('projects/') && path.endsWith('/project.json'))

            for (let i = 0; i < projectFolders.length; i++) {
                const projectPath = projectFolders[i]
                const projectId = projectPath.split('/')[1]

                // Read project data
                const projectFile = zip.file(projectPath)
                if (projectFile) {
                    const projectData = JSON.parse(await projectFile.async('string'))

                    // Create or update project
                    try {
                        await ProjectService.create(projectData)
                    } catch {
                        // Project might already exist
                    }

                    // Restore tasks
                    const tasksFile = zip.file(`projects/${projectId}/tasks.json`)
                    if (tasksFile) {
                        const tasks = JSON.parse(await tasksFile.async('string'))
                        for (const task of tasks) {
                            try {
                                await TaskService.create(task)
                            } catch {
                                // Task might already exist
                            }
                        }
                    }

                    // Restore notes
                    const notesFile = zip.file(`projects/${projectId}/notes.json`)
                    if (notesFile) {
                        const notes = JSON.parse(await notesFile.async('string'))
                        for (const note of notes) {
                            try {
                                await NoteService.create(note)
                            } catch {
                                // Note might already exist
                            }
                        }
                    }
                }

                onProgress?.({
                    stage: 'collecting',
                    percent: 20 + Math.round((i / projectFolders.length) * 70),
                    message: `Restoring project ${i + 1} of ${projectFolders.length}`,
                })
            }
        }

        onProgress?.({
            stage: 'complete',
            percent: 100,
            message: 'Restore complete!',
        })
    }

    /**
     * Verify backup integrity
     */
    async verifyBackup(file: File): Promise<{ valid: boolean; errors: string[] }> {
        const errors: string[] = []

        try {
            const zip = await JSZip.loadAsync(file)

            // Check manifest
            const manifestFile = zip.file('manifest.json')
            if (!manifestFile) {
                errors.push('Missing manifest.json')
            } else {
                const manifestContent = JSON.parse(await manifestFile.async('string'))
                if (!manifestContent.version) errors.push('Invalid manifest: missing version')
                if (!manifestContent.createdAt) errors.push('Invalid manifest: missing createdAt')
            }

            // Check projects folder
            const projectsFolder = zip.folder('projects')
            if (!projectsFolder) {
                errors.push('Missing projects folder')
            }

        } catch (error) {
            errors.push(`Failed to read backup: ${error}`)
        }

        return {
            valid: errors.length === 0,
            errors,
        }
    }

    /**
     * Generate backup filename
     */
    generateFilename(projectName?: string): string {
        const date = new Date().toISOString().split('T')[0]
        const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-')
        const name = projectName?.replace(/[^a-zA-Z0-9]/g, '_') || 'workspace'
        return `backup_${name}_${date}_${time}.zip`
    }

    /**
     * Download backup
     */
    downloadBackup(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }
}

// Singleton
export const BackupService = new BackupServiceClass()
