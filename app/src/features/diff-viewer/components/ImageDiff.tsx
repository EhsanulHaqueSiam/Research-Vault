/**
 * Image Diff Component
 * 
 * Visual comparison of image files using slider, side-by-side, or onion modes
 */

import { memo, useState, useRef } from 'react'
import { Button } from '@/components/ui'
import { Columns, SplitSquareHorizontal, Layers } from 'lucide-react'
import type { ImageDiffProps } from '../types'

function ImageDiffComponent({
    oldImage,
    newImage,
    viewMode: initialViewMode,
}: ImageDiffProps) {
    const [viewMode, setViewMode] = useState(initialViewMode)
    const [sliderPosition, setSliderPosition] = useState(50)
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle slider drag
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = (x / rect.width) * 100
        setSliderPosition(Math.max(0, Math.min(100, percentage)))
    }


    // Slider View
    if (viewMode === 'slider') {
        return (
            <div className="flex flex-col gap-4 p-4">
                <ViewModeButtons viewMode={viewMode} onViewModeChange={setViewMode} />

                <div
                    ref={containerRef}
                    className="relative cursor-ew-resize select-none bg-checkered rounded-lg overflow-hidden"
                    style={{ minHeight: 300 }}
                    onMouseMove={handleMouseMove}
                >
                    {/* New image (background) */}
                    {newImage && (
                        <img
                            src={newImage}
                            alt="New version"
                            className="w-full h-auto"
                        />
                    )}

                    {/* Old image (clipped) */}
                    {oldImage && (
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${sliderPosition}%` }}
                        >
                            <img
                                src={oldImage}
                                alt="Old version"
                                className="w-full h-auto"
                                style={{
                                    width: containerRef.current?.offsetWidth || '100%',
                                    maxWidth: 'none'
                                }}
                            />
                        </div>
                    )}

                    {/* Slider line */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <div className="w-4 h-0.5 bg-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
                    <span>← Old</span>
                    <span>Drag slider to compare</span>
                    <span>New →</span>
                </div>
            </div>
        )
    }

    // Side-by-Side View
    if (viewMode === 'sideBySide') {
        return (
            <div className="flex flex-col gap-4 p-4">
                <ViewModeButtons viewMode={viewMode} onViewModeChange={setViewMode} />

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground text-center">Before</p>
                        <div className="bg-checkered rounded-lg overflow-hidden flex items-center justify-center min-h-[200px]">
                            {oldImage ? (
                                <img src={oldImage} alt="Old version" className="max-w-full h-auto" />
                            ) : (
                                <p className="text-muted-foreground">No previous version</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground text-center">After</p>
                        <div className="bg-checkered rounded-lg overflow-hidden flex items-center justify-center min-h-[200px]">
                            {newImage ? (
                                <img src={newImage} alt="New version" className="max-w-full h-auto" />
                            ) : (
                                <p className="text-muted-foreground">File deleted</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Onion View (overlay with opacity)
    return (
        <div className="flex flex-col gap-4 p-4">
            <ViewModeButtons viewMode={viewMode} onViewModeChange={setViewMode} />

            <div
                ref={containerRef}
                className="relative bg-checkered rounded-lg overflow-hidden cursor-ew-resize"
                style={{ minHeight: 300 }}
                onMouseMove={handleMouseMove}
            >
                {/* Old image (base) */}
                {oldImage && (
                    <img src={oldImage} alt="Old version" className="w-full h-auto" />
                )}

                {/* New image (overlay with variable opacity) */}
                {newImage && (
                    <img
                        src={newImage}
                        alt="New version"
                        className="absolute inset-0 w-full h-auto"
                        style={{ opacity: sliderPosition / 100 }}
                    />
                )}
            </div>

            <div className="flex items-center justify-center gap-4">
                <span className="text-xs text-muted-foreground">Old</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="w-48"
                />
                <span className="text-xs text-muted-foreground">New</span>
                <span className="text-xs text-muted-foreground ml-2">{Math.round(sliderPosition)}%</span>
            </div>
        </div>
    )
}

/**
 * View mode toggle buttons
 */
function ViewModeButtons({
    viewMode,
    onViewModeChange,
}: {
    viewMode: 'slider' | 'sideBySide' | 'onion'
    onViewModeChange: (mode: 'slider' | 'sideBySide' | 'onion') => void
}) {
    return (
        <div className="flex items-center justify-center gap-1 bg-muted rounded-lg p-0.5 w-fit mx-auto">
            <Button
                variant={viewMode === 'slider' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => onViewModeChange('slider')}
            >
                <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1" />
                Slider
            </Button>
            <Button
                variant={viewMode === 'sideBySide' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => onViewModeChange('sideBySide')}
            >
                <Columns className="h-3.5 w-3.5 mr-1" />
                Side by Side
            </Button>
            <Button
                variant={viewMode === 'onion' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => onViewModeChange('onion')}
            >
                <Layers className="h-3.5 w-3.5 mr-1" />
                Onion
            </Button>
        </div>
    )
}

export const ImageDiff = memo(ImageDiffComponent)
