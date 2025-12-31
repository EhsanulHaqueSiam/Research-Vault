# Research Management System - Implementation TODO

> **Production-Ready Roadmap**: Aligned with PROJECT_PLAN.md and using modern 2025 architecture with feature-based organization.

---

## ✅ Library Consistency Audit (Per PROJECT_PLAN.md)

### ✅ All Date Formatting Now Uses date-fns
| File | Line | Status |
|------|------|--------|
| `core/services/git/autoCommitService.ts` | 207 | ✅ Fixed: `format(new Date(), 'h:mm a')` |
| `features/git-history/components/UndoTree.tsx` | 189 | ✅ Fixed: `format(new Date(), 'h:mm a')` |
| `features/tasks/components/TaskForm.tsx` | 78 | ✅ Fixed: `formatDateForInput()` |
| `shared/utils/date.ts` | - | ✅ Created: centralized date-fns utilities |

### ✅ KanbanBoard: Migrated to @dnd-kit
| File | Status |
|------|--------|
| `features/tasks/components/KanbanBoard.tsx` | ✅ Fixed: Uses @dnd-kit/core + @dnd-kit/sortable |

### ✅ Verified: No Alternative Libraries Found
- ❌ No moment/dayjs (using date-fns) ✓
- ❌ No axios (using TanStack Query) ✓
- ❌ No lodash ✓
- ❌ No formik/yup (using React Hook Form + Zod) ✓
- ❌ No react-beautiful-dnd (using native DnD) ✓
- ❌ No react-spring (using framer-motion/motion) ✓

---


## ✅ Phase 1: Project Setup & Foundation (COMPLETE)

### Environment Setup ✓
- [x] Install Node.js 25+ and verify version
- [x] Install Rust 1.92+ stable toolchain
- [x] Install pnpm 10+ globally
- [x] Set up Git and configure user info

### Project Initialization ✓
- [x] Create Tauri + React project
- [x] Configure TypeScript strict mode
- [x] Initialize with pnpm
- [x] Verify dev server runs

### Modern UI Stack (2025) ✓
- [x] **REMOVED** Fluent UI (deprecated, heavy)
- [x] **ADDED** shadcn/ui architecture (Radix UI + Tailwind v4)
- [x] Install 17 Radix UI primitives
- [x] Install styling utilities (CVA, clsx, tailwind-merge)
- [x] Install Radix Colors design system
- [x] Configure Tailwind CSS v4 with modern design tokens
- [x] Install Framer Motion → **Motion** (lightweight version)
- [x] Install animation utilities (tailwindcss-animate)

### Icon Libraries (15,000+ Icons) ✓
- [x] Lucide React (1,450+ icons) - Primary
- [x] Tabler Icons (5,900+ icons)
- [x] Heroicons (450+ icons)
- [x] Iconoir (1,500+ icons)
- [x] Phosphor Icons (7,000+ icons)

### Typography & Fonts ✓
- [x] Install Inter Variable (primary UI font)
- [x] Install Geist Mono (monospace font)
- [x] Configure font system in Tailwind

### State Management ✓
- [x] Install Zustand v5.0.9
- [x] Install TanStack Query v5.90.16
- [x] Install TanStack Router v1.144.0
- [x] Install React Hook Form v7.69.0
- [x] Install Zod v4.2.1

### Database & ORM ✓
- [x] Install Drizzle ORM v0.45.1
- [x] Install Better SQLite3 v12.5.0
- [x] Install IndexedDB (idb) v8.0.3
- [x] Install @tauri-apps/plugin-sql
- [x] Install drizzle-kit (dev)
- [x] Create drizzle.config.ts

### Git & Version Control ✓
- [x] Install isomorphic-git v1.36.1
- [x] Install diff v8.0.2
- [x] Install react-diff-view v3.3.2

### Rich Text Editor ✓
- [x] Install Tiptap React v3.14.0
- [x] Install Starter Kit
- [x] Install Code Block with Lowlight
- [x] Install Link, Image, Table extensions
- [x] Install lowlight v3.3.0

