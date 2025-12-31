/**
 * Inline Edit Hook
 * 
 * Makes text editable with double-click to rename
 */

import { useState, useRef, useEffect, useCallback } from 'react'

export interface UseInlineEditOptions {
    value: string
    onSave: (newValue: string) => void | Promise<void>
    onCancel?: () => void
}

export interface UseInlineEditReturn {
    isEditing: boolean
    editValue: string
    inputRef: React.RefObject<HTMLInputElement | null>
    startEditing: () => void
    stopEditing: () => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleKeyDown: (e: React.KeyboardEvent) => void
    handleBlur: () => void
    handleDoubleClick: () => void
}

export function useInlineEdit({
    value,
    onSave,
    onCancel,
}: UseInlineEditOptions): UseInlineEditReturn {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sync with external value changes
    useEffect(() => {
        if (!isEditing) {
            setEditValue(value)
        }
    }, [value, isEditing])

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const startEditing = useCallback(() => {
        setIsEditing(true)
        setEditValue(value)
    }, [value])

    const stopEditing = useCallback(() => {
        setIsEditing(false)
        setEditValue(value)
        onCancel?.()
    }, [value, onCancel])

    const saveEdit = useCallback(async () => {
        const trimmed = editValue.trim()
        if (trimmed && trimmed !== value) {
            await onSave(trimmed)
        }
        setIsEditing(false)
    }, [editValue, value, onSave])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            saveEdit()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            stopEditing()
        }
    }, [saveEdit, stopEditing])

    const handleBlur = useCallback(() => {
        saveEdit()
    }, [saveEdit])

    const handleDoubleClick = useCallback(() => {
        startEditing()
    }, [startEditing])

    return {
        isEditing,
        editValue,
        inputRef,
        startEditing,
        stopEditing,
        handleChange,
        handleKeyDown,
        handleBlur,
        handleDoubleClick,
    }
}

export default useInlineEdit
