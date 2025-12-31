/**
 * Project Card Component
 * 
 * Displays a single project in a card format
 */

import { memo, useState } from 'react'
import {
    FolderOpen,
    MoreVertical,
    Archive,
    Trash2,
    Settings,
    Clock,
    Tag,
    ExternalLink,
} from 'lucide-react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Button,
    Badge,
    Input,
} from '@/components/ui'
import { formatRelativeTime } from '@/shared/utils/date'
import { useInlineEdit } from '@/shared/hooks/useInlineEdit'
import type { Project } from '@/features/projects'

interface ProjectCardProps {
    project: Project
    onOpen?: (project: Project) => void
    onArchive?: (project: Project) => void
    onDelete?: (project: Project) => void
    onSettings?: (project: Project) => void
    onRename?: (project: Project, newName: string) => void
}

function ProjectCardComponent({
    project,
    onOpen,
    onArchive,
    onDelete,
    onSettings,
    onRename,
}: ProjectCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const lastModified = new Date(project.lastModifiedAt)

    // Inline editing for project name
    const {
        isEditing,
        editValue,
        inputRef,
        handleChange,
        handleKeyDown,
        handleBlur,
        handleDoubleClick,
    } = useInlineEdit({
        value: project.name,
        onSave: (newName) => onRename?.(project, newName),
    })

    const statusColors = {
        active: 'bg-green-500/10 text-green-500 border-green-500/20',
        archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        template: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    }

    return (
        <Card
            className="group relative transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 cursor-pointer"
            style={project.color ? { borderLeftColor: project.color, borderLeftWidth: '3px' } : undefined}
            onClick={() => onOpen?.(project)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-lg transition-transform duration-200 group-hover:scale-110"
                            style={{
                                backgroundColor: project.color ? `${project.color}20` : 'hsl(var(--primary) / 0.1)',
                                color: project.color || 'hsl(var(--primary))'
                            }}
                        >
                            <FolderOpen className="h-5 w-5" />
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            {isEditing ? (
                                <Input
                                    ref={inputRef}
                                    value={editValue}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleBlur}
                                    className="h-7 text-lg font-semibold w-full"
                                    autoFocus
                                />
                            ) : (
                                <CardTitle
                                    className="text-lg cursor-text"
                                    onDoubleClick={handleDoubleClick}
                                    title="Double-click to rename"
                                >
                                    {project.name}
                                </CardTitle>
                            )}
                            <CardDescription className="text-xs mt-0.5">
                                {project.path}
                            </CardDescription>
                        </div>
                    </div>

                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 z-10 w-40 rounded-md border bg-popover p-1 shadow-md">
                                <button
                                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                                    onClick={() => {
                                        onSettings?.(project)
                                        setShowMenu(false)
                                    }}
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                                    onClick={() => {
                                        onArchive?.(project)
                                        setShowMenu(false)
                                    }}
                                >
                                    <Archive className="h-4 w-4" />
                                    Archive
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        onDelete?.(project)
                                        setShowMenu(false)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description}
                    </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                        variant="outline"
                        className={statusColors[project.status as keyof typeof statusColors]}
                    >
                        {project.status}
                    </Badge>

                    {project.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                        </Badge>
                    ))}

                    {project.tags && project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(lastModified)}</span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1"
                    onClick={() => onOpen?.(project)}
                >
                    <ExternalLink className="h-3 w-3" />
                    Open
                </Button>
            </CardFooter>
        </Card>
    )
}

export const ProjectCard = memo(ProjectCardComponent)
