/**
 * Interactive Tutorial Component
 * 
 * Step-by-step tutorial with spotlight overlay
 */

import { useState, useEffect, useCallback } from 'react'
import {
    X,
    ChevronLeft,
    ChevronRight,
    SkipForward,
    Check,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// ============================================
// Types
// ============================================

export interface TutorialStep {
    id: string
    title: string
    description: string
    targetSelector?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    action?: 'click' | 'type' | 'select'
}

export interface InteractiveTutorialProps {
    steps: TutorialStep[]
    onComplete: () => void
    onSkip: () => void
    storageKey?: string
}

// ============================================
// Component
// ============================================

export function InteractiveTutorial({
    steps,
    onComplete,
    onSkip,
    storageKey = 'tutorial-completed',
}: InteractiveTutorialProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible] = useState(true)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    const step = steps[currentStep]
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === steps.length - 1

    // Find target element
    useEffect(() => {
        if (step?.targetSelector) {
            const el = document.querySelector(step.targetSelector)
            if (el) {
                setTargetRect(el.getBoundingClientRect())
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            } else {
                setTargetRect(null)
            }
        } else {
            setTargetRect(null)
        }
    }, [step])

    const handleNext = useCallback(() => {
        if (isLastStep) {
            localStorage.setItem(storageKey, 'true')
            onComplete()
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }, [isLastStep, storageKey, onComplete])

    const handlePrev = useCallback(() => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1)
        }
    }, [isFirstStep])

    const handleSkip = useCallback(() => {
        localStorage.setItem(storageKey, 'skipped')
        onSkip()
    }, [storageKey, onSkip])

    if (!isVisible || !step) return null

    // Calculate popup position
    const getPopupStyle = (): React.CSSProperties => {
        if (!targetRect) {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }
        }

        const padding = 16
        switch (step.position) {
            case 'top':
                return {
                    bottom: window.innerHeight - targetRect.top + padding,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translateX(-50%)',
                }
            case 'bottom':
                return {
                    top: targetRect.bottom + padding,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translateX(-50%)',
                }
            case 'left':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    right: window.innerWidth - targetRect.left + padding,
                    transform: 'translateY(-50%)',
                }
            case 'right':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.right + padding,
                    transform: 'translateY(-50%)',
                }
            default:
                return {
                    top: targetRect.bottom + padding,
                    left: targetRect.left,
                }
        }
    }

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-[9998]">
                {/* Semi-transparent backdrop */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Spotlight cutout */}
                {targetRect && (
                    <div
                        className="absolute ring-4 ring-blue-500 rounded-lg pointer-events-none"
                        style={{
                            top: targetRect.top - 4,
                            left: targetRect.left - 4,
                            width: targetRect.width + 8,
                            height: targetRect.height + 8,
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                        }}
                    />
                )}
            </div>

            {/* Tutorial Card */}
            <div
                className="fixed z-[9999] w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-5"
                style={getPopupStyle()}
            >
                {/* Close button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X size={16} />
                </button>

                {/* Progress */}
                <div className="flex items-center gap-1 mb-3">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-1 flex-1 rounded-full transition-colors',
                                i <= currentStep ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                            )}
                        />
                    ))}
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {step.description}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSkip}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                        <SkipForward size={14} />
                        Skip tutorial
                    </button>

                    <div className="flex items-center gap-2">
                        {!isFirstStep && (
                            <button
                                onClick={handlePrev}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <ChevronLeft size={14} />
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {isLastStep ? (
                                <>
                                    <Check size={14} />
                                    Finish
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InteractiveTutorial
