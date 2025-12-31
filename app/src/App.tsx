/**
 * Research Management App
 */

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectList } from '@/components/project'
import { CreateProjectDialog } from '@/components/project/CreateProjectDialog'
import { ProjectSettings } from '@/components/project/ProjectSettings'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { ThemeSelector } from '@/components/settings/ThemeSelector'
import { CommandPalette } from '@/shared/components/CommandPalette/CommandPalette'
import { KeyboardShortcutsPanel, DEFAULT_SHORTCUTS } from '@/features/help/components/KeyboardShortcutsPanel'
import { InteractiveTutorial } from '@/features/help/components/InteractiveTutorial'
import { UndoTree, useAutoCommit } from '@/features/git-history'
import { FileTree } from '@/components/explorer'
import { TaskList } from '@/features/tasks/components/TaskList'
import { KanbanBoard } from '@/features/tasks/components/KanbanBoard'
import { NotesList } from '@/features/notes/components/NotesList'
import { NoteEditor } from '@/features/notes/components/NoteEditor'
import { Dashboard as AnalyticsDashboard } from '@/features/analytics/components/Dashboard'
import { useProjectTasks } from '@/features/tasks/hooks/useTasks'
import { useProjectNotes } from '@/features/notes/hooks/useNotes'
import { Button } from '@/components/ui'
import { ToastContainer } from '@/components/feedback/ActionToast'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ArrowLeft, History, CheckSquare, FileText, FolderOpen, Settings, LayoutGrid, Search, BarChart3, Keyboard, Files } from 'lucide-react'
import type { Project } from '@/features/projects'
import type { Note } from '@/features/notes/types/note.types'

// Create a query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
})

type View = 'projects' | 'project-detail'
type Tab = 'overview' | 'files' | 'history' | 'tasks' | 'kanban' | 'notes' | 'analytics'

/**
 * Task Tab Content - Uses project tasks hook
 */
function TaskTabContent({ projectId }: { projectId: string }) {
    const {
        tasks,
        create,
        update,
        remove,
        isCreating,
        isUpdating,
        isDeleting
    } = useProjectTasks(projectId)

    return (
        <TaskList
            projectId={projectId}
            tasks={tasks}
            onCreateTask={create}
            onUpdateTask={update}
            onDeleteTask={remove}
            isLoading={isCreating || isUpdating || isDeleting}
        />
    )
}

/**
 * Notes Tab Content - Uses project notes hook with edit support
 */
function NotesTabContent({ projectId }: { projectId: string }) {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const {
        notes,
        pinnedNotes,
        tags,
        isLoading,
        create,
        update,
        updateContent,
        remove,
        togglePin,
        duplicate,
    } = useProjectNotes(projectId)

    const handleCreateNote = () => {
        create({ projectId, title: 'Untitled Note', content: '', isPinned: false })
    }

    const handleEditNote = (note: Note) => {
        setSelectedNote(note)
    }

    const handleBackToList = () => {
        setSelectedNote(null)
    }

    const handleContentChange = (content: string) => {
        if (selectedNote) {
            updateContent(selectedNote.id, content)
        }
    }

    const handleTitleChange = (title: string) => {
        if (selectedNote) {
            update(selectedNote.id, { title })
        }
    }

    // Show NoteEditor when a note is selected
    if (selectedNote) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                    <Button variant="ghost" size="sm" onClick={handleBackToList}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Notes
                    </Button>
                </div>
                <div className="flex-1">
                    <NoteEditor
                        content={selectedNote.content || ''}
                        title={selectedNote.title}
                        onContentChange={handleContentChange}
                        onTitleChange={handleTitleChange}
                        autoSaveDelay={2000}
                    />
                </div>
            </div>
        )
    }

    return (
        <NotesList
            notes={notes}
            pinnedNotes={pinnedNotes}
            tags={tags}
            isLoading={isLoading}
            onCreateNote={handleCreateNote}
            onEditNote={handleEditNote}
            onDelete={remove}
            onTogglePin={togglePin}
            onDuplicate={duplicate}
        />
    )
}

/**
 * Kanban Tab Content - Uses project tasks hook for Kanban view
 */
function KanbanTabContent({ projectId }: { projectId: string }) {
    const {
        tasks,
        create,
        update,
        remove,
        isCreating,
        isUpdating,
        isDeleting
    } = useProjectTasks(projectId)

    return (
        <KanbanBoard
            projectId={projectId}
            tasks={tasks}
            onCreateTask={create}
            onUpdateTask={update}
            onDeleteTask={remove}
            isLoading={isCreating || isUpdating || isDeleting}
        />
    )
}

