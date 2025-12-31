/**
 * Note Service Utils Tests
 * 
 * Tests for utility functions and logic in the note service
 */

import { describe, it, expect } from 'vitest'
import { builtInNoteTemplates } from '../types/note.types'

describe('Note Templates', () => {
    describe('builtInNoteTemplates', () => {
        it('should return available templates', () => {
            expect(builtInNoteTemplates).toBeDefined()
            expect(Array.isArray(builtInNoteTemplates)).toBe(true)
            expect(builtInNoteTemplates.length).toBeGreaterThan(0)
        })

        it('should include blank template', () => {
            const blank = builtInNoteTemplates.find(t => t.id === 'blank')

            expect(blank).toBeDefined()
            expect(blank?.name).toBe('Blank Note')
        })

        it('should include meeting template', () => {
            const meeting = builtInNoteTemplates.find(t => t.id === 'meeting')

            expect(meeting).toBeDefined()
            expect(meeting?.name).toBe('Meeting Notes')
            expect(meeting?.tags).toContain('meeting')
        })

        it('should include literature review template', () => {
            const litReview = builtInNoteTemplates.find(t => t.id === 'literature-review')

            expect(litReview).toBeDefined()
            expect(litReview?.name).toBe('Literature Review')
            expect(litReview?.tags).toContain('literature')
        })

        it('should have valid JSON content in templates', () => {
            builtInNoteTemplates.forEach(template => {
                expect(() => JSON.parse(template.content)).not.toThrow()
            })
        })
    })
})

describe('Note Statistics Logic', () => {
    it('should calculate correct statistics', () => {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        const twoWeeksAgo = new Date()
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

        const mockNotes = [
            { id: '1', isPinned: true, updatedAt: twoDaysAgo },
            { id: '2', isPinned: true, updatedAt: twoWeeksAgo },
            { id: '3', isPinned: false, updatedAt: twoDaysAgo },
            { id: '4', isPinned: false, updatedAt: twoWeeksAgo },
        ]

        const total = mockNotes.length
        const pinned = mockNotes.filter(n => n.isPinned).length
        const recentlyModified = mockNotes.filter(n =>
            new Date(n.updatedAt) > oneWeekAgo
        ).length

        expect(total).toBe(4)
        expect(pinned).toBe(2)
        expect(recentlyModified).toBe(2)
    })
})

describe('Tag Management Logic', () => {
    it('should add tag correctly', () => {
        const currentTags = ['tag1', 'tag2']
        const newTag = 'tag3'

        if (!currentTags.includes(newTag)) {
            currentTags.push(newTag)
        }

        expect(currentTags).toContain('tag3')
        expect(currentTags.length).toBe(3)
    })

    it('should not duplicate existing tag', () => {
        const currentTags = ['tag1', 'tag2']
        const newTag = 'tag1'

        if (!currentTags.includes(newTag)) {
            currentTags.push(newTag)
        }

        expect(currentTags.length).toBe(2)
    })

    it('should remove tag correctly', () => {
        const currentTags = ['tag1', 'tag2', 'tag3']
        const tagToRemove = 'tag2'

        const newTags = currentTags.filter(t => t !== tagToRemove)

        expect(newTags).not.toContain('tag2')
        expect(newTags.length).toBe(2)
    })

    it('should get unique tags from notes', () => {
        const notes = [
            { tags: ['tag1', 'tag2'] },
            { tags: ['tag2', 'tag3'] },
            { tags: ['tag1', 'tag3', 'tag4'] },
        ]

        const tagSet = new Set<string>()
        notes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(tag => tagSet.add(tag))
            }
        })

        const uniqueTags = Array.from(tagSet).sort()

        expect(uniqueTags).toEqual(['tag1', 'tag2', 'tag3', 'tag4'])
    })
})

describe('Note Search Logic', () => {
    it('should find notes by title', () => {
        const notes = [
            { title: 'Meeting Notes', content: 'Discussion about project' },
            { title: 'Research Ideas', content: 'New hypothesis' },
            { title: 'Weekly Report', content: 'Progress update' },
        ]

        const query = 'meeting'
        const results = notes.filter(n =>
            n.title.toLowerCase().includes(query.toLowerCase())
        )

        expect(results.length).toBe(1)
        expect(results[0].title).toBe('Meeting Notes')
    })

    it('should find notes by content', () => {
        const notes = [
            { title: 'Meeting Notes', content: 'Discussion about project' },
            { title: 'Research Ideas', content: 'New hypothesis' },
            { title: 'Weekly Report', content: 'Progress on project update' },
        ]

        const query = 'project'
        const results = notes.filter(n =>
            n.title.toLowerCase().includes(query.toLowerCase()) ||
            n.content.toLowerCase().includes(query.toLowerCase())
        )

        expect(results.length).toBe(2)
    })
})

describe('Note Pinning Logic', () => {
    it('should toggle pin status', () => {
        const note = { id: '1', isPinned: false }

        // Toggle to pinned
        note.isPinned = !note.isPinned
        expect(note.isPinned).toBe(true)

        // Toggle back to unpinned
        note.isPinned = !note.isPinned
        expect(note.isPinned).toBe(false)
    })

    it('should sort pinned notes first', () => {
        const notes = [
            { id: '1', title: 'A', isPinned: false, updatedAt: new Date() },
            { id: '2', title: 'B', isPinned: true, updatedAt: new Date() },
            { id: '3', title: 'C', isPinned: false, updatedAt: new Date() },
            { id: '4', title: 'D', isPinned: true, updatedAt: new Date() },
        ]

        const sorted = notes.sort((a, b) => {
            if (a.isPinned === b.isPinned) return 0
            return a.isPinned ? -1 : 1
        })

        expect(sorted[0].isPinned).toBe(true)
        expect(sorted[1].isPinned).toBe(true)
        expect(sorted[2].isPinned).toBe(false)
        expect(sorted[3].isPinned).toBe(false)
    })
})

describe('Note Duplication Logic', () => {
    it('should create copy with new title', () => {
        const original = {
            id: '1',
            title: 'Original Note',
            content: 'Some content',
            tags: ['tag1', 'tag2'],
        }

        const duplicate = {
            ...original,
            id: 'new-id',
            title: `${original.title} (Copy)`,
            isPinned: false,
        }

        expect(duplicate.title).toBe('Original Note (Copy)')
        expect(duplicate.content).toBe(original.content)
        expect(duplicate.tags).toEqual(original.tags)
        expect(duplicate.isPinned).toBe(false)
    })

    it('should use custom title if provided', () => {
        const original = { title: 'Original Note' }
        const customTitle = 'My Custom Copy'

        const duplicateTitle = customTitle || `${original.title} (Copy)`

        expect(duplicateTitle).toBe('My Custom Copy')
    })
})
