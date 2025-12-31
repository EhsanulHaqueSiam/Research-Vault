/**
 * FileTree Component
 * 
 * Displays a tree view of files in a project directory
 */

import { useState, useEffect, useCallback } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui'

interface FileNode {
    name: string
    path: string
    isDirectory: boolean
    children?: FileNode[]
}

interface FileTreeProps {
    projectPath: string
    onFileSelect?: (path: string) => void
    selectedFile?: string | null
    className?: string
}

// Mock file tree data for demo (will be replaced by Tauri file system API)
function getMockFileTree(projectPath: string): FileNode[] {
    return [
        {
            name: 'src',
            path: `${projectPath}/src`,
            isDirectory: true,
            children: [
                {
                    name: 'components',
                    path: `${projectPath}/src/components`,
                    isDirectory: true,
                    children: [
                        { name: 'App.tsx', path: `${projectPath}/src/components/App.tsx`, isDirectory: false },
                        { name: 'Button.tsx', path: `${projectPath}/src/components/Button.tsx`, isDirectory: false },
                    ]
                },
                { name: 'index.ts', path: `${projectPath}/src/index.ts`, isDirectory: false },
                { name: 'main.tsx', path: `${projectPath}/src/main.tsx`, isDirectory: false },
            ]
        },
        {
            name: 'docs',
            path: `${projectPath}/docs`,
            isDirectory: true,
            children: [
                { name: 'README.md', path: `${projectPath}/docs/README.md`, isDirectory: false },
                { name: 'CHANGELOG.md', path: `${projectPath}/docs/CHANGELOG.md`, isDirectory: false },
            ]
        },
        { name: 'package.json', path: `${projectPath}/package.json`, isDirectory: false },
        { name: 'tsconfig.json', path: `${projectPath}/tsconfig.json`, isDirectory: false },
        { name: '.gitignore', path: `${projectPath}/.gitignore`, isDirectory: false },
    ]
}

interface FileNodeItemProps {
    node: FileNode
    depth: number
    selectedFile?: string | null
    onFileSelect?: (path: string) => void
    expandedPaths: Set<string>
    onToggleExpand: (path: string) => void
}

function FileNodeItem({ node, depth, selectedFile, onFileSelect, expandedPaths, onToggleExpand }: FileNodeItemProps) {
    const isExpanded = expandedPaths.has(node.path)
    const isSelected = selectedFile === node.path

    const handleClick = () => {
        if (node.isDirectory) {
            onToggleExpand(node.path)
        } else {
            onFileSelect?.(node.path)
        }
    }

    return (
        <div>
            <button
                className={cn(
                    'flex items-center gap-1.5 w-full px-2 py-1 text-sm text-left rounded-md transition-colors',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/10 text-primary'
                )}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={handleClick}
            >
                {node.isDirectory ? (
                    <>
                        {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        {isExpanded ? (
                            <FolderOpen className="h-4 w-4 text-blue-500" />
                        ) : (
                            <Folder className="h-4 w-4 text-blue-500" />
                        )}
                    </>
                ) : (
                    <>
                        <span className="w-3.5" />
                        <File className="h-4 w-4 text-muted-foreground" />
                    </>
                )}
                <span className="truncate">{node.name}</span>
            </button>

            {node.isDirectory && isExpanded && node.children && (
                <div>
                    {node.children.map((child) => (
                        <FileNodeItem
                            key={child.path}
                            node={child}
                            depth={depth + 1}
                            selectedFile={selectedFile}
                            onFileSelect={onFileSelect}
                            expandedPaths={expandedPaths}
                            onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function FileTree({ projectPath, onFileSelect, selectedFile, className }: FileTreeProps) {
    const [files, setFiles] = useState<FileNode[]>([])
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(false)

    const loadFiles = useCallback(async () => {
        setIsLoading(true)
        try {
            // TODO: Replace with Tauri file system API
            // const entries = await invoke('read_dir', { path: projectPath })
            const mockFiles = getMockFileTree(projectPath)
            setFiles(mockFiles)

            // Auto-expand first level
            const firstLevel = mockFiles.filter(f => f.isDirectory).map(f => f.path)
            setExpandedPaths(new Set(firstLevel))
        } catch (error) {
            console.error('Failed to load files:', error)
        } finally {
            setIsLoading(false)
        }
    }, [projectPath])

    useEffect(() => {
        if (projectPath) {
            loadFiles()
        }
    }, [projectPath, loadFiles])

    const toggleExpand = useCallback((path: string) => {
        setExpandedPaths(prev => {
            const next = new Set(prev)
            if (next.has(path)) {
                next.delete(path)
            } else {
                next.add(path)
            }
            return next
        })
    }, [])

    if (isLoading) {
        return (
            <div className={cn('p-4 text-center text-muted-foreground', className)}>
                <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading files...</p>
            </div>
        )
    }

    if (files.length === 0) {
        return (
            <div className={cn('p-4 text-center text-muted-foreground', className)}>
                <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files found</p>
            </div>
        )
    }

    return (
        <div className={cn('py-2', className)}>
            <div className="flex items-center justify-between px-3 pb-2 mb-2 border-b">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Files</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={loadFiles}>
                    <RefreshCw className="h-3.5 w-3.5" />
                </Button>
            </div>
            {files.map((node) => (
                <FileNodeItem
                    key={node.path}
                    node={node}
                    depth={0}
                    selectedFile={selectedFile}
                    onFileSelect={onFileSelect}
                    expandedPaths={expandedPaths}
                    onToggleExpand={toggleExpand}
                />
            ))}
        </div>
    )
}

export default FileTree