function AppContent() {
    const [view, setView] = useState<View>('projects')
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [settingsProject, setSettingsProject] = useState<Project | null>(null)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
    const [helpOpen, setHelpOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<string | null>(null)

    // Tutorial state - show on first launch
    const [showTutorial, setShowTutorial] = useState(() => {
        return localStorage.getItem('research-tutorial-completed') !== 'true'
    })

    // Auto-commit hook - only active when a project is open
    const autoCommit = selectedProject ? useAutoCommit(selectedProject.path) : null

    // Start auto-commit watching when project opens
    useEffect(() => {
        if (selectedProject && autoCommit && !autoCommit.isWatching) {
            autoCommit.start()
        }
        return () => {
            if (autoCommit?.isWatching) {
                autoCommit.stop()
            }
        }
    }, [selectedProject?.id])

    const handleOpenProject = (project: Project) => {
        setSelectedProject(project)
        setView('project-detail')
        setActiveTab('overview')
    }

    const handleBackToProjects = () => {
        setSelectedProject(null)
        setView('projects')
    }

    const handleArchiveProject = (project: Project) => {
        // TODO: Archive project with confirmation
        console.log('Archive project:', project.id)
    }

    const handleDeleteProject = (project: Project) => {
        // TODO: Delete project with confirmation
        console.log('Delete project:', project.id)
    }

    const handleProjectSettings = (project: Project) => {
        setSettingsProject(project)
    }

    const handleProjectCreated = (projectId: string) => {
        console.log('Project created:', projectId)
    }



    return (
        <div className="min-h-screen bg-background text-foreground">
            {view === 'projects' ? (
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Homepage Header with Settings */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Research Manager</h1>
                            <p className="text-muted-foreground">Manage your research projects</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCommandPaletteOpen(true)}
                                className="gap-2 text-muted-foreground"
                                title="Search (Ctrl+K)"
                            >
                                <Search className="h-4 w-4" />
                                <span className="hidden sm:inline">Search...</span>
                                <kbd className="hidden sm:inline ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setHelpOpen(true)}
                                title="Keyboard Shortcuts (?)"
                            >
                                <Keyboard className="h-5 w-5" />
                            </Button>
                            <ThemeSelector variant="toggle" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSettingsOpen(true)}
                                title="Settings"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <ProjectList
                        onCreateProject={() => setCreateDialogOpen(true)}
                        onOpenProject={handleOpenProject}
                        onArchiveProject={handleArchiveProject}
                        onDeleteProject={handleDeleteProject}
                        onProjectSettings={handleProjectSettings}
                    />
                </div>
            ) : (
                <div className="flex flex-col h-screen">
                    {/* Project Header */}
                    <header className="border-b bg-card px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackToProjects}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>

                            {/* Breadcrumb Navigation */}
                            <Breadcrumb
                                items={[
                                    { label: 'Projects', onClick: handleBackToProjects },
                                    { label: selectedProject?.name || 'Project' },
                                ]}
                                className="hidden sm:flex"
                            />

                            <div className="flex items-center gap-3 flex-1">
                                <FolderOpen className="h-6 w-6 text-primary" />
                                <div>
                                    <h1 className="text-xl font-semibold">{selectedProject?.name}</h1>
                                    <p className="text-sm text-muted-foreground">{selectedProject?.path}</p>
                                </div>
                            </div>
                            {/* Search, Settings & Theme */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCommandPaletteOpen(true)}
                                    className="gap-2 text-muted-foreground"
                                    title="Search (Ctrl+K)"
                                >
                                    <Search className="h-4 w-4" />
                                    <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setHelpOpen(true)}
                                    title="Keyboard Shortcuts (?)"
                                >
                                    <Keyboard className="h-5 w-5" />
                                </Button>
                                <ThemeSelector variant="toggle" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSettingsOpen(true)}
                                    title="Settings"
                                >
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <nav className="flex gap-1 mt-4">
                            <Button
                                variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('overview')}
                                className="gap-2"
                            >
                                <FolderOpen className="h-4 w-4" />
                                Overview
                            </Button>
                            <Button
                                variant={activeTab === 'files' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('files')}
                                className="gap-2"
                            >
                                <Files className="h-4 w-4" />
                                Files
                            </Button>
                            <Button
                                variant={activeTab === 'history' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('history')}
                                className="gap-2"
                            >
                                <History className="h-4 w-4" />
                                Version History
                            </Button>
                            <Button
                                variant={activeTab === 'tasks' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('tasks')}
                                className="gap-2"
                            >
                                <CheckSquare className="h-4 w-4" />
                                Tasks
                            </Button>
                            <Button
                                variant={activeTab === 'kanban' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('kanban')}
                                className="gap-2"
                            >
                                <LayoutGrid className="h-4 w-4" />
                                Kanban
                            </Button>
                            <Button
                                variant={activeTab === 'notes' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('notes')}
                                className="gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                Notes
                            </Button>
                            <Button
                                variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('analytics')}
                                className="gap-2"
                            >
                                <BarChart3 className="h-4 w-4" />
                                Analytics
                            </Button>
                        </nav>
                    </header>

                    {/* Tab Content */}
                    <main className="flex-1 overflow-auto p-6">
                        {activeTab === 'overview' && (
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-6 rounded-xl border bg-card">
                                        <div className="text-3xl font-bold text-primary">0</div>
                                        <div className="text-sm text-muted-foreground">Tasks</div>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card">
                                        <div className="text-3xl font-bold text-green-500">0</div>
                                        <div className="text-sm text-muted-foreground">Notes</div>
                                    </div>
                                    <div className="p-6 rounded-xl border bg-card">
                                        <div className="text-3xl font-bold text-blue-500">3</div>
                                        <div className="text-sm text-muted-foreground">Snapshots</div>
                                    </div>
                                </div>

                                {selectedProject?.description && (
                                    <div className="p-6 rounded-xl border bg-card">
                                        <h2 className="font-semibold mb-2">Description</h2>
                                        <p className="text-muted-foreground">{selectedProject.description}</p>
                                    </div>
                                )}

                                <div className="p-6 rounded-xl border bg-card">
                                    <h2 className="font-semibold mb-4">Quick Actions</h2>
                                    <div className="flex gap-2">
                                        <Button onClick={() => setActiveTab('tasks')}>Create Task</Button>
                                        <Button variant="outline" onClick={() => setActiveTab('notes')}>Add Note</Button>
                                        <Button variant="outline" onClick={() => setActiveTab('history')}>View History</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'files' && selectedProject && (
                            <div className="h-full max-w-md">
                                <FileTree
                                    projectPath={selectedProject.path}
                                    selectedFile={selectedFile}
                                    onFileSelect={setSelectedFile}
                                    className="border rounded-lg bg-card"
                                />
                            </div>
                        )}

                        {activeTab === 'history' && selectedProject && (
                            <div className="h-full">
                                <UndoTree
                                    projectPath={selectedProject.path}
                                    onSelect={(snapshotId: string) => console.log('Selected snapshot:', snapshotId)}
                                    onRestore={(snapshotId: string) => console.log('Restore to snapshot:', snapshotId)}
                                />
                            </div>
                        )}

                        {activeTab === 'tasks' && selectedProject && (
                            <TaskTabContent projectId={selectedProject.id} />
                        )}

                        {activeTab === 'kanban' && selectedProject && (
                            <KanbanTabContent projectId={selectedProject.id} />
                        )}

                        {activeTab === 'notes' && selectedProject && (
                            <NotesTabContent projectId={selectedProject.id} />
                        )}

                        {activeTab === 'analytics' && (
                            <AnalyticsDashboard />
                        )}
                    </main>
                </div>
            )}

            <CreateProjectDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleProjectCreated}
            />

            <ProjectSettings
                project={settingsProject}
                open={!!settingsProject}
                onOpenChange={(open) => {
                    if (!open) setSettingsProject(null)
                }}
            />

            <SettingsPanel
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
            />

            <CommandPalette
                open={commandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
                onSelectProject={(id) => {
                    // TODO: Implement project selection from search
                    console.log('Selected project:', id)
                }}
                onSelectNote={(id) => {
                    console.log('Selected note:', id)
                }}
                onSelectTask={(id) => {
                    console.log('Selected task:', id)
                }}
                onCreateProject={() => setCreateDialogOpen(true)}
                onOpenSettings={() => setSettingsOpen(true)}
                onNavigate={(tab) => setActiveTab(tab as Tab)}
                onGoHome={() => {
                    setSelectedProject(null)
                    setView('projects')
                }}
            />

            <KeyboardShortcutsPanel
                shortcuts={DEFAULT_SHORTCUTS}
                isOpen={helpOpen}
                onClose={() => setHelpOpen(false)}
            />

            {/* First-launch Tutorial */}
            {showTutorial && (
                <InteractiveTutorial
                    steps={[
                        { id: 'welcome', title: 'Welcome to Research Manager!', description: 'This quick tutorial will show you the key features of the app.' },
                        { id: 'projects', title: 'Projects', description: 'Create and manage your research projects. Each project can contain tasks, notes, and files.' },
                        { id: 'tasks', title: 'Tasks & Kanban', description: 'Organize your work with task lists and a Kanban board for visual workflow management.' },
                        { id: 'notes', title: 'Rich Notes', description: 'Write and organize notes with a powerful rich text editor.' },
                        { id: 'history', title: 'Version History', description: 'Every change is automatically saved. View and restore previous versions anytime.' },
                        { id: 'done', title: "You're all set!", description: 'Start by creating your first project. Press Cmd+K anytime to search.' },
                    ]}
                    onComplete={() => {
                        localStorage.setItem('research-tutorial-completed', 'true')
                        setShowTutorial(false)
                    }}
                    onSkip={() => {
                        localStorage.setItem('research-tutorial-completed', 'true')
                        setShowTutorial(false)
                    }}
                    storageKey="research-tutorial-completed"
                />
            )}
        </div>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
            <ToastContainer />
        </QueryClientProvider>
    )
}

export default App
