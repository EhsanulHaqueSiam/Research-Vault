/**
 * Backup Service Tests
 * 
 * Unit tests for BackupService - basic functionality
 */

import { describe, it, expect } from 'vitest'

describe('BackupService', () => {
    describe('module loading', () => {
        it('should export BackupService', async () => {
            const module = await import('@/features/backup/services/backup.service')
            expect(module.BackupService).toBeDefined()
        })

        it('should have generateFilename method', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            expect(typeof BackupService.generateFilename).toBe('function')
        })

        it('should have createBackup method', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            expect(typeof BackupService.createBackup).toBe('function')
        })

        it('should have restoreBackup method', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            expect(typeof BackupService.restoreBackup).toBe('function')
        })

        it('should have verifyBackup method', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            expect(typeof BackupService.verifyBackup).toBe('function')
        })

        it('should have downloadBackup method', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            expect(typeof BackupService.downloadBackup).toBe('function')
        })
    })

    describe('generateFilename', () => {
        it('should generate a filename with date', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            const filename = BackupService.generateFilename('Test Project')

            expect(filename).toMatch(/^backup_Test_Project_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.zip$/)
        })

        it('should use workspace as default name', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            const filename = BackupService.generateFilename()

            expect(filename).toMatch(/^backup_workspace_/)
        })

        it('should sanitize special characters', async () => {
            const { BackupService } = await import('@/features/backup/services/backup.service')
            const filename = BackupService.generateFilename('Test/Project:Name')

            expect(filename).not.toContain('/')
            expect(filename).not.toContain(':')
        })
    })
})
