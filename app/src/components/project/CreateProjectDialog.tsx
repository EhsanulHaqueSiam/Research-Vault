/**
 * Create Project Dialog
 * 
 * Multi-step wizard for creating new projects
 */

import { useState } from 'react'
import {
    FolderOpen,
    ChevronRight,
    ChevronLeft,
    Check,
    Loader2,
    FileText,
    Database,
    BookOpen,
    Briefcase,
    FlaskConical,
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
} from '@/components/ui'
import { useCreateProjectFromTemplate, useProjectTemplates } from '@/features/projects/hooks'
import type { ProjectTemplate } from '@/features/projects'

interface CreateProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: (projectId: string) => void
}

type Step = 'template' | 'details' | 'confirm'

const templateIcons: Record<string, React.ReactNode> = {
    'literature-review': <BookOpen className="h-6 w-6" />,
    'data-analysis': <Database className="h-6 w-6" />,
    'thesis': <FileText className="h-6 w-6" />,
    'grant-proposal': <Briefcase className="h-6 w-6" />,
    'lab-experiment': <FlaskConical className="h-6 w-6" />,
}

export function CreateProjectDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateProjectDialogProps) {
    const [step, setStep] = useState<Step>('template')
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
    const [projectName, setProjectName] = useState('')
    const [projectPath, setProjectPath] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    const { data: templates } = useProjectTemplates()
    const createProject = useCreateProjectFromTemplate()

    const resetForm = () => {
        setStep('template')
        setSelectedTemplate(null)
        setProjectName('')
        setProjectPath('')
        setProjectDescription('')
        setTags([])
        setTagInput('')
    }

    const handleClose = () => {
        resetForm()
        onOpenChange(false)
    }

    const handleSelectTemplate = (template: ProjectTemplate) => {
        setSelectedTemplate(template)
        setTags(template.defaultTags)
        setStep('details')
    }

    const handleSkipTemplate = () => {
        setSelectedTemplate(null)
        setStep('details')
    }

    const handleBack = () => {
        if (step === 'details') {
            setStep('template')
        } else if (step === 'confirm') {
            setStep('details')
        }
    }

    const handleNext = () => {
        if (step === 'details') {
            setStep('confirm')
        }
    }

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase()
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag])
        }
        setTagInput('')
    }

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const handleCreate = async () => {
        try {
            const result = await createProject.mutateAsync({
                data: {
                    name: projectName,
                    path: projectPath,
                    description: projectDescription || undefined,
                    tags: tags.length > 0 ? tags : undefined,
                },
                templateId: selectedTemplate?.id || 'blank',
            })
            onSuccess?.(result.id)
            handleClose()
        } catch (error) {
            console.error('Failed to create project:', error)
        }
    }

    const canProceedDetails = projectName.trim().length > 0 && projectPath.trim().length > 0

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        Create New Project
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'template' && 'Choose a template to get started quickly'}
                        {step === 'details' && 'Enter your project details'}
                        {step === 'confirm' && 'Review and create your project'}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 py-4">
                    <div className={`h-2 w-2 rounded-full ${step === 'template' ? 'bg-primary' : 'bg-primary/30'}`} />
                    <div className={`h-0.5 w-8 ${step !== 'template' ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`h-2 w-2 rounded-full ${step === 'details' ? 'bg-primary' : step === 'confirm' ? 'bg-primary/30' : 'bg-muted'}`} />
                    <div className={`h-0.5 w-8 ${step === 'confirm' ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`h-2 w-2 rounded-full ${step === 'confirm' ? 'bg-primary' : 'bg-muted'}`} />
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                    {step === 'template' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {templates?.map(template => (
                                    <button
                                        key={template.id}
                                        className={`p-4 rounded-lg border text-left transition-all hover:border-primary/50 hover:shadow-sm ${selectedTemplate?.id === template.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border'
                                            }`}
                                        onClick={() => handleSelectTemplate(template)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-md bg-muted text-muted-foreground">
                                                {templateIcons[template.id] || <FolderOpen className="h-6 w-6" />}
                                            </div>
                                            <div className="font-medium">{template.name}</div>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {template.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={handleSkipTemplate}
                            >
                                Start from scratch
                            </Button>
                        </div>
                    )}

                    {step === 'details' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Name *</label>
                                <Input
                                    placeholder="My Research Project"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Path *</label>
                                <Input
                                    placeholder="/path/to/project"
                                    value={projectPath}
                                    onChange={(e) => setProjectPath(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Where the project folder will be created
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Brief description of your project..."
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    rows={2}
                                />
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
                                    <Button type="button" variant="outline" onClick={handleAddTag}>
                                        Add
                                    </Button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {tags.map(tag => (
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
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        {selectedTemplate
                                            ? templateIcons[selectedTemplate.id] || <FolderOpen className="h-6 w-6" />
                                            : <FolderOpen className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{projectName}</div>
                                        <div className="text-sm text-muted-foreground">{projectPath}</div>
                                    </div>
                                </div>

                                {projectDescription && (
                                    <p className="text-sm text-muted-foreground">{projectDescription}</p>
                                )}

                                {selectedTemplate && (
                                    <div className="pt-2 border-t">
                                        <div className="text-xs text-muted-foreground mb-1">Template</div>
                                        <Badge variant="outline">{selectedTemplate.name}</Badge>
                                    </div>
                                )}

                                {tags.length > 0 && (
                                    <div className="pt-2 border-t">
                                        <div className="text-xs text-muted-foreground mb-1">Tags</div>
                                        <div className="flex flex-wrap gap-1">
                                            {tags.map(tag => (
                                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedTemplate && (
                                    <div className="pt-2 border-t">
                                        <div className="text-xs text-muted-foreground mb-1">Folders to create</div>
                                        <div className="text-sm font-mono">
                                            {selectedTemplate.folders.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    {step !== 'template' && (
                        <Button variant="outline" onClick={handleBack}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>
                    )}

                    {step === 'details' && (
                        <Button onClick={handleNext} disabled={!canProceedDetails}>
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    )}

                    {step === 'confirm' && (
                        <Button
                            onClick={handleCreate}
                            disabled={createProject.isPending}
                            className="gap-2"
                        >
                            {createProject.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    Create Project
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