### Search & Utilities ✓
- [x] Install Fuse.js v7.1.0
- [x] Install Flexsearch v0.8.212
- [x] Install Compromise v14.14.5
- [x] Install cmdk v1.0.4
- [x] Install UUID, date-fns, pathe, jszip, pako

### User Interaction ✓
- [x] Install DnD Kit (Core, Sortable, Utilities)
- [x] Install sonner (toast notifications)
- [x] Install Radix UI components (already included)

### Advanced Components ✓
- [x] Install Vaul (modern drawers)
- [x] Install Embla Carousel
- [x] Install Motion (animations)

### Developer Tools ✓
- [x] Install ESLint v9.39.2
- [x] Install Prettier v3.0.0
- [x] Install Husky v9.0.0
- [x] Install Commitlint
- [x] Install TypeScript v5.9.3
- [x] Install Vitest v4.0.16 + Testing Library
- [x] Create .eslintrc.json
- [x] Create .prettierrc
- [x] Create .commitlintrc.json
- [x] Setup Git hooks
- [x] Initialize Git repository

### Professional Project Structure ✓
- [x] Create feature-based organization:
  ```
  src/
  ├── features/          # Feature modules (projects, tasks, notes)
  ├── shared/            # Shared components/utils
  ├── core/              # IPC, database, services
  └── config/            # Configuration
  ```
- [x] Create projects feature structure
- [x] Create tasks feature structure
- [x] Create notes feature structure
- [x] Create shared UI components folder
- [x] Create core API folder
- [x] Create public API pattern (index.ts exports)

### Professional Documentation ✓
- [x] Create ARCHITECTURE.md (design patterns, best practices)
- [x] Create CONTRIBUTING.md (development guidelines)
- [x] Create README.md (project overview)
- [x] Write inline code documentation

### Type Safety & Architecture ✓
- [x] Create Tauri IPC client wrapper (`core/api/tauri-client.ts`)
- [x] Create Project types (`features/projects/types/`)
- [x] Create Rust error types (`src-tauri/src/error.rs`)
- [x] Configure TypeScript strict mode
- [x] Verify type checking passes

### Rust Backend Structure ✓
- [x] Create commands folder
- [x] Create services folder
- [x] Create error.rs with proper error types
- [x] Create professional error handling

### Configuration Files ✓
- [x] tailwind.config.ts - Modern design system
- [x] postcss.config.js - Tailwind v4 compatible
- [x] drizzle.config.ts - Drizzle ORM
- [x] vitest.config.ts - Testing setup
- [x] vite.config.ts - Build optimization
- [x] tsconfig.json - TypeScript with path aliases
- [x] package.json - All scripts configured

### Verification ✓
- [x] TypeScript compilation passes
- [x] Dev server runs without errors
- [x] No deprecated dependencies
- [x] All 861 packages resolved

---

## 📂 Phase 2: Core Data Models & Repository Pattern

### Database Schema Design
- [x] Define `projects` table with Drizzle (9 columns)
- [x] Define `tasks` table with parent-child relationships (13 columns)
- [x] Define `notes` table (8 columns)
- [x] Define `tags` table and junction tables
- [x] Define `file_metadata` table
- [x] Generate and run migrations (0000_friendly_tag.sql, 0001_faulty_saracen.sql, 0002_freezing_killer_shrike.sql)

### Implement Repository Pattern
- [x] Create `core/database/repositories/base.repository.ts`
- [x] Implement `ProjectRepository`:
  - [x] `findAll()` - get all projects
  - [x] `findById(id)` - get single project
  - [x] `findByPath(path)` - find by path
  - [x] `create(project)` - create new
  - [x] `update(id, data)` - update project
  - [x] `delete(id)` - soft delete
  - [x] `hardDelete(id)` - permanent delete
  - [x] `search(query)` - search projects
  - [x] `findByStatus(status)` - filter by status
- [x] Implement `TaskRepository`
  - [x] `findAll()`, `findById()` - basic CRUD
  - [x] `findByProjectId()` - project tasks
  - [x] `findRootTasks()`, `findSubtasks()` - hierarchy
  - [x] `findByStatus()`, `findByPriority()` - filters
  - [x] `create()`, `update()`, `delete()` - mutations
  - [x] `search()`, `moveTask()`, `reorder()` - utilities
  - [x] `getHierarchy()` - recursive tree
