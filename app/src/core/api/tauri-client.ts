/**
 * Tauri IPC Client
 * 
 * Centralized interface for all Tauri backend communication.
 * Provides type-safe wrappers around Tauri's invoke function.
 */

import { invoke as tauriInvoke } from '@tauri-apps/api/core'

/**
 * Type-safe wrapper around Tauri invoke
 */
export async function invoke<T>(
    command: string,
    args?: Record<string, unknown>
): Promise<T> {
    try {
        return await tauriInvoke<T>(command, args)
    } catch (error) {
        // Log error for debugging
        console.error(`Tauri command failed: ${command}`, error)
        throw error
    }
}

/**
 * Execute command with loading state management
 */
export async function invokeWithLoading<T>(
    command: string,
    args?: Record<string, unknown>,
    onLoading?: (loading: boolean) => void
): Promise<T> {
    try {
        onLoading?.(true)
        return await invoke<T>(command, args)
    } finally {
        onLoading?.(false)
    }
}
