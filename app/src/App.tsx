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
import { AppLayout } from '@/components/layout/AppLayout'
import { SidebarView } from '@/components/layout/Sidebar'
import { ArrowLeft, History, CheckSquare, FileText, Settings, LayoutGrid, Search, BarChart3, Files, BookOpen } from 'lucide-react'
import type { Project } from '@/features/projects'
import type { Note } from '@/features/notes/types/note.types'

// Research Features
import { LiteratureReview, MindMap, ResearchSections, ResearchSection } from '@/features/research'

// Create a query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
})

type Tab = 'overview' | 'files' | 'history' | 'tasks' | 'kanban' | 'notes' | 'research' | 'analytics'

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
        remove,
        togglePin,
    } = useProjectNotes(projectId)

    const handleCreateNote = () => {
        create({
            projectId,
            title: 'Untitled Note',
            content: '',
            isPinned: false
        })
    }

    const handleEditNote = (note: Note) => {
        setSelectedNote(note)
    }

    const handleBackToList = () => {
        setSelectedNote(null)
    }

    const handleContentChange = (content: string) => {
        if (selectedNote) {
            update(selectedNote.id, { content })
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
            <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="sm" onClick={handleBackToList}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Notes
                    </Button>
                </div>
                <div className="flex-1 border rounded-lg overflow-hidden bg-background">
                    <NoteEditor
                        content={selectedNote.content || ''}
                        title={selectedNote.title}
                        onContentChange={handleContentChange}
                        onTitleChange={handleTitleChange}
                        readOnly={false}
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
        isUpdating
    } = useProjectTasks(projectId)

    return (
        <KanbanBoard
            projectId={projectId}
            tasks={tasks}
            onCreateTask={create}
            onUpdateTask={update}
            onDeleteTask={remove}
            isLoading={isUpdating}
        />
    )
}

/**
 * Research Tab Content
 */
function ResearchTabContent({ projectId }: { projectId: string }) {
    const [activeSection, setActiveSection] = useState<ResearchSection | null>(null)

    if (activeSection === 'literature-review') {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Research
                    </Button>
                </div>
                <LiteratureReview projectId={projectId} />
            </div>
        )
    }

    if (activeSection === 'mind-map') {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Research
                    </Button>
                </div>
                <MindMap projectId={projectId} />
            </div>
        )
    }

    return (
        <ResearchSections
            projectId={projectId}
            onSelectSection={setActiveSection}
            sectionCounts={{
                'literature-review': 0,
                'mind-map': 0,
                'methodology': 0,
                'data-collection': 0,
                'findings': 0,
                'references': 0,
            }}
        />
    )
}