- [x] Implement `NoteRepository`
  - [x] `findAll()`, `findById()` - basic CRUD
  - [x] `findByProjectId()`, `findPinned()` - queries
  - [x] `findByTags()`, `findRecent()` - filters
  - [x] `create()`, `update()`, `delete()` - mutations
  - [x] `search()`, `togglePin()`, `duplicate()` - utilities
  - [x] `getAllTags()` - tag management
- [x] Add Zod validation schemas
  - [x] TaskSchema, CreateTaskDtoSchema, UpdateTaskDtoSchema
  - [x] NoteSchema, CreateNoteDtoSchema, UpdateNoteDtoSchema
  - [x] Filter schemas for queries
  - [x] ProjectSchema, ResearchMetadataSchema
- [x] Add error handling with retry logic (`lib/errors.ts`)
  - [x] Custom error classes (AppError, ValidationError, NotFoundError, etc.)
  - [x] Retry logic with exponential backoff
  - [x] Result type for functional error handling
  - [x] Error formatting utilities

### Service Layer
- [x] Create `features/projects/services/project.service.ts`
  - [x] CRUD operations with validation
  - [x] Template support (5 built-in templates)
  - [x] Statistics and filtering
  - [x] Tag management
  - [x] research.json metadata utilities
- [x] Create `features/tasks/services/task.service.ts`
  - [x] CRUD operations with validation
  - [x] Hierarchy management (subtasks, move, reorder)
  - [x] Statistics and filtering
  - [x] Bulk operations
- [x] Create `features/notes/services/note.service.ts`
  - [x] CRUD operations with validation
  - [x] Template support (meeting notes, literature review)
  - [x] Tag management
  - [x] Pin/unpin functionality
- [x] Add validation and error handling
- [x] Create service tests
  - [x] Project service tests (13 tests)
  - [x] Task service tests (9 tests)
  - [x] Note service tests (17 tests)
  - [x] Error utilities tests (21 tests)

### Portable Metadata System
- [x] Design `research.json` schema (ResearchMetadataSchema)
  - [x] Version, title, description
  - [x] Team members with roles
  - [x] Settings (auto-commit, backup)
  - [x] Statistics tracking
- [x] Create metadata read/write service (`core/services/metadata.service.ts`)
  - [x] MetadataService class with caching
  - [x] Initialize, load, save operations
  - [x] Update methods for all fields
  - [x] Validation and parsing
- [x] MetadataSyncService for DB ↔ file sync (structure ready, implementation TODO)
- [x] Add validation with Zod

### Tauri Commands (Rust)
- [x] Create `project_commands.rs` with CRUD operations
- [x] Create `task_commands.rs`:
  - [x] `create_task`, `list_tasks`, `get_task`
  - [x] `update_task`, `delete_task`
  - [x] `list_root_tasks`, `list_subtasks`, `get_task_hierarchy`
  - [x] `move_task`, `reorder_task`
  - [x] `list_tasks_by_status`, `search_tasks`
- [x] Create `note_commands.rs`:
  - [x] `create_note`, `list_notes`, `get_note`
  - [x] `update_note`, `delete_note`
  - [x] `list_pinned_notes`, `list_recent_notes`
  - [x] `toggle_note_pin`, `duplicate_note`
  - [x] `search_notes`, `get_note_tags`, `list_notes_by_tags`
- [x] Create TaskService and NoteService (Rust backend)
- [x] Create Task and Note models/DTOs (Rust)
- [x] Wire up Tauri main.rs to register commands
  - [x] Created `main.rs` with all command handlers registered
  - [x] Created `lib.rs` for library exports
  - [x] Created `Cargo.toml` with Tauri 2.0 + SQLite dependencies
  - [x] Created `tauri.conf.json` configuration
- [x] Connect commands to SQLite database
  - [x] Created `DbService` with SQLite CRUD operations
  - [x] Created `AppState` with connection management
  - [x] Embedded migrations for all tables

---

## ✅ Phase 3: Project Management UI (COMPLETE)

