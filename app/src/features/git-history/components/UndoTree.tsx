/**
 * Undo Tree Component
 * 
 * Visual representation of project version history using React Flow
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { format } from 'date-fns'

import { useGitTree, useRestoreSnapshot, useSaveSnapshot } from '../hooks/useGit'
import type { HistoryNode } from '@/core/services/git'
import { SnapshotNode } from './SnapshotNode'
import { TreeControls } from './TreeControls'
import { PreviewPanel } from './PreviewPanel'
import type { UndoTreeProps, SnapshotNodeData } from './types'

// Register custom node types
const nodeTypes: NodeTypes = {
    snapshot: SnapshotNode as any,
}

/**
 * Inner component with React Flow hooks
 */
function UndoTreeInner({
    projectPath,
    selectedId: externalSelectedId,
    onSelect: externalOnSelect,
    onRestore: externalOnRestore,
    className,
}: UndoTreeProps) {
    // State
    const [selectedId, setSelectedId] = useState<string | null>(externalSelectedId || null)
    const [searchQuery, setSearchQuery] = useState('')
    const [previewNode, setPreviewNode] = useState<HistoryNode | null>(null)

    // React Flow state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<SnapshotNodeData>>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

    // Queries and mutations
    const { data: historyNodes = [], isLoading } = useGitTree(projectPath)
    const restoreMutation = useRestoreSnapshot(projectPath)
    const saveMutation = useSaveSnapshot(projectPath)

    // Use refs to store latest values for callbacks to avoid stale closures
    const historyNodesRef = useRef(historyNodes)
    historyNodesRef.current = historyNodes

    const externalOnSelectRef = useRef(externalOnSelect)
    externalOnSelectRef.current = externalOnSelect

    const externalOnRestoreRef = useRef(externalOnRestore)
    externalOnRestoreRef.current = externalOnRestore

    // Callbacks - stable references using refs
    const handleSelect = useCallback((id: string) => {
        setSelectedId(id)
        externalOnSelectRef.current?.(id)
    }, [])

    const handleRestore = useCallback(async (id: string) => {
        await restoreMutation.mutateAsync({ snapshotId: id })
        externalOnRestoreRef.current?.(id)
        setPreviewNode(null)
    }, [restoreMutation])

    const handlePreview = useCallback((id: string) => {
        const node = historyNodesRef.current.find(n => n.id === id)
        setPreviewNode(node || null)
    }, [])

    const handleCreateCheckpoint = useCallback(async () => {
        await saveMutation.mutateAsync({ message: `Checkpoint: ${format(new Date(), 'h:mm a')}` })
    }, [saveMutation])

    // Filter nodes by search
    const filteredNodes = useMemo(() => {
        if (!searchQuery) return historyNodes
        const query = searchQuery.toLowerCase()
        return historyNodes.filter(
            node =>
                node.message.toLowerCase().includes(query) ||
                node.id.toLowerCase().includes(query)
        )
    }, [historyNodes, searchQuery])

    // Memoize initial positions so they don't reset on selection change
    const nodePositions = useMemo(() => {
        const positions = new Map<string, { x: number; y: number }>()

        if (!filteredNodes.length) return positions

        // Sort by timestamp (newest first)
        const sortedNodes = [...filteredNodes].sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        )

        const nodeHeight = 120  // Increased spacing
        const branchOffset = 300

        // First pass: assign columns based on children relationships
        const columnMap = new Map<string, number>()
        for (let i = 0; i < sortedNodes.length; i++) {
            const node = sortedNodes[i]
            let column = 0

            // Check if any child is in a different column
            for (const childId of node.children) {
                const childColumn = columnMap.get(childId)
                if (childColumn !== undefined) {
                    column = Math.max(column, childColumn)
                }
            }

            // If this is a branch point, next branch goes to a new column
            if (node.isBranchPoint) {
                column = column + 1
            }

            columnMap.set(node.id, column)
        }

        // Second pass: assign positions with proper Y spacing
        for (let i = 0; i < sortedNodes.length; i++) {
            const node = sortedNodes[i]
            const column = columnMap.get(node.id) || 0

            positions.set(node.id, {
                x: 50 + (column * branchOffset),
                y: 50 + (i * nodeHeight),  // Clear vertical spacing
            })
        }

        return positions
    }, [filteredNodes])

    // Build flow elements - only recalculate when data changes (not selection)
    const flowElements = useMemo(() => {
        if (!filteredNodes.length) {
            return { nodes: [] as Node<SnapshotNodeData>[], edges: [] as Edge[] }
        }

        const flowNodes: Node<SnapshotNodeData>[] = filteredNodes.map(historyNode => {
            const pos = nodePositions.get(historyNode.id) || { x: 0, y: 0 }

            return {
                id: historyNode.id,
                type: 'snapshot',
                position: pos,
                data: {
                    node: historyNode,
                    isSelected: historyNode.id === selectedId,
                    isCurrent: historyNode.isCurrent,
                    isBranchPoint: historyNode.isBranchPoint,
                    onSelect: handleSelect,
                    onRestore: handleRestore,
                    onPreview: handlePreview,
                } as SnapshotNodeData,
            }
        })

        // Build edges
        const flowEdges: Edge[] = []
        const nodeIds = new Set(filteredNodes.map(n => n.id))

        for (const historyNode of filteredNodes) {
            for (const parentId of historyNode.parentIds) {
                if (nodeIds.has(parentId)) {
                    flowEdges.push({
                        id: `${parentId}->${historyNode.id}`,
                        source: parentId,
                        target: historyNode.id,
                        type: 'smoothstep',
                        animated: historyNode.isCurrent,
                        style: {
                            stroke: historyNode.isCurrent ? '#22c55e' : '#64748b',
                            strokeWidth: historyNode.isCurrent ? 2 : 1,
                        },
                    })
                }
            }
        }

        return { nodes: flowNodes, edges: flowEdges }
    }, [filteredNodes, selectedId, nodePositions, handleSelect, handleRestore, handlePreview])

    // Update React Flow state when flow elements change
    useEffect(() => {
        setNodes(flowElements.nodes)
        setEdges(flowElements.edges)
    }, [flowElements, setNodes, setEdges])

    // Sync external selectedId
    useEffect(() => {
        if (externalSelectedId) {
            setSelectedId(externalSelectedId)
        }
    }, [externalSelectedId])

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="text-muted-foreground">Loading history...</div>
            </div>
        )
    }

    if (historyNodes.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center h-full gap-4 ${className}`}>
                <div className="text-muted-foreground text-center">
                    <p className="text-lg font-medium mb-2">No history yet</p>
                    <p className="text-sm">Make some changes and save a checkpoint to start tracking history.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative w-full h-full ${className}`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                <TreeControls
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onCreateCheckpoint={handleCreateCheckpoint}
                    isCreatingCheckpoint={saveMutation.isPending}
                />
            </ReactFlow>

            <PreviewPanel
                snapshot={previewNode}
                onClose={() => setPreviewNode(null)}
                onRestore={handleRestore}
                isRestoring={restoreMutation.isPending}
            />
        </div>
    )
}

/**
 * UndoTree - Visual undo tree component
 * 
 * @example
 * ```tsx
 * <UndoTree
 *   projectPath="/path/to/project"
 *   onRestore={(id) => console.log('Restored to', id)}
 * />
 * ```
 */
export function UndoTree(props: UndoTreeProps) {
    return (
        <ReactFlowProvider>
            <UndoTreeInner {...props} />
        </ReactFlowProvider>
    )
}
