/**
 * Project Settings Component
 * 
 * Settings panel for managing project configuration
 */

import { useState, useEffect } from 'react'
import {
    Settings,
    Save,
    Loader2,
    Tag,
    Users,
    GitBranch,
    HardDrive,
    Bell,
    Palette,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Input,
    Textarea,
    Badge,
    ColorPicker,
} from '@/components/ui'
import {
    useUpdateProject,
    useAddProjectTag,
    useRemoveProjectTag
} from '@/features/projects/hooks'
import type { Project } from '@/features/projects'

interface ProjectSettingsProps {
    project: Project | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

type SettingsTab = 'general' | 'appearance' | 'members' | 'git' | 'storage' | 'notifications'

export function ProjectSettings({
    project,
    open,
    onOpenChange,
}: ProjectSettingsProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState<string | null>(null)
    const [tagInput, setTagInput] = useState('')

    const updateProject = useUpdateProject()
    const addTag = useAddProjectTag()
    const removeTag = useRemoveProjectTag()

    useEffect(() => {
        if (project) {
            setName(project.name)
            setDescription(project.description || '')
            setColor(project.color || null)
        }
    }, [project])

    if (!project) return null

    const handleSave = async () => {
        await updateProject.mutateAsync({
            id: project.id,
            data: {
                name,
                description: description || null,
                color,
            },
        })
    }

    const handleAddTag = async () => {
        const tag = tagInput.trim().toLowerCase()
        if (tag) {
            await addTag.mutateAsync({ id: project.id, tag })
            setTagInput('')
        }
    }

    const handleRemoveTag = async (tag: string) => {
        await removeTag.mutateAsync({ id: project.id, tag })
    }

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'members', label: 'Members', icon: Users },
        { id: 'git', label: 'Version Control', icon: GitBranch },
        { id: 'storage', label: 'Storage', icon: HardDrive },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ]

    const hasChanges = name !== project.name || description !== (project.description || '') || color !== (project.color || null)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Project Settings
                    </DialogTitle>
                    <DialogDescription>
                        Manage settings for "{project.name}"
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-6 min-h-[400px]">
                    {/* Sidebar */}
                    <div className="w-44 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors ${activeTab === tab.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                    }`}
                                onClick={() => setActiveTab(tab.id as SettingsTab)}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === 'general' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project Name</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project Path</label>
                                    <Input value={project.path} disabled className="bg-muted" />
                                    <p className="text-xs text-muted-foreground">
                                        Project path cannot be changed
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags</label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a tag..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    handleAddTag()
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={handleAddTag}
                                            disabled={addTag.isPending}
                                        >
                                            {addTag.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Tag className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.tags.map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="cursor-pointer"
                                                    onClick={() => handleRemoveTag(tag)}
                                                >
                                                    {tag} ×
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Badge variant="outline" className="capitalize">
                                        {project.status}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Project Color</label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose a color to identify this project. It will be displayed on the project card.
                                    </p>
                                    <ColorPicker
                                        value={color}
                                        onChange={setColor}
                                    />
                                </div>

                                {color && (
                                    <div className="rounded-lg border p-4 bg-muted/30">
                                        <span className="text-xs text-muted-foreground block mb-2">Preview</span>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{
                                                    backgroundColor: `${color}20`,
                                                    color: color
                                                }}
                                            >
                                                <Settings className="h-5 w-5" />
                                            </div>
                                            <div
                                                className="h-8 w-2 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="font-medium">{project.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'members' && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-1">Team Members</h3>
                                <p className="text-sm text-muted-foreground">
                                    Manage project collaborators and their roles.
                                </p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Coming in a future update
                                </p>
                            </div>
                        )}

                        {activeTab === 'git' && (
                            <div className="space-y-4">
                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <GitBranch className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">Version Control</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Git integration enables automatic versioning of your work.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Auto-commit</span>
                                            <Badge variant="secondary">Enabled</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Commit interval</span>
                                            <span>30 seconds</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'storage' && (
                            <div className="space-y-4">
                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <HardDrive className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">Storage Usage</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Coming soon: View disk usage, file counts, and storage management.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-1">Notifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure notification preferences for this project.
                                </p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Coming in a future update
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || updateProject.isPending}
                    >
                        {updateProject.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