### Frontend Components ✓
- [x] Create `ProjectList.tsx` (250 lines, grid/list view, search, filters)
- [x] Create `ProjectCard.tsx` (185 lines, status, tags, actions menu)
- [x] Create `CreateProjectDialog.tsx` (358 lines, multi-step wizard)
- [x] Create `ProjectSettings.tsx` (302 lines, tabs for all settings)
- [x] Add project search and filters

### Hooks ✓
- [x] Create `useProjects()` hook with TanStack Query
- [x] Create `useProject(id)` hook
- [x] Create `useCreateProject()` mutation
- [x] Create `useUpdateProject()` mutation
- [x] Additional hooks: `useArchiveProject`, `useDeleteProject`, `useAddProjectTag`, `useRemoveProjectTag`, `useTouchProject`

### Project Templates ✓
- [x] Design template structure (ProjectTemplate interface)
- [x] Create built-in templates (5 templates in `builtInProjectTemplates`):
  - [x] Literature Review
  - [x] Data Analysis
  - [x] Thesis/Dissertation
  - [x] Grant Proposal
  - [x] Lab Experiment
- [x] Implement template application (`useCreateProjectFromTemplate`)


---

## ✅ Phase 4: Git Abstraction & Auto-Commit (COMPLETE)

### Git Service Layer ✓
- [x] Create `services/git/gitService.ts` (447 lines):
  - [x] `initVersion(path)` - Initialize Git repository
  - [x] `saveSnapshot(message)` - Stage all + commit
  - [x] `getHistory()` - Get commit history
  - [x] `restoreToPoint(sha)` - Checkout commit
  - [x] `getChanges(sha1, sha2)` - Get diff between commits
- [x] Hide Git terminology (Snapshot, Restore Point vs Commit, Checkout)
- [x] User-friendly error messages via `GitOperationError`

### Auto-Commit System ✓
- [x] Create `services/git/autoCommitService.ts` (340 lines):
  - [x] Debounced auto-commit (configurable, default 3s)
  - [x] Generate descriptive commit messages
  - [x] Skip empty commits
  - [x] Event system for commit notifications
  - [x] Start/stop watching controls

### History Service ✓
- [x] Create `services/git/historyService.ts` (280 lines):
  - [x] Parse Git log into tree structure (`HistoryNode`)
  - [x] Calculate parent-child relationships
  - [x] Detect branch points
  - [x] Cache with configurable expiry

### Diff Service ✓
- [x] Create `services/git/diffService.ts` (275 lines):
  - [x] Line, word, and character diffs
  - [x] Binary file detection
  - [x] Format for react-diff-view
  - [x] Unified diff format

### React Hooks ✓
- [x] Create `hooks/useGit.ts` (300 lines):
  - [x] `useGitStatus()` - Repository status with polling
  - [x] `useGitHistory()` - Commit history
  - [x] `useGitTree()` - Tree structure for visual undo
  - [x] `useSaveSnapshot()` - Manual commit mutation
  - [x] `useRestoreSnapshot()` - Restore mutation
  - [x] `useAutoCommit()` - Auto-commit controls
  - [x] `useProjectGit()` - All-in-one hook


---

## ✅ Phase 5: Visual Undo Tree (COMPLETE)

### Setup ✓
- [x] Install @xyflow/react v12.10.0

### Undo Tree Component ✓
- [x] Create `UndoTree.tsx` with React Flow (265 lines)
- [x] Create `SnapshotNode.tsx` custom node (155 lines)
- [x] Create `TreeControls.tsx` zoom/pan controls (115 lines)
- [x] Create `PreviewPanel.tsx` snapshot details (165 lines)
- [x] Create `types.ts` shared types (70 lines)
- [x] Minimap included
- [x] Vertical timeline layout with branch visualization

### Interactions ✓
- [x] Node click to select snapshot
- [x] Preview panel shows details + changed files
- [x] "Restore to this point" button
- [x] "Create Checkpoint" manual save
- [x] Search/filter history by message

### Features ✓
- [x] Branch point detection from HistoryNode
- [x] Visualize branches as forks (column-based layout)
- [x] Current HEAD indicator (green badge)
- [x] Relative timestamps ("2h ago")
- [x] File count badges


