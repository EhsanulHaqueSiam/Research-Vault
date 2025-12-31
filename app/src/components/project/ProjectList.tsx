/**
 * Project List Component
 * 
 * Displays a list/grid of projects with search and filters
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
    Plus,
    Search,
    Grid3X3,
    List,
    Filter,
    FolderOpen,
} from 'lucide-react'
import { Button, Input, Badge } from '@/components/ui'
import { ProjectCard } from './ProjectCard'
import { ContextualToolbar } from '@/components/feedback/ContextualToolbar'
import { toast } from '@/components/feedback/ActionToast'
import { useKeyboardNavigation } from '@/shared/hooks/useKeyboardNavigation'
import { useActiveProjects, useProjectStats } from '@/features/projects/hooks'
import type { Project } from '@/features/projects'

type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'lastModified' | 'created'

interface ProjectListProps {
    onCreateProject?: () => void
    onOpenProject?: (project: Project) => void
    onArchiveProject?: (project: Project) => void
    onDeleteProject?: (project: Project) => void
    onProjectSettings?: (project: Project) => void
}

export function ProjectList({
    onCreateProject,
    onOpenProject,
    onArchiveProject,
    onDeleteProject,
    onProjectSettings,
}: ProjectListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sortBy, setSortBy] = useState<SortOption>('lastModified')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
    const containerRef = useRef<HTMLDivElement>(null)

    const { data: projects, isLoading, error } = useActiveProjects()
    const { data: stats } = useProjectStats()

    // Extract all unique tags
    const allTags = useMemo(() => {
        if (!projects) return []
        const tagSet = new Set<string>()
        projects.forEach(p => p.tags?.forEach(t => tagSet.add(t)))
        return Array.from(tagSet).sort()
    }, [projects])

    // Filter and sort projects
    const filteredProjects = useMemo(() => {
        if (!projects) return []

        const result = projects.filter(project => {
            // Search filter
            const matchesSearch = searchQuery.length === 0 ||
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.path.toLowerCase().includes(searchQuery.toLowerCase())

            // Tag filter
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => project.tags?.includes(tag))

            return matchesSearch && matchesTags
        })

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'lastModified':
                    return new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime()
                case 'created':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                default:
                    return 0
            }
        })

        return result
    }, [projects, searchQuery, sortBy, selectedTags])

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    // Keyboard navigation
    const { selectedIndex: _selectedIndex, handleKeyDown } = useKeyboardNavigation({
        items: filteredProjects,
        onOpen: (project) => onOpenProject?.(project),
        enabled: true,
    })

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedProjects(new Set())
    }, [])

    // Delete with undo toast
    const handleDeleteWithUndo = useCallback((project: Project) => {
        // Call delete
        onDeleteProject?.(project)

        // Show toast with undo
        toast.success(`Deleted "${project.name}"`, [
            {
                label: 'Undo',
                onClick: () => {
                    // In real app, call restore API
                    toast.info(`Restore not implemented yet`)
                }
            }
        ])
    }, [onDeleteProject])

    // Batch archive
    const handleBatchArchive = useCallback(() => {
        const count = selectedProjects.size
        selectedProjects.forEach(id => {
            const project = filteredProjects.find(p => p.id === id)
            if (project) onArchiveProject?.(project)
        })
        clearSelection()
        toast.success(`Archived ${count} project${count > 1 ? 's' : ''}`)
    }, [selectedProjects, filteredProjects, onArchiveProject, clearSelection])

    // Batch delete
    const handleBatchDelete = useCallback(() => {
        const count = selectedProjects.size
        selectedProjects.forEach(id => {
            const project = filteredProjects.find(p => p.id === id)
            if (project) onDeleteProject?.(project)
        })
        clearSelection()
        toast.success(`Deleted ${count} project${count > 1 ? 's' : ''}`, [
            { label: 'Undo', onClick: () => toast.info('Undo not implemented') }
        ])
    }, [selectedProjects, filteredProjects, onDeleteProject, clearSelection])

    // Focus container for keyboard nav
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus()
        }
    }, [])

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-destructive mb-2">Failed to load projects</div>
                <p className="text-sm text-muted-foreground">{String(error)}</p>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="space-y-6 outline-none"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        {stats ? `${stats.active} active, ${stats.archived} archived` : 'Loading...'}
                    </p>
                </div>
                <Button onClick={onCreateProject} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-md border bg-muted p-1">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                    >
                        <option value="lastModified">Last Modified</option>
                        <option value="name">Name</option>
                        <option value="created">Date Created</option>
                    </select>
                </div>
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    {allTags.map(tag => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                            className="cursor-pointer transition-colors"
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </Badge>
                    ))}
                    {selectedTags.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => setSelectedTags([])}
                        >
                            Clear filters
                        </Button>
                    )}
                </div>
            )}

            {/* Project Grid/List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="h-48 rounded-xl border bg-muted animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-muted mb-4">
                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">
                        {searchQuery || selectedTags.length > 0
                            ? 'No matching projects'
                            : 'No projects yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {searchQuery || selectedTags.length > 0
                            ? 'Try adjusting your search or filters'
                            : 'Create your first project to get started'}
                    </p>
                    {!searchQuery && selectedTags.length === 0 && (
                        <Button onClick={onCreateProject} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Project
                        </Button>
                    )}
                </div>
            ) : (
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                            : 'flex flex-col gap-3'
                    }
                >
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onOpen={onOpenProject}
                            onArchive={onArchiveProject}
                            onDelete={handleDeleteWithUndo}
                            onSettings={onProjectSettings}
                        />
                    ))}
                </div>
            )}

            {/* Multi-select Toolbar */}
            <ContextualToolbar
                selectedCount={selectedProjects.size}
                onClear={clearSelection}
                actions={[
                    { id: 'archive', label: 'Archive', icon: FolderOpen, onClick: handleBatchArchive },
                    { id: 'delete', label: 'Delete', icon: FolderOpen, onClick: handleBatchDelete, variant: 'destructive' },
                ]}
            />
        </div>
    )
}
