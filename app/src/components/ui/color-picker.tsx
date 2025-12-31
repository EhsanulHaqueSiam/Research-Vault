/**
 * Color Picker Component
 * 
 * Project color selector with preset palette, color wheel, and custom hex input
 */

import { useState, useCallback } from 'react'
import { Check, Palette, X, Pipette } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from './button'
import { PROJECT_COLORS } from '@/features/projects/types/project.types'

export interface ColorPickerProps {
    value?: string | null
    onChange?: (color: string | null) => void
    className?: string
}

// Validate hex color format
function isValidHex(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [customColor, setCustomColor] = useState(value || '#3b82f6')
    const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset')

    const handlePresetSelect = useCallback((color: string) => {
        onChange?.(color)
        setIsOpen(false)
    }, [onChange])

    const handleCustomApply = useCallback(() => {
        if (isValidHex(customColor)) {
            onChange?.(customColor)
            setIsOpen(false)
        }
    }, [customColor, onChange])

    const handleClear = useCallback(() => {
        onChange?.(null)
        setIsOpen(false)
    }, [onChange])

    return (
        <div className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
                    'hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring'
                )}
            >
                {value ? (
                    <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: value }}
                    />
                ) : (
                    <Palette className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm">
                    {value ? 'Change Color' : 'Set Color'}
                </span>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-popover border rounded-xl shadow-xl p-4">
                        {/* Tabs */}
                        <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
                            <button
                                type="button"
                                className={cn(
                                    'flex-1 px-3 py-1.5 text-sm rounded-md transition-colors',
                                    activeTab === 'preset'
                                        ? 'bg-background shadow-sm'
                                        : 'hover:bg-background/50'
                                )}
                                onClick={() => setActiveTab('preset')}
                            >
                                Presets
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    'flex-1 px-3 py-1.5 text-sm rounded-md transition-colors',
                                    activeTab === 'custom'
                                        ? 'bg-background shadow-sm'
                                        : 'hover:bg-background/50'
                                )}
                                onClick={() => setActiveTab('custom')}
                            >
                                Custom
                            </button>
                        </div>

                        {/* Preset Colors Grid */}
                        {activeTab === 'preset' && (
                            <div className="grid grid-cols-5 gap-2">
                                {PROJECT_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        className={cn(
                                            'w-9 h-9 rounded-lg border-2 transition-all',
                                            'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring',
                                            value === color.value
                                                ? 'border-foreground shadow-md'
                                                : 'border-transparent'
                                        )}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                        onClick={() => handlePresetSelect(color.value)}
                                    >
                                        {value === color.value && (
                                            <Check className="h-4 w-4 text-white mx-auto drop-shadow-md" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Custom Color Input */}
                        {activeTab === 'custom' && (
                            <div className="space-y-3">
                                {/* Color Preview + Picker */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg border-2 shadow-inner"
                                        style={{ backgroundColor: isValidHex(customColor) ? customColor : '#888' }}
                                    />
                                    <input
                                        type="color"
                                        value={isValidHex(customColor) ? customColor : '#3b82f6'}
                                        onChange={(e) => setCustomColor(e.target.value)}
                                        className="w-10 h-10 cursor-pointer rounded border-0"
                                    />
                                    <Pipette className="h-4 w-4 text-muted-foreground" />
                                </div>

                                {/* Hex Input */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">
                                        Hex Color
                                    </label>
                                    <input
                                        type="text"
                                        value={customColor}
                                        onChange={(e) => setCustomColor(e.target.value)}
                                        placeholder="#3b82f6"
                                        className={cn(
                                            'w-full px-3 py-2 text-sm font-mono rounded-lg border bg-background',
                                            !isValidHex(customColor) && customColor.length > 0
                                                ? 'border-destructive'
                                                : 'border-input'
                                        )}
                                    />
                                </div>

                                {/* Apply Button */}
                                <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={handleCustomApply}
                                    disabled={!isValidHex(customColor)}
                                >
                                    Apply Color
                                </Button>
                            </div>
                        )}

                        {/* Clear Button */}
                        {value && (
                            <button
                                type="button"
                                className="w-full mt-3 flex items-center justify-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                                onClick={handleClear}
                            >
                                <X className="h-3 w-3" />
                                Remove Color
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default ColorPicker
