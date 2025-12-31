/**
 * History Service
 * 
 * Parses Git history into tree structure for visual undo tree
 */

import git from 'isomorphic-git'
import * as fs from 'node:fs'
import type { HistoryNode, Snapshot } from './types'
import { GitOperationError } from './types'

// ============================================
// History Service Class
// ============================================

/**
 * HistoryService builds a tree structure from Git history
 * for visualization in the undo tree component
 */
export class HistoryService {
    private repoPath: string
    private cache: Map<string, HistoryNode[]> = new Map()
    private cacheExpiry: number = 30000 // 30 seconds

    constructor(repoPath: string) {
        this.repoPath = repoPath
    }

    // ============================================
    // Tree Structure
    // ============================================

    /**
     * Get the complete history as a tree structure
     * 
     * @param limit - Maximum number of commits to include
     * @returns Array of HistoryNode objects with parent/child relationships
     */
    async getTreeStructure(limit: number = 100): Promise<HistoryNode[]> {
        const cacheKey = `tree-${limit}`

        // Check cache
        const cached = this.cache.get(cacheKey)
        if (cached) {
            return cached
        }

        try {
            // Get commits
            const commits = await git.log({
                fs,
                dir: this.repoPath,
                depth: limit,
            })

            // Get current HEAD
            let currentHead: string | null = null
            try {
                currentHead = await git.resolveRef({
                    fs,
                    dir: this.repoPath,
                    ref: 'HEAD',
                })
            } catch {
                // No HEAD yet
            }

            // Build node map
            const nodeMap = new Map<string, HistoryNode>()

            for (const commit of commits) {
                const node: HistoryNode = {
                    id: commit.oid,
                    message: commit.commit.message.split('\n')[0], // First line only
                    timestamp: new Date(commit.commit.author.timestamp * 1000),
                    author: commit.commit.author.name,
                    changedFiles: [],
                    parentIds: commit.commit.parent,
                    children: [],
                    isBranchPoint: false,
                    isCurrent: commit.oid === currentHead,
                }
                nodeMap.set(commit.oid, node)
            }

            // Calculate children and branch points
            for (const node of nodeMap.values()) {
                for (const parentId of node.parentIds) {
                    const parent = nodeMap.get(parentId)
                    if (parent) {
                        parent.children.push(node.id)
                    }
                }
            }

            // Mark branch points (nodes with multiple children)
            for (const node of nodeMap.values()) {
                node.isBranchPoint = node.children.length > 1
            }

            // Convert to array, sorted by timestamp (newest first)
            const nodes = Array.from(nodeMap.values()).sort(
                (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
            )

            // Cache result
            this.cache.set(cacheKey, nodes)
            setTimeout(() => this.cache.delete(cacheKey), this.cacheExpiry)

            return nodes
        } catch (error) {
            // No commits yet
            if (String(error).includes('Could not find')) {
                return []
            }
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to retrieve history tree.',
                String(error)
            )
        }
    }

    // ============================================
    // Branch Detection
    // ============================================

    /**
     * Find all branch points in the history
     */
    async findBranchPoints(): Promise<HistoryNode[]> {
        const tree = await this.getTreeStructure()
        return tree.filter(node => node.isBranchPoint)
    }

    /**
     * Get all branches in the repository
     */
    async getBranches(): Promise<string[]> {
        try {
            const branches = await git.listBranches({
                fs,
                dir: this.repoPath,
            })
            return branches
        } catch {
            return []
        }
    }

    /**
     * Get the current branch name
     */
    async getCurrentBranch(): Promise<string> {
        try {
            const branch = await git.currentBranch({
                fs,
                dir: this.repoPath,
                fullname: false,
            })
            return branch || 'main'
        } catch {
            return 'main'
        }
    }

    // ============================================
    // Path Finding
    // ============================================

    /**
     * Find the path from one commit to another
     * Useful for showing what changes occurred between two points
     */
    async findPath(fromId: string, toId: string): Promise<HistoryNode[]> {
        const tree = await this.getTreeStructure()
        const nodeMap = new Map(tree.map(n => [n.id, n]))

        const fromNode = nodeMap.get(fromId)
        const toNode = nodeMap.get(toId)

        if (!fromNode || !toNode) {
            return []
        }

        // Simple BFS to find path
        const visited = new Set<string>()
        const queue: { node: HistoryNode; path: HistoryNode[] }[] = [
            { node: fromNode, path: [fromNode] }
        ]

        while (queue.length > 0) {
            const { node, path } = queue.shift()!

            if (node.id === toId) {
                return path
            }

            if (visited.has(node.id)) continue
            visited.add(node.id)

            // Explore children
            for (const childId of node.children) {
                const child = nodeMap.get(childId)
                if (child && !visited.has(childId)) {
                    queue.push({ node: child, path: [...path, child] })
                }
            }

            // Explore parents
            for (const parentId of node.parentIds) {
                const parent = nodeMap.get(parentId)
                if (parent && !visited.has(parentId)) {
                    queue.push({ node: parent, path: [...path, parent] })
                }
            }
        }

        return []
    }

    // ============================================
    // Statistics
    // ============================================

    /**
     * Get statistics about the history
     */
    async getStats(): Promise<{
        totalSnapshots: number
        branchPoints: number
        branches: number
        firstSnapshot: Date | null
        lastSnapshot: Date | null
    }> {
        const tree = await this.getTreeStructure()
        const branches = await this.getBranches()

        return {
            totalSnapshots: tree.length,
            branchPoints: tree.filter(n => n.isBranchPoint).length,
            branches: branches.length,
            firstSnapshot: tree.length > 0 ? tree[tree.length - 1].timestamp : null,
            lastSnapshot: tree.length > 0 ? tree[0].timestamp : null,
        }
    }

    // ============================================
    // Cache Management
    // ============================================

    /**
     * Clear the history cache
     * Should be called after new commits are made
     */
    clearCache(): void {
        this.cache.clear()
    }

    /**
     * Set cache expiry time
     */
    setCacheExpiry(ms: number): void {
        this.cacheExpiry = ms
    }

    /**
     * Convert node to simpler Snapshot format
     */
    nodeToSnapshot(node: HistoryNode): Snapshot {
        return {
            id: node.id,
            message: node.message,
            timestamp: node.timestamp,
            author: node.author,
            changedFiles: node.changedFiles,
        }
    }
}

// ============================================
// Factory Function
// ============================================

/**
 * Create a new HistoryService instance
 */
export function createHistoryService(repoPath: string): HistoryService {
    return new HistoryService(repoPath)
}