---

## ✅ Phase 6: Diff Viewer (COMPLETE)

### Diff Service ✓
- [x] `core/services/git/diffService.ts` (from Phase 4)
- [x] Text diff for code/text files
- [x] Binary diff detection
- [x] Diff statistics
- [x] react-diff-view format conversion

### Diff Viewer UI ✓
- [x] Create `DiffViewer.tsx` (130 lines) - Main container
- [x] Create `DiffHeader.tsx` (95 lines) - File path, stats, view toggle
- [x] Create `DiffContent.tsx` (135 lines) - react-diff-view rendering
- [x] Create `DiffNavigation.tsx` (50 lines) - prev/next change navigation
- [x] Side-by-side view (split mode)
- [x] Unified view
- [x] View mode toggle buttons

### Image Comparison ✓
- [x] Create `ImageDiff.tsx` (200 lines)
- [x] Slider comparison mode
- [x] Side-by-side mode
- [x] Onion overlay mode

---

## ✅ Phase 7: Task Management (COMPLETE)

### Task Components ✓
- [x] Create `TaskCard.tsx` (230 lines) - Priority badges, status icons, due dates
- [x] Create `TaskForm.tsx` (250 lines) - Create/edit dialog, priority buttons, tags
- [x] Create `TaskList.tsx` (300 lines) - Search, filters, sorting, list/grouped views
- [x] Create `KanbanBoard.tsx` (220 lines) - Drag-and-drop columns
- [x] Create `useTasks.ts` (250 lines) - TanStack Query hooks

### Task Features ✓
- [x] Hierarchical subtasks with progress bars
- [x] Progress calculation (X/Y completed)
- [x] Priority levels (low/medium/high) with color badges
- [x] Due dates with overdue warnings
- [x] Status cycling (todo → in_progress → done)
- [x] Tag system
- [x] Drag-and-drop kanban columns

---

## ✅ Phase 8: Rich Text Editor (COMPLETE)

### Notes Editor ✓
- [x] Create `NoteEditor.tsx` with Tiptap
- [x] Build editor toolbar (`EditorToolbar.tsx`)
- [x] Implement auto-save (debounced 3s)
- [x] Add formatting options (bold, italic, headings, lists)
- [x] Images (via URL)
- [x] Tables (with resizable columns)
- [x] Code blocks with syntax highlighting (lowlight)

### Notes Management ✓
- [x] Create `NotesList.tsx` (grid/list view, search, filters)
- [x] Note search and filtering (by tags, sort options)
- [x] Tag system
- [x] Note templates (`NoteTemplateSelector.tsx`)
- [x] Export (Markdown - via NoteService.exportAsMarkdown)

### TanStack Query Hooks ✓
- [x] Create `useNotes.ts` with 15+ hooks
- [x] `useProjectNotes()` combined hook

### Custom Extensions ✓

#### Note Editor Extensions
- [x] Math equations extension (LaTeX/KaTeX)
- [x] Diagram extension (Mermaid integration)
- [x] Mention extension (@user, @project, !task)
- [x] Citation extension (academic reference linking)
- [x] File attachment extension (embed PDFs, files)
- [x] Highlight/annotation extension

#### Software Plugin Architecture ✓
- [x] Plugin types and interfaces (`plugin.types.ts`)
- [x] Plugin manifest format (Zod validated)
- [x] Plugin loader and lifecycle management
- [x] Plugin registry store (Zustand)
- [x] Plugin hooks for:
  - [x] Custom sidebar panels
  - [x] Custom toolbar actions
  - [x] Custom project templates
  - [x] Custom note templates
  - [x] Custom export formats
  - [x] Custom search providers
  - [x] Custom editor extensions
- [x] Plugin registry UI
- [x] Plugin settings page
- [x] Plugin development SDK

---

## 🔎 Phase 9: Universal Search ✓

### Search Implementation ✓
- [x] Create search indexing service (Fuse.js)
- [x] Index projects, notes, tasks
- [x] Fuzzy search with result ranking
- [x] Use Web Worker for search indexing

