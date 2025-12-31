/**
 * Tree Controls Component
 * 
 * Zoom, pan, and layout controls for the undo tree
 */

import { memo } from 'react'
import {
    Panel,
    useReactFlow,
    MiniMap,
} from '@xyflow/react'
import { Save, Search, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'

interface TreeControlsProps {
    /** Search query */
    searchQuery: string
    /** Callback when search changes */
    onSearchChange: (query: string) => void
    /** Callback to create checkpoint */
    onCreateCheckpoint: () => void
    /** Whether creating checkpoint is in progress */
    isCreatingCheckpoint: boolean
}

function TreeControlsComponent({
    searchQuery,
    onSearchChange,
    onCreateCheckpoint,
    isCreatingCheckpoint,
}: TreeControlsProps) {
    const { zoomIn, zoomOut, fitView } = useReactFlow()

    return (
        <>
            {/* Top panel with search and create */}
            <Panel position="top-left" className="flex items-center gap-2 p-2">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8 w-48 h-8 text-sm"
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateCheckpoint}
                    disabled={isCreatingCheckpoint}
                    className="h-8"
                >
                    {isCreatingCheckpoint ? (
                        <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-1" />
                    )}
                    Create Checkpoint
                </Button>
            </Panel>

            {/* Zoom controls */}
            <Panel position="bottom-left" className="flex flex-col gap-1 p-1 bg-background/80 rounded-lg border">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomIn()}
                    className="h-7 w-7"
                    title="Zoom In"
                >
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomOut()}
                    className="h-7 w-7"
                    title="Zoom Out"
                >
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fitView({ padding: 0.2 })}
                    className="h-7 w-7"
                    title="Fit View"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </Panel>

            {/* Minimap */}
            <MiniMap
                position="bottom-right"
                className="!bg-background/80 !border rounded-lg"
                nodeColor={(node) => {
                    if (node.data?.isCurrent) return '#22c55e' // green
                    if (node.data?.isBranchPoint) return '#6366f1' // indigo
                    return '#64748b' // slate
                }}
                maskColor="rgba(0, 0, 0, 0.2)"
                pannable
                zoomable
            />
        </>
    )
}

export const TreeControls = memo(TreeControlsComponent)
