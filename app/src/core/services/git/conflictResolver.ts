/**
 * Conflict Resolver
 *
 * Utilities for detecting and resolving merge conflicts
 */

// Types are kept in this file, no external imports needed

// ============================================
// Conflict Types
// ============================================

/**
 * A merge conflict in a file
 */
export interface MergeConflict {
    /** File path */
    path: string
    /** Our version (current branch) */
    ours: string
    /** Their version (incoming branch) */
    theirs: string
    /** Common ancestor version */
    base: string
    /** Conflict markers in file */
    markers: ConflictMarker[]
}

/**
 * A conflict marker section
 */
export interface ConflictMarker {
    /** Start line in file */
    startLine: number
    /** End line in file */
    endLine: number
    /** Our content */
    oursContent: string
    /** Their content */
    theirsContent: string
}

/**
 * Resolution choice
 */
export type ResolutionChoice = 'ours' | 'theirs' | 'both' | 'custom'

// ============================================
// Conflict Resolver Class
// ============================================

/**
 * ConflictResolver helps detect and resolve merge conflicts
 */
export class ConflictResolver {
    // ============================================
    // Detection
    // ============================================

    /**
     * Check if content has conflict markers
     */
    hasConflictMarkers(content: string): boolean {
        return content.includes('<<<<<<<') &&
            content.includes('=======') &&
            content.includes('>>>>>>>')
    }

    /**
     * Parse conflict markers from content
     */
    parseConflicts(content: string, path: string): MergeConflict {
        const lines = content.split('\n')
        const markers: ConflictMarker[] = []

        let i = 0
        while (i < lines.length) {
            if (lines[i].startsWith('<<<<<<<')) {
                const startLine = i + 1
                const oursLines: string[] = []
                const theirsLines: string[] = []
                let inOurs = true

                i++
                while (i < lines.length && !lines[i].startsWith('>>>>>>>')) {
                    if (lines[i].startsWith('=======')) {
                        inOurs = false
                    } else if (inOurs) {
                        oursLines.push(lines[i])
                    } else {
                        theirsLines.push(lines[i])
                    }
                    i++
                }

                markers.push({
                    startLine,
                    endLine: i + 1,
                    oursContent: oursLines.join('\n'),
                    theirsContent: theirsLines.join('\n'),
                })
            }
            i++
        }

        return {
            path,
            ours: '',
            theirs: '',
            base: '',
            markers,
        }
    }

    // ============================================
    // Resolution
    // ============================================

    /**
     * Resolve a conflict marker with a choice
     */
    resolveMarker(
        content: string,
        markerIndex: number,
        choice: ResolutionChoice,
        customContent?: string
    ): string {
        const conflict = this.parseConflicts(content, '')
        const marker = conflict.markers[markerIndex]

        if (!marker) {
            throw new Error(`Conflict marker ${markerIndex} not found`)
        }

        let resolution: string
        switch (choice) {
            case 'ours':
                resolution = marker.oursContent
                break
            case 'theirs':
                resolution = marker.theirsContent
                break
            case 'both':
                resolution = `${marker.oursContent}\n${marker.theirsContent}`
                break
            case 'custom':
                resolution = customContent || ''
                break
        }

        // Replace the conflict section with resolution
        const lines = content.split('\n')
        const before = lines.slice(0, marker.startLine - 1)
        const after = lines.slice(marker.endLine)

        return [...before, resolution, ...after].join('\n')
    }

    /**
     * Resolve all conflicts with a single choice
     */
    resolveAll(content: string, choice: 'ours' | 'theirs'): string {
        const conflict = this.parseConflicts(content, '')
        let result = content

        // Process in reverse order to maintain line numbers
        for (let i = conflict.markers.length - 1; i >= 0; i--) {
            result = this.resolveMarker(result, 0, choice) // Always use 0 since we're modifying
        }

        return result
    }

    // ============================================
    // Three-Way Merge
    // ============================================

    /**
     * Perform a simple three-way merge
     * Returns null if automatic merge is not possible
     */
    threeWayMerge(
        base: string,
        ours: string,
        theirs: string
    ): string | null {
        const baseLines = base.split('\n')
        const oursLines = ours.split('\n')
        const theirsLines = theirs.split('\n')

        const result: string[] = []
        let hasConflicts = false

        // Simple line-by-line comparison
        const maxLen = Math.max(baseLines.length, oursLines.length, theirsLines.length)

        for (let i = 0; i < maxLen; i++) {
            const baseLine = baseLines[i] ?? ''
            const ourLine = oursLines[i] ?? ''
            const theirLine = theirsLines[i] ?? ''

            if (ourLine === theirLine) {
                // Both agree
                result.push(ourLine)
            } else if (ourLine === baseLine) {
                // We didn't change, use theirs
                result.push(theirLine)
            } else if (theirLine === baseLine) {
                // They didn't change, use ours
                result.push(ourLine)
            } else {
                // Both changed differently - conflict
                hasConflicts = true
                result.push(`<<<<<<< ours`)
                result.push(ourLine)
                result.push(`=======`)
                result.push(theirLine)
                result.push(`>>>>>>> theirs`)
            }
        }

        if (hasConflicts) {
            return null // Indicate manual resolution needed
        }

        return result.join('\n')
    }
}

// ============================================
// Factory Function
// ============================================

/**
 * Create a new ConflictResolver instance
 */
export function createConflictResolver(): ConflictResolver {
    return new ConflictResolver()
}

// Export singleton instance
export const conflictResolver = new ConflictResolver()