function AppContent() {
    const [sidebarView, setSidebarView] = useState<SidebarView>('projects')
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [settingsProject, setSettingsProject] = useState<Project | null>(null)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
    const [helpOpen, setHelpOpen] = useState(false)
    const [_selectedFile, setSelectedFile] = useState<string | null>(null)

    // Sync sidebar selection with active view
    useEffect(() => {
        if (selectedProject) {
            // When a project is selected, we are effectively in "project view" 
            // but the sidebar might show 'projects' as active
        } else {
            // Check mapping between sidebar view and content
            if (sidebarView === 'settings') {
                setSettingsOpen(true)
            } else if (sidebarView === 'help') {
                setHelpOpen(true)
            }
        }
    }, [sidebarView, selectedProject])

    // Tutorial state - show on first launch
    const [showTutorial, setShowTutorial] = useState(() => {
        return localStorage.getItem('research-tutorial-completed') !== 'true'
    })

    // Auto-commit hook - always called (hooks must be unconditional)
    // Uses project path when available, empty string otherwise
    const autoCommit = useAutoCommit(selectedProject?.path ?? '')

    // Start auto-commit watching when project opens
    useEffect(() => {
        if (selectedProject && autoCommit) {
            autoCommit.start()
        }
        return () => {
            if (autoCommit?.isWatching) {
                autoCommit.stop()
            }
        }
    }, [selectedProject?.id, autoCommit])

    const handleOpenProject = (project: Project) => {
        setSelectedProject(project)
        setActiveTab('overview')
    }

    const handleBackToProjects = () => {
        setSelectedProject(null)
        setSidebarView('projects')
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

    // Keyboard shortcuts
    const handleCommandPalette = () => setCommandPaletteOpen(true)

    // Render logic based on view state
    const renderMainContent = () => {
        // 1. Project Detail View
        if (selectedProject) {
            return (
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Project Header */}
                    <div className="border-b bg-card px-6 py-4 flex flex-col gap-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBackToProjects}
                                    title="Back to Projects"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        <Breadcrumb
                                            items={[
                                                { label: 'Projects', onClick: handleBackToProjects },
                                                { label: selectedProject.name }
                                            ]}
                                        />
                                    </div>
                                    <h1 className="text-2xl font-bold flex items-center gap-2">
                                        {selectedProject.name}
                                        {/* Status badge could go here */}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleProjectSettings(selectedProject)}
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Project Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-1">
                            {[
                                { id: 'overview', icon: LayoutGrid, label: 'Overview' },
                                { id: 'research', icon: BookOpen, label: 'Research' },
                                { id: 'files', icon: Files, label: 'Files' },
                                { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
                                { id: 'kanban', icon: LayoutGrid, label: 'Board' },
                                { id: 'notes', icon: FileText, label: 'Notes' },
                                { id: 'history', icon: History, label: 'History' },
                                { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                            ].map(tab => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as Tab)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }
                                        `}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-background">
                        {activeTab === 'overview' && (
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Tasks</h3>
                                        <div className="text-2xl font-bold">12</div>
                                        <div className="text-xs text-muted-foreground mt-1">4 pending</div>
                                    </div>
                                    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Documents</h3>
                                        <div className="text-2xl font-bold">24</div>
                                        <div className="text-xs text-muted-foreground mt-1">Last edited 2h ago</div>
                                    </div>
                                    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Research Items</h3>
                                        <div className="text-2xl font-bold">8</div>
                                        <div className="text-xs text-muted-foreground mt-1">3 new papers</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[400px]">
                                    <div className="border rounded-lg p-6 bg-card h-full overflow-hidden flex flex-col">
                                        <h3 className="font-semibold mb-4">Recent Activity</h3>
                                        {/* Activity timeline placeholder */}
                                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                            Activity Timeline
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-6 bg-card h-full overflow-hidden flex flex-col">
                                        <h3 className="font-semibold mb-4">Project Progress</h3>
                                        <AnalyticsDashboard />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'research' && (
                            <div className="h-full">
                                <ResearchTabContent projectId={selectedProject.id} />
                            </div>
                        )}

                        {activeTab === 'files' && (
                            <div className="h-full border rounded-lg overflow-hidden bg-card">
                                <FileTree
                                    projectPath={selectedProject.path}
                                    onFileSelect={setSelectedFile}
                                />
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="h-full border rounded-lg overflow-hidden bg-card">
                                <UndoTree
                                    projectPath={selectedProject.path}
                                />
                            </div>
                        )}

                        {activeTab === 'tasks' && <TaskTabContent projectId={selectedProject.id} />}

                        {activeTab === 'kanban' && <KanbanTabContent projectId={selectedProject.id} />}

                        {activeTab === 'notes' && <NotesTabContent projectId={selectedProject.id} />}

                        {activeTab === 'analytics' && (
                            <AnalyticsDashboard />
                        )}
                    </div>
                </div>
            )
        }

        // 2. Global Views based on Sidebar selection
        if (sidebarView === 'analytics') {
            return (
                <div className="p-6 h-full overflow-auto">
                    <h1 className="text-2xl font-bold mb-6">Global Analytics</h1>
                    <AnalyticsDashboard />
                </div>
            )
        }

        // 3. Default: Projects List View
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold">Research Manager</h1>
                        <p className="text-muted-foreground">Manage your research projects</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleCommandPalette}
                            variant="outline"
                            className="mr-2"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Search... (Cmd+K)
                        </Button>
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            Create Project
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ProjectList
                        onCreateProject={() => setCreateDialogOpen(true)}
                        onOpenProject={handleOpenProject}
                        onArchiveProject={handleArchiveProject}
                        onDeleteProject={handleDeleteProject}
                        onProjectSettings={handleProjectSettings}
                    />
                </div>
            </div>
        )
    }

    return (
        <AppLayout
            currentView={sidebarView}
            onViewChange={(view) => {
                setSidebarView(view)
                // Reset selected project if navigating away from project
                if (view !== 'projects' && view !== 'home') {
                    setSelectedProject(null)
                }
            }}
        >
            {renderMainContent()}

            {/* Dialogs & Overlays */}
            <CreateProjectDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleProjectCreated}
            />

            {settingsProject && (
                <ProjectSettings
                    project={settingsProject}
                    open={!!settingsProject}
                    onOpenChange={(open) => !open && setSettingsProject(null)}
                />
            )}

            <SettingsPanel
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
            />

            <ThemeSelector />

            <CommandPalette
                open={commandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
                onSelectProject={(id) => console.log('Selected project:', id)}
                onSelectNote={(id) => {
                    console.log('Selected note:', id)
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

            <ToastContainer />
        </AppLayout>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
        </QueryClientProvider>
    )
}

export default App