### Command Palette ✓
- [x] Create `CommandPalette.tsx` with cmdk
- [x] Fuzzy search across all content
- [x] Keyboard shortcuts (Cmd+K)
- [x] Result grouping
- [x] Quick actions menu

### Hooks ✓
- [x] `useSearch.ts` - React hook for search
- [x] `useSearchIndex.ts` - Index registration
- [x] `useCommandPalette.ts` - State management

### Natural Language ✓
- [x] Date parsing ("last week", "yesterday")
- [x] Special filters (type:, tag:, after:)
- [x] Smart suggestions

### Quick Access ✓
- [x] Recent files panel
- [x] Favorites/bookmarks
- [x] Frequently used collections
- [x] Breadcrumbs navigation

---

## 📊 Phase 10: Analytics & Progress ✓

### Install Charting Libraries ✓
- [x] Install recharts

### Dashboard ✓
- [x] Create `Dashboard.tsx`
- [x] Summary cards
- [x] Activity graph (line chart)
- [x] Progress metrics

### Visualizations ✓
- [x] Task completion charts (bar chart)
- [x] Task status pie chart
- [x] Calendar heatmap
- [x] Time tracking
- [x] Milestone tracker

### Analytics Service ✓
- [x] Create `analytics.service.ts`
- [x] Dashboard statistics API
- [x] Activity data generation
- [x] Task completion metrics

---

## ☁️ Phase 11: Backup & Export ✓

### Backup System ✓
- [x] Create `BackupService.ts`
- [x] ZIP entire project (JSZip)
- [x] Verify integrity
- [x] Progress indicator

### Backup UI ✓
- [x] Create `BackupManager.tsx`
- [x] Create/restore actions
- [x] Progress feedback

### Disaster Recovery ✓
- [x] `useAutoBackup` hook
- [x] `useBackupBeforeUpdate` hook

---

## 🤝 Phase 12: Local Collaboration ✓

### Comments & Activity ✓
- [x] Comments types and data model
- [x] CommentThread component (threaded replies)
- [x] Activity types
- [x] ActivityTimeline component

---

## 🎓 Phase 13: Help & Onboarding ✓

### Interactive Tutorial ✓
- [x] InteractiveTutorial component
- [x] Spotlight overlay
- [x] Step navigation

### Help System ✓
- [x] KeyboardShortcutsPanel component
- [x] Default shortcuts list

---

## 🚀 Phase 14: Polish & Performance

### Performance Optimization ✓
- [x] Code splitting (`lazyLoad.tsx`)
- [x] Lazy loading utilities
- [x] Virtualization (`VirtualizedList.tsx`)

### UX Polish ✓
- [x] Loading states (`LoadingStates.tsx`)
- [x] Empty states (`EmptyStates.tsx`)
- [x] Error boundary (`ErrorBoundary.tsx`)
- [x] Skeleton loaders

### Testing ✓
- [x] Unit tests for services (`backup.service.test.ts`)
- [x] Integration tests (existing: database, fileSystem, git)
- [x] E2E tests setup (Playwright page objects)

---

## 📦 Phase 15: Packaging & Distribution

### Build Configuration ✓
- [x] Tauri config exists (`tauri.conf.json`)
- [x] Bundle targets configured (all platforms)
- [x] Icon paths configured
- [x] Code signing config (ready for signing)
- [x] Auto-updater setup (`updater` plugin configured)

### Documentation
- [ ] User manual
- [ ] API documentation
- [ ] Release notes
- [ ] Changelog

### Distribution
- [ ] GitHub Releases
- [ ] Update server
- [ ] Crash reporting
- [ ] Analytics (optional, privacy-first)

---

## Phase Organization Notes

- **Phase 1-8** ✅: Foundation, Data Layer, UI, Git, Tasks, Editor
- **Phase 9-10** ✅: Universal Search, Analytics
- **Phase 11-12** ✅: Backup, Collaboration
- **Phase 13-14** ✅: Help/Onboarding, Polish/Performance
- **Phase 15**: Packaging (Tauri config ready, distribution pending)

**Current Status**: ✅ Phases 1-14 Complete! Ready for production builds.
