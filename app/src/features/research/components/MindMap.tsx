/**
 * Mind Map Component
 * 
 * Visual brainstorming and idea mapping using React Flow
 */

import { useState, useCallback, useMemo } from 'react'
import {
    GitBranch,
    Plus,
    Trash2,
    ZoomIn,
    ZoomOut,
} from 'lucide-react'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { cn } from '@/shared/utils/cn'

// Simple node type for mind map
export interface MindMapNode {
    id: string
    label: string
    x: number
    y: number
    parentId?: string
    color?: string
}

export interface MindMapEdge {
    id: string
    source: string
    target: string
}

export interface MindMapProps {
    projectId: string
    nodes?: MindMapNode[]
    edges?: MindMapEdge[]
    onAddNode?: (node: Omit<MindMapNode, 'id'>) => void
    onUpdateNode?: (id: string, data: Partial<MindMapNode>) => void
    onRemoveNode?: (id: string) => void
    onAddEdge?: (edge: Omit<MindMapEdge, 'id'>) => void
    className?: string
}

const nodeColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
]

export function MindMap({
    projectId: _projectId,
    nodes = [],
    edges = [],
    onAddNode,
    onUpdateNode: _onUpdateNode,
    onRemoveNode,
    className,
}: MindMapProps) {
    const [scale, setScale] = useState(1)
    const [_offset, _setOffset] = useState({ x: 0, y: 0 })
    const [selectedNode, setSelectedNode] = useState<string | null>(null)
    const [newNodeLabel, setNewNodeLabel] = useState('')

    // Central node (root)
    const centralNode = useMemo(() =>
        nodes.find(n => !n.parentId) || null,
        [nodes])

    const handleAddNode = useCallback(() => {
        if (!newNodeLabel.trim()) return

        const parentId = selectedNode || centralNode?.id
        const angle = Math.random() * Math.PI * 2
        const distance = 150
        const parentNode = nodes.find(n => n.id === parentId)

        onAddNode?.({
            label: newNodeLabel,
            x: (parentNode?.x || 400) + Math.cos(angle) * distance,
            y: (parentNode?.y || 300) + Math.sin(angle) * distance,
            parentId: parentId || undefined,
            color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        })

        setNewNodeLabel('')
    }, [newNodeLabel, selectedNode, centralNode, nodes, onAddNode])

    const handleAddCentralNode = useCallback(() => {
        onAddNode?.({
            label: 'Main Topic',
            x: 400,
            y: 300,
            color: nodeColors[0],
        })
    }, [onAddNode])

    const handleZoom = useCallback((delta: number) => {
        setScale(prev => Math.max(0.5, Math.min(2, prev + delta)))
    }, [])

    return (
        <div className={cn('space-y-4', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Mind Map</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleZoom(-0.1)}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button variant="outline" size="icon" onClick={() => handleZoom(0.1)}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Add Node Input */}
            <div className="flex gap-2">
                <Input
                    placeholder={selectedNode ? 'Add child node...' : 'Add new idea...'}
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNode()
                    }}
                />
                <Button onClick={handleAddNode} disabled={!newNodeLabel.trim()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                </Button>
            </div>

            {/* Canvas */}
            <div
                className="relative bg-muted/30 rounded-lg border overflow-hidden"
                style={{ height: 500 }}
            >
                {nodes.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <GitBranch className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                            <p className="text-muted-foreground mb-4">Start your mind map</p>
                            <Button onClick={handleAddCentralNode} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Central Topic
                            </Button>
                        </div>
                    </div>
                ) : (
                    <svg
                        className="w-full h-full"
                        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                    >
                        {/* Edges */}
                        {edges.map(edge => {
                            const source = nodes.find(n => n.id === edge.source)
                            const target = nodes.find(n => n.id === edge.target)
                            if (!source || !target) return null

                            return (
                                <line
                                    key={edge.id}
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke={target.color || '#888'}
                                    strokeWidth={2}
                                    opacity={0.5}
                                />
                            )
                        })}

                        {/* Nodes */}
                        {nodes.map(node => (
                            <g
                                key={node.id}
                                transform={`translate(${node.x}, ${node.y})`}
                                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle
                                    r={node.parentId ? 30 : 45}
                                    fill={node.color || '#3b82f6'}
                                    stroke={selectedNode === node.id ? '#fff' : 'transparent'}
                                    strokeWidth={3}
                                    opacity={0.9}
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize={node.parentId ? 10 : 12}
                                    fontWeight={node.parentId ? 'normal' : 'bold'}
                                    className="pointer-events-none select-none"
                                >
                                    {node.label.length > 12
                                        ? node.label.slice(0, 10) + '...'
                                        : node.label}
                                </text>
                            </g>
                        ))}
                    </svg>
                )}
            </div>

            {/* Selected Node Actions */}
            {selectedNode && (
                <Card>
                    <CardContent className="p-3 flex items-center justify-between">
                        <span className="text-sm">
                            Selected: <strong>{nodes.find(n => n.id === selectedNode)?.label}</strong>
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedNode(null)}
                            >
                                Deselect
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    onRemoveNode?.(selectedNode)
                                    setSelectedNode(null)
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default MindMap
