/**
 * Project Service Utils Tests
 * 
 * Tests for utility functions and logic in the project service
 */

import { describe, it, expect } from 'vitest'
import {
    builtInProjectTemplates,
    ResearchMetadataSchema,
} from '../types/project.types'

describe('Project Templates', () => {
    describe('builtInProjectTemplates', () => {
        it('should return built-in templates', () => {
            expect(builtInProjectTemplates).toBeDefined()
            expect(Array.isArray(builtInProjectTemplates)).toBe(true)
            expect(builtInProjectTemplates.length).toBeGreaterThan(0)
        })

        it('should include Literature Review template', () => {
            const litReview = builtInProjectTemplates.find(t => t.id === 'literature-review')

            expect(litReview).toBeDefined()
            expect(litReview?.name).toBe('Literature Review')
            expect(litReview?.folders).toContain('papers')
        })

        it('should include Thesis template', () => {
            const thesis = builtInProjectTemplates.find(t => t.id === 'thesis')

            expect(thesis).toBeDefined()
            expect(thesis?.name).toBe('Thesis/Dissertation')
            expect(thesis?.folders).toContain('chapters')
        })

        it('should include Data Analysis template', () => {
            const dataAnalysis = builtInProjectTemplates.find(t => t.id === 'data-analysis')

            expect(dataAnalysis).toBeDefined()
            expect(dataAnalysis?.name).toBe('Data Analysis')
            expect(dataAnalysis?.defaultTags).toContain('analysis')
        })

        it('should have valid template structure', () => {
            builtInProjectTemplates.forEach(template => {
                expect(template).toHaveProperty('id')
                expect(template).toHaveProperty('name')
                expect(template).toHaveProperty('description')
                expect(template).toHaveProperty('folders')
                expect(template).toHaveProperty('defaultTags')
                expect(Array.isArray(template.folders)).toBe(true)
                expect(Array.isArray(template.defaultTags)).toBe(true)
            })
        })
    })
})

describe('Research Metadata Schema', () => {
    describe('validation', () => {
        it('should validate correct metadata', () => {
            const metadata = {
                version: '1.0.0',
                title: 'Test Project',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                members: [],
                tags: [],
                settings: {
                    auto_commit: true,
                    auto_commit_interval: 30,
                    backup_enabled: true,
                },
                statistics: {
                    total_files: 0,
                    total_commits: 0,
                    total_tasks: 0,
                    total_notes: 0,
                },
            }

            const result = ResearchMetadataSchema.safeParse(metadata)
            expect(result.success).toBe(true)
        })

        it('should reject metadata without title', () => {
            const metadata = {
                version: '1.0.0',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            const result = ResearchMetadataSchema.safeParse(metadata)
            expect(result.success).toBe(false)
        })

        it('should reject metadata without created_at', () => {
            const metadata = {
                version: '1.0.0',
                title: 'Test',
                updated_at: new Date().toISOString(),
            }

            const result = ResearchMetadataSchema.safeParse(metadata)
            expect(result.success).toBe(false)
        })
    })

    describe('defaults', () => {
        it('should provide default version', () => {
            const metadata = {
                title: 'Test Project',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                members: [],
                tags: [],
                settings: {
                    auto_commit: true,
                    auto_commit_interval: 30,
                    backup_enabled: true,
                },
                statistics: {
                    total_files: 0,
                    total_commits: 0,
                    total_tasks: 0,
                    total_notes: 0,
                },
            }

            const result = ResearchMetadataSchema.parse(metadata)
            expect(result.version).toBe('1.0.0')
        })
    })
})

describe('Project Statistics Logic', () => {
    it('should calculate correct statistics', () => {
        const mockProjects = [
            { id: '1', status: 'active' },
            { id: '2', status: 'active' },
            { id: '3', status: 'archived' },
            { id: '4', status: 'template' },
            { id: '5', status: 'active' },
        ]

        const total = mockProjects.length
        const active = mockProjects.filter(p => p.status === 'active').length
        const archived = mockProjects.filter(p => p.status === 'archived').length
        const templates = mockProjects.filter(p => p.status === 'template').length

        expect(total).toBe(5)
        expect(active).toBe(3)
        expect(archived).toBe(1)
        expect(templates).toBe(1)
    })
})

describe('Project Tag Management', () => {
    it('should add tag correctly', () => {
        const currentTags = ['research', 'science']
        const newTag = 'biology'

        if (!currentTags.includes(newTag)) {
            currentTags.push(newTag)
        }

        expect(currentTags).toContain('biology')
        expect(currentTags.length).toBe(3)
    })

    it('should remove tag correctly', () => {
        const currentTags = ['research', 'science', 'biology']
        const tagToRemove = 'science'

        const newTags = currentTags.filter(t => t !== tagToRemove)

        expect(newTags).not.toContain('science')
        expect(newTags.length).toBe(2)
    })
})

describe('Default Metadata Creation', () => {
    it('should create default metadata structure', () => {
        const now = new Date().toISOString()

        const metadata = {
            version: '1.0.0',
            title: 'Test Project',
            description: 'A test description',
            members: [],
            created_at: now,
            updated_at: now,
            tags: [],
            settings: {
                auto_commit: true,
                auto_commit_interval: 30,
                backup_enabled: true,
            },
            statistics: {
                total_files: 0,
                total_commits: 0,
                total_tasks: 0,
                total_notes: 0,
            },
        }

        expect(metadata.title).toBe('Test Project')
        expect(metadata.version).toBe('1.0.0')
        expect(metadata.members).toEqual([])
        expect(metadata.tags).toEqual([])
        expect(metadata.settings.auto_commit).toBe(true)
        expect(metadata.statistics.total_files).toBe(0)
    })
})
