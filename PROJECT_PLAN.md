# Research Management System - Full Project Plan

## Overview

A desktop GUI application for non-technical researchers to manage projects with visual undo/version control.

---

## Technology Stack

### Core Framework
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Backend | **Tauri** | 2.x | Native desktop framework with Rust backend |
| Frontend | **React** | 18.x | UI framework with TypeScript |
| Build Tool | **Vite** | 5.x | Fast development and build tooling |
| Language | **TypeScript** | 5.x | Type safety and better DX |
| Package Manager | **pnpm** | 9.x | Fast, efficient package management |

### UI & Styling (2025 Modern Stack)
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Component Architecture | **shadcn/ui** | Latest | Copy-paste component system (not a library) |
| UI Primitives | **Radix UI** | Latest | 17+ accessible, unstyled primitives |
| Utility CSS | **Tailwind CSS** | 4.x | Modern utility-first styling |
| Styling Utilities | **CVA** | 0.7.x | Component variant management |
| Class Merging | **tailwind-merge + clsx** | Latest | Intelligent class name merging |
| Animations | **Motion** | 12.x | Lightweight Framer Motion (tree-shakeable) |
| Advanced Animations | **tailwindcss-animate** | 1.x | Built-in animation utilities |
| Color System | **Radix Colors** | 3.x | Professional, accessible color scales |
| Typography | **Inter Variable** | 5.x | Modern variable font (industry standard) |
| Monospace Font | **Geist Mono** | 5.x | Modern terminal/code font |
| Icons (Primary) | **Lucide React** | Latest | 1,450+ modern icons |
| Icons (Extended) | **Tabler Icons** | 3.x | 5,900+ pixel-perfect icons |
| Icons (Tailwind) | **Heroicons** | 2.x | 450+ Tailwind-optimized icons |
| Icons (Stroke) | **Iconoir** | 7.x | 1,500+ stroke-style UI icons |
| Icons (Multi-weight) | **Phosphor Icons** | 2.x | 7,000+ multi-weight icons |
| Drawers/Sheets | **Vaul** | 1.x | Modern drawer component |
| Carousel | **Embla Carousel** | 8.x | Performant carousel library |

### State Management & Data Flow
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Global State | **Zustand** | 4.x | Lightweight, simple state management |
| Server State | **TanStack Query** | 5.x | Async state, caching, synchronization |
| Form State | **React Hook Form** | 7.x | Performant form handling |
| Routing | **TanStack Router** | Latest | Type-safe routing with code splitting |

### Database & Storage
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Database | **SQLite** | Latest | Embedded, serverless database |
| ORM | **Drizzle ORM** | Latest | Type-safe SQL with migrations |
| Tauri Plugin | **tauri-plugin-sql** | 2.x | SQLite integration for Tauri |
| IndexedDB | **idb** | 8.x | Browser storage for temp data |
| Encryption | **better-sqlite3-multiple-ciphers** | Latest | Data encryption at rest |

### Version Control & Git
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Git Engine | **isomorphic-git** | Latest | Pure JavaScript Git implementation |
| Git Backend | **tauri-plugin-shell** | 2.x | Shell access for native Git commands |
| Diff Library | **diff** | 5.x | Text diffing algorithm |
| Diff UI | **react-diff-view** | 3.x | Beautiful diff visualization |

### Rich Text & Media
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Editor | **Tiptap** | 3.x | Headless rich text editor |
| Starter Kit | **@tiptap/starter-kit** | 3.x | Essential Tiptap extensions |
| Code Blocks | **@tiptap/extension-code-block-lowlight** | 3.x | Syntax highlighting |
| Links | **@tiptap/extension-link** | 3.x | Rich link support |
| Images | **@tiptap/extension-image** | 3.x | Image embedding |
| Tables | **@tiptap/extension-table** (+row/cell/header) | 3.x | Full table support |
| Syntax Highlighter | **lowlight** | 3.x | Highlight.js wrapper |

### Visualization & Diagrams
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Flow Diagrams | **@xyflow/react** (React Flow) | 12.x | Interactive node graphs for undo tree |
| Charts | **recharts** | 2.x | Analytics and progress charts |
| Calendar | **react-big-calendar** | 1.x | Calendar view for timeline |
| Timeline | **vis-timeline** | 7.x | Visual timeline component  |

### User Interaction
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Command Palette | **cmdk** | Latest | Universal search interface |
| Notifications | **sonner** | Latest | Beautiful toast notifications |
| Drag & Drop | **@dnd-kit/core** | 6.x | Accessible drag and drop |
| Modals | **@radix-ui/react-dialog** | Latest | Accessible modal dialogs |
| Tooltips | **@radix-ui/react-tooltip** | Latest | Accessible tooltips |
| Context Menus | **@radix-ui/react-context-menu** | Latest | Right-click menus |
| Dropdown | **@radix-ui/react-dropdown-menu** | Latest | Accessible dropdowns |

### File System & System Integration
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| File Watching | **tauri-plugin-fs-watch** | 2.x | Monitor file system changes |
| File Operations | **@tauri-apps/plugin-fs** | 2.x | File system access |
| Dialog | **@tauri-apps/plugin-dialog** | 2.x | Native file pickers |
| Clipboard | **@tauri-apps/plugin-clipboard** | 2.x | Clipboard access |
| Notifications | **@tauri-apps/plugin-notification** | 2.x | Native notifications |
| Terminal | **xterm** | 5.x | Embedded terminal emulator |
| Terminal Addons | **xterm-addon-fit** | Latest | Terminal auto-sizing |

### Validation & Type Safety
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Schema Validation | **Zod** | 3.x | Runtime type validation |
| Date Handling | **date-fns** | 3.x | Date manipulation and formatting |
| UUID Generation | **uuid** | 10.x | Unique ID generation |
| Path Handling | **pathe** | 1.x | Cross-platform path utilities |

### Search & Indexing
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Full-Text Search | **fuse.js** | 7.x | Fuzzy search client-side |
| Document Search | **flexsearch** | 0.7.x | High-performance indexing |
| Natural Language | **compromise** | 14.x | Natural language date parsing |

### Voice & Accessibility
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Voice Recording | **Web Audio API** | Native | Browser voice recording |
| Speech Recognition | **Web Speech API** | Native | Voice commands |
| Text-to-Speech | **Web Speech API** | Native | Read aloud functionality |
| Screen Reader | **aria-live** regions | Native | Accessibility announcements |

### Backup & Compression
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| ZIP Creation | **jszip** | 3.x | Create ZIP archives |
| Compression | **pako** | 2.x | Gzip compression |
| File Hashing | **crypto** (Node) | Native | File integrity checks |

### Testing & Quality
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Unit Testing | **Vitest** | 2.x | Fast unit test runner |
| React Testing | **@testing-library/react** | 16.x | Component testing |
| E2E Testing | **Playwright** | Latest | End-to-end browser tests |
| Mocking | **msw** | 2.x | API mocking for tests |
| Coverage | **@vitest/coverage-v8** | Latest | Code coverage reporting |

### Performance & Optimization
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Virtual Lists | **@tanstack/react-virtual** | 3.x | Virtualize large lists |
| Lazy Loading | **React.lazy** | Native | Code splitting |
| Memoization | **useMemo/useCallback** | Native | Prevent re-renders |
| Web Workers | **Comlink** | 4.x | Offload heavy computation |

### Developer Experience
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Linting | **ESLint** | 9.x | Code quality enforcement |
| Formatting | **Prettier** | 3.x | Consistent code style |
| Git Hooks | **husky** | 9.x | Pre-commit validation |
| Commit Linting | **commitlint** | Latest | Enforce commit conventions |
| Type Checking | **tsc** | Latest | TypeScript type checking |

### Error Tracking & Monitoring
| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| Error Boundary | **react-error-boundary** | 4.x | Graceful error handling |
| Logging | **winston** (via Tauri) | 3.x | Structured logging |
| Error Reporting | **@sentry/tauri** (optional) | Latest | Crash reporting (opt-in) |

---

## Project Structure (Production-Ready - Feature-Based Architecture)

> **Note**: The actual implementation uses a modern **feature-based** architecture for better maintainability and scalability. Components are organized by feature domain (projects, tasks, notes) rather than by technical role.

### Modern Structure (Implemented)
```
app/
├── src/
│   ├── features/                  # Feature modules (domain-driven)
│   │   ├── projects/
│   │   │   ├── components/        # Project-specific UI
│   │   │   ├── hooks/             # Project hooks
│   │   │   ├── services/          # Business logic
│   │   │   ├── stores/            # Feature state
│   │   │   ├── types/             # TypeScript types
│   │   │   └── index.ts           # Public API
│   │   ├── tasks/
│   │   ├── notes/
│   │   ├── git-history/
│   │   └── analytics/
│   │
│   ├── shared/                    # Shared across features
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   ├── layout/            # AppShell, Sidebar, TitleBar
│   │   │   └── feedback/          # Toasts, modals
│   │   ├── hooks/                 # Shared hooks
│   │   ├── utils/                 # Utility functions
│   │   └── types/                 # Global types
│   │
│   ├── core/                      # Core application logic
│   │   ├── api/                   # Tauri IPC abstraction
│   │   │   ├── tauri-client.ts    # Type-safe IPC wrapper
│   │   │   └── commands/          # Command wrappers
│   │   ├── database/              # Drizzle ORM
│   │   │   ├── schema/            # Database schemas
│   │   │   ├── repositories/      # Repository pattern
│   │   │   └── migrations/        # DB migrations
│   │   ├── services/              # Core services
│   │   │   ├── git/               # Git abstraction
│   │   │   ├── backup/            # Backup service
│   │   │   └── search/            # Search engine
│   │   └── store/                 # Global state (Zustand)
│   │
│   ├── config/                    # Configuration
│   ├── styles/                    # Global styles
│   ├── App.tsx
│   └── main.tsx
│
├── src-tauri/                     # Rust backend
│   └── src/
│       ├── commands/              # Tauri IPC commands
│       ├── services/              # Business logic (Rust)
│       ├── repositories/          # Data access
│       ├── models/                # Data models
│       ├── utils/                 # Utilities
│       ├── error.rs               # Error types
│       └── main.rs
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md            # Design patterns & best practices
│   ├── CONTRIBUTING.md            # Development guidelines
│   └── API.md                     # API documentation
│
├── tests/                         # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── Configuration files
    ├── tailwind.config.ts         # Tailwind v4 + design tokens
    ├── vite.config.ts             # Vite build config
    ├── drizzle.config.ts          # Drizzle ORM config
    ├── vitest.config.ts           # Testing config
    └── tsconfig.json              # TypeScript config
```

### Legacy Structure Reference
```
# Old type-based structure (for reference only)
src/components/          # All components mixed together
src/services/            # All services mixed together
src/stores/              # All stores mixed together
```

The feature-based approach provides:
- ✅ **Better Encapsulation** - Features are self-contained
- ✅ **Easier Maintenance** - Find all code for a feature in one place
- ✅ **Scalability** - Add new features without touching existing code
- ✅ **Clear Boundaries** - Public API via index.ts exports
- ✅ **Professional** - Industry-standard architecture pattern
│   │   │   ├── HelpDialog.tsx     # Help system
│   │   │   ├── VideoLibrary.tsx   # Tutorial videos
│   │   │   └── KnowledgeBase.tsx  # Documentation
│   │   │
│   │   └── common/                # Shared components
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Tooltip.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── stores/                    # Zustand state stores
│   │   ├── projectStore.ts        # Project state
│   │   ├── fileStore.ts           # File tree state
│   │   ├── taskStore.ts           # Task state
│   │   ├── noteStore.ts           # Notes state
│   │   ├── undoTreeStore.ts       # Undo tree state
│   │   ├── uiStore.ts             # UI state (theme, sidebar)
│   │   └── settingsStore.ts       # User settings
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useProject.ts          # Project operations
│   │   ├── useFileSystem.ts       # File operations
│   │   ├── useGit.ts              # Git operations
│   │   ├── useAutoSave.ts         # Auto-save logic
│   │   ├── useKeyboard.ts         # Keyboard shortcuts
│   │   ├── useTheme.ts            # Theme management
│   │   └── useDebounce.ts         # Debouncing utility
│   │
│   ├── services/                  # Business logic layer
│   │   ├── api/
│   │   │   ├── tauri.ts           # Tauri IPC wrapper
│   │   │   ├── database.ts        # Database operations
│   │   │   └── filesystem.ts      # File system operations
│   │   │
│   │   ├── git/
│   │   │   ├── gitService.ts      # Git abstraction layer
│   │   │   ├── diffService.ts     # Diff calculations
│   │   │   ├── historyService.ts  # History parsing
│   │   │   └── conflictResolver.ts # Merge conflict handling
│   │   │
│   │   ├── backup/
│   │   │   ├── backupService.ts   # Backup creation
│   │   │   ├── restoreService.ts  # Backup restoration
│   │   │   └── zipService.ts      # ZIP compression
│   │   │
│   │   ├── search/
│   │   │   ├── searchEngine.ts    # Search indexing
│   │   │   ├── fuzzySearch.ts     # Fuzzy search
│   │   │   └── nlpParser.ts       # Natural language parsing
│   │   │
│   │   └── sync/
│   │       ├── fileWatcher.ts     # File watching service
│   │       ├── syncManager.ts     # Sync coordination
│   │       └── conflictDetector.ts # Conflict detection
│   │
│   ├── lib/                       # Utilities and helpers
│   │   ├── utils/
│   │   │   ├── dateUtils.ts       # Date formatting
│   │   │   ├── fileUtils.ts       # File helpers
│   │   │   ├── pathUtils.ts       # Path manipulation
│   │   │   └── validators.ts      # Validation functions
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.ts          # App routes
│   │   │   ├── shortcuts.ts       # Keyboard shortcuts
│   │   │   └── config.ts          # App configuration
│   │   │
│   │   └── types/                 # TypeScript types
│   │       ├── project.ts
│   │       ├── task.ts
│   │       ├── note.ts
│   │       ├── git.ts
│   │       └── index.ts
│   │
│   ├── styles/                    # Global styles
│   │   ├── globals.css            # Global CSS
│   │   ├── themes/                # Theme definitions
│   │   │   ├── light.css
│   │   │   ├── dark.css
│   │   │   └── highContrast.css
│   │   └── animations.css         # Animation keyframes
│   │
│   ├── routes/                    # TanStack Router routes
│   │   ├── __root.tsx             # Root route
│   │   ├── index.tsx              # Home page
│   │   ├── projects/
│   │   │   ├── index.tsx          # Project list
│   │   │   └── $projectId.tsx     # Project detail
│   │   └── settings.tsx           # Settings page
│   │
│   ├── assets/                    # Static assets
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── main.tsx                   # App entry point
│   ├── App.tsx                    # Root component
│   └── vite-env.d.ts              # Vite types
│
├── src-tauri/                     # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs                # Tauri entry point
│   │   │
│   │   ├── commands/              # Tauri commands (IPC)
│   │   │   ├── mod.rs
│   │   │   ├── project.rs         # Project CRUD commands
│   │   │   ├── filesystem.rs      # File operations
│   │   │   ├── git.rs             # Git commands
│   │   │   ├── database.rs        # Database commands
│   │   │   ├── backup.rs          # Backup commands
│   │   │   └── system.rs          # System info commands
│   │   │
│   │   ├── services/              # Business logic (Rust)
│   │   │   ├── mod.rs
│   │   │   ├── git_service.rs     # Git abstraction
│   │   │   ├── file_watcher.rs    # File watching
│   │   │   ├── encryption.rs      # Data encryption
│   │   │   └── backup_service.rs  # Backup creation
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   ├── mod.rs
│   │   │   ├── path.rs            # Path utilities
│   │   │   ├── hash.rs            # Hashing utilities
│   │   │   └── compression.rs     # Compression utilities
│   │   │
│   │   ├── state/                 # App state (Rust)
│   │   │   ├── mod.rs
│   │   │   └── app_state.rs       # Global app state
│   │   │
│   │   └── error.rs               # Error types
│   │
│   ├── Cargo.toml                 # Rust dependencies
│   ├── tauri.conf.json            # Tauri configuration
│   └── build.rs                   # Build script
│
├── tests/                         # Test suites
│   ├── unit/                      # Unit tests
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── integration/               # Integration tests
│   │   ├── git.test.ts
│   │   ├── database.test.ts
│   │   └── fileSystem.test.ts
│   │
│   └── e2e/                       # End-to-end tests
│       ├── project-creation.spec.ts
│       ├── undo-tree.spec.ts
│       └── task-management.spec.ts
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md            # Architecture overview
│   ├── API.md                     # API documentation
│   ├── CONTRIBUTING.md            # Contribution guide
│   └── USER_GUIDE.md              # User manual
│
├── scripts/                       # Build and utility scripts
│   ├── setup.sh                   # Initial setup
│   ├── build.sh                   # Build script
│   └── release.sh                 # Release script
│
├── .github/                       # GitHub configuration
│   └── workflows/
│       ├── ci.yml                 # CI pipeline
│       └── release.yml            # Release workflow
│
├── package.json                   # Frontend dependencies
├── pnpm-lock.yaml                 # Lock file
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind config
├── drizzle.config.ts              # Drizzle ORM config
├── .eslintrc.json                 # ESLint config
├── .prettierrc                    # Prettier config
├── vitest.config.ts               # Vitest config
└── README.md                      # Project README
```

---

## Core Data Models

### Research Project
```typescript
interface ResearchProject {
  id: string;
  name: string;
  path: string;
  description?: string;
  status: 'active' | 'archived';
  createdAt: Date;
  createdAt: Date;
  createdAt: Date;
  lastModifiedAt: Date;
  createdAt: Date;
  lastModifiedAt: Date;
  groupName?: string; // e.g. "MIT Media Lab"
}

// Stored in `research.json` inside the project folder
interface PortableMetadata {
  title: string;
  description: string;
  members: ProjectMember[]; 
  created_at: string;
  version: string;
}

interface ProjectMember {
  name: string;
  role: string; // "PI", "Researcher", "Student"
  email?: string;
  affiliation?: string;
}
```

### Undo Tree
```typescript
interface UndoNode {
  id: string;
  parentId: string | null;
  message: string;
  timestamp: Date;
  type: 'auto' | 'checkpoint';
  changes: FileChange[];
}

interface FileChange {
  path: string;
  type: 'created' | 'modified' | 'deleted' | 'renamed';
  additions?: number;
  deletions?: number;
  isBinary: boolean;
}
```

---

## Key Features

### 1. Multi-Research Management
- Create, open, archive, delete projects
- Isolated storage per project
- Fast project switching

### 2. Visual Undo Tree
- Graph visualization of history
- Click to preview any state
- Restore to any point
- Branch from historical states
- Restore to any point
- Branch from historical states
- No Git terminology exposed
- **Smart Hover Previews**: Long-hover to see the full file list and exact changes made in that snapshot.

### 3. File Explorer
- Windows-style tree view
- Context menus
- Drag-and-drop support
- File type icons

### 4. Diff Viewer
- Side-by-side comparison
- Line-level additions/deletions
- Binary file summaries

### 5. Task Management
- To-do lists with priorities
- Kanban board
- To-do lists with priorities
- Kanban board
- Link tasks to files/history
- **Hierarchical Sub-tasks**: Break down tasks into smaller steps.
- **Progress Tracking**: Visual progress bars and completion percentages.
- **"Next Action" Indicators**: Highlights the immediate next step for each project.

### 6. Portable Project Metadata
- **Self-Contained Folder**: All critical info (Title, Members, Description) is stored in `research.json` inside the folder.
- **Copy-Paste Friendly**: Copying the folder to another computer preserves all member info and project context.
- **Team Info**: Simple list of names/roles in the JSON file (no complex database required).

- Markdown editor
- Research metadata
- Citations
- Drag & drop images/PDFs
- **Tags & Categorization**

### 7. Robust Data Integrity
- **Auto-Commit on Exit**: Automatically snapshots your work when closing the app to ensure zero data loss.
- **Real-time Sync**: Watch file system for external changes (e.g., editing a file in VS Code or Word) and update the UI instantly.
- **Crash Recovery**: Periodic background saves to prevent data loss during unexpected failures.
- **Smart Idle Save**: Triggers a save/commit when the user stops typing for 5 seconds.

### 8. Code & Developer Integrations
- **Auto Git Pull**: Automatically pulls latest changes for code folders from remote repositories on open.
- **Integrated Terminal**: Built-in terminal session for running scripts or git commands manually.
- **Dependency Scan**: Optional check for outdated dependencies in code folders.

### 9. Smart Conflict Resolution
- Detects if a file was modified externally while open.
- Offers "Diff & Merge" tools if conflicts occur.
- "Visual Resolve" interface to choose between Versions A and B.

### 9. Export & Reporting
- Export research notes to PDF, DOCX, or HTML.
- Bundle entire project/timeline as a ZIP archive.
- Generate "Research Reports" summarizing activity.

### 10. Local Collaboration (No Server Required!)
- **Share Project Folder**: Simply copy your project folder to USB drive, email, or your existing free cloud storage (Dropbox/Google Drive).
- **Local Network Sharing**: If on the same WiFi, share projects directly with team members (like AirDrop).
- **Comment System**: Leave comments in notes that sync when folder is shared - works offline!
- **Activity Timeline**: See "Who changed what and when" - stored locally in the project folder.
- **Color-Coded Members**: Each team member gets a color - info stored in the local `research.json` file.
- **Free Git Integration**: Optionally use free GitHub/GitLab for version control (but explained in simple terms).
- **Export Package**: Bundle entire project as ZIP to email to collaborators.

### 11. Smart Search & Discovery
- **Universal Search Bar**: Type anything to find files, notes, tasks, or history snapshots.
- **Natural Language Search**: Search like "files changed last week" or "notes about survey".
- **Recent Files**: Quick access panel showing your last 10 opened files.
- **Favorites/Bookmarks**: Star important files or snapshots for instant access.
- **Smart Filters**: Filter by file type, date range, person who edited, or tags.

### 12. Project Templates & Quick Start
- **Template Library**: Pre-built project structures for common research types:
  - Literature Review Project
  - Data Analysis Project
  - Thesis/Dissertation Project
  - Grant Proposal Project
  - Lab Experiment Project
- **Project Wizard**: Step-by-step guided setup asking simple questions to create the perfect structure.
- **Sample Projects**: Demo projects with example files to learn how everything works.

### 13. Automatic Smart Features
- **Smart File Organization**: Suggests organizing files based on type (e.g., "Move all PDFs to 'References' folder?").
- **Duplicate Detection**: Alerts when you save files with similar names or content.
- **Unused File Cleanup**: Identifies files that haven't been opened in months.
- **Auto-Backup Reminders**: Gentle reminders to back up your work weekly.
- **Citation Helper**: Automatically extracts bibliography info from PDF titles/metadata.

### 14. Timeline & Progress Visualization
- **Calendar View**: See when you worked on each project with a visual calendar.
- **Progress Dashboard**: Charts showing tasks completed, files added, and work patterns.
- **Milestone Tracker**: Set and visualize major project milestones (e.g., "Submit by June 1").
- **Work Analytics**: Simple stats like "Most productive day" or "Files modified this month".
- **Weekly Summary**: Auto-generated summary email/report of what you accomplished.

### 15. Backup & Cloud Sync
- **One-Click Backup**: Save complete snapshots to external drive or cloud (Google Drive, Dropbox, OneDrive).
- **Automatic Cloud Sync**: Optional automatic syncing with cloud storage providers.
- **Backup History**: View all backups and restore from any previous backup point.
- **USB Backup**: Quick backup to USB drive with a single button click.
- **Disaster Recovery**: Step-by-step guide to recover projects if computer crashes.

### 16. Help & Tutorials
- **Interactive Tutorial**: First-time walkthrough explaining each feature with animations.
- **Context Help**: Hover over any button to see plain-English explanations.
- **Video Library**: Short 1-2 minute videos showing how to do common tasks.
- **Quick Tips**: Daily tips appearing on startup ("Did you know you can...?").
- **Live Chat Support**: Built-in help chat for asking questions.
- **Troubleshooting Guide**: Common problems and solutions in simple language.

### 17. Voice & Accessibility Features
- **Voice Notes**: Record voice memos and attach them to files or tasks.
- **Text-to-Speech**: Listen to your notes read aloud.
- **Voice Commands**: Say commands like "Create new note" or "Show recent changes".
- **Large Text Mode**: Bigger fonts for easier reading.
- **High Contrast Themes**: Enhanced visibility options.
- **Keyboard Shortcuts Guide**: Simple list of keyboard shortcuts for faster work.
- **Screen Reader Support**: Full accessibility for visually impaired users.

### 18. Smart Notifications
- **Deadline Reminders**: Gentle notifications for upcoming task due dates.
- **Team Activity Alerts**: Know when collaborators make important changes.
- **Daily Digest**: Morning summary of pending tasks and recent changes.
- **Customizable Alerts**: Choose what notifications you want to receive.
- **Focus Mode**: Temporarily mute all notifications when you need to concentrate.

### 19. File Preview & Quick View
- **Instant Preview**: Click any file to see preview without opening (PDFs, images, Word docs, etc.).
- **PDF Annotation**: Highlight and add notes directly to PDF files.
- **Image Gallery**: Browse all images in a project as a slideshow.
- **Document Thumbnails**: See miniature previews of document content.
- **Quick Edit**: Make small edits to text files without launching full editor.

### 20. Learning & Documentation Hub
- **Knowledge Base**: Built-in library of research best practices and tips.
- **Citation Styles**: Quick reference guide for APA, MLA, Chicago, etc.
- **Research Workflow Templates**: Suggested workflows for different research phases.
- **Glossary**: Definitions of research terms in simple language.
- **Resource Links**: Curated links to useful research tools and databases.

---

## Database Schema

```sql
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    created_at DATETIME,
    created_at DATETIME,
    modified_at DATETIME,
    group_name TEXT
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo',
    priority INTEGER,
    due_date DATETIME,
    kanban_column TEXT,
    parent_id TEXT REFERENCES tasks(id),
    progress INTEGER DEFAULT 0
);

CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    title TEXT,
    content TEXT,
    format TEXT DEFAULT 'markdown'
);

CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE,
    color TEXT
);

CREATE TABLE note_tags (
    note_id TEXT REFERENCES notes(id),
    tag_id TEXT REFERENCES tags(id),
    tag_id TEXT REFERENCES tags(id),
    PRIMARY KEY (note_id, tag_id)
);

```

---

## Development Phases

### Phase 1: MVP (4-6 weeks)
- [ ] Project create/open/switch
- [ ] File explorer
- [ ] Basic undo tree visualization
- [ ] Auto-versioning (Git abstraction)
- [ ] Simple diff view

### Phase 2: Core Features (4-6 weeks)
- [ ] Full undo tree with branching
- [ ] Task management
- [ ] Kanban board
- [ ] Rich notes editor
- [ ] Binary file diffs
- [ ] **Real-time file watching**
- [ ] **Auto-commit on app close**
- [ ] **Idle Auto-Save**
- [ ] **Data Integrity (Crash Recovery)**

### Phase 3: Polish (4-6 weeks)
- [ ] Backup & recovery
- [ ] Full-text search
- [ ] Timeline view
- [ ] Templates & Project Scaffolding
- [ ] Integrated Terminal
- [ ] Themes

---

## User Interface Mockups

### Main Layout
```
┌──────────────────────────────────────────────────┐
│ [Logo] Research Manager          [−] [□] [×]    │
├────────────┬─────────────────────────────────────┤
│ PROJECTS   │  📁 thesis-2024                    │
│ ─────────  │  ├── 📁 data                        │
│ ▶ thesis   │  ├── 📁 documents                   │
│ ▶ survey   │  └── 📁 code                        │
│            │                                     │
│ ─────────  ├─────────────────────────────────────┤
│ UNDO TREE  │  [File Content / Diff View]         │
│            │                                     │
│   ○──○──○  │                                     │
│      └──○  │                                     │
│                                                  │
├────────────┴─────────────────────────────────────┤
│ Status: Ready                    Last saved: Now │
└──────────────────────────────────────────────────┘
```


### Advanced Task Board
```
┌──────────────────────────────────────────────────┐
│ 📋 Tasks & Progress               [+ New Task]   │
├──────────────┬──────────────┬────────────────────┤
│ TODO (3)     │ IN PROGRESS  │ DONE               │
│              │              │                    │
│ [!] Lit Rev. │ [>] Data Ana │ [✓] Ethics Appr.   │
│ 60% Complete │ 2 Subtasks   │                    │
│ 1. Find srcs │ - Clean CSV  │                    │
│ 2. Read abs  │ - Run R scpt │                    │
│              │              │                    │
├──────────────┴──────────────┴────────────────────┤
│ Next Action: Run R script for 'Data Analysis'    │
└──────────────────────────────────────────────────┘
```

---

## Testing Strategy

1. **Unit Tests**: Core logic (Vitest)
2. **Integration Tests**: Git abstraction, DB ops
3. **E2E Tests**: User flows (Playwright)
4. **Usability Tests**: Non-technical user validation

---

## Installation Commands

```bash
# Prerequisites
# Install Node.js 18+ and Rust (for Tauri)

# Create Tauri + React project with TypeScript
npm create tauri-app@latest research-management -- --template react-ts
cd research-management

# Switch to pnpm for better performance
npm install -g pnpm
pnpm install

# Core UI & Styling
pnpm add @fluentui/react-components @fluentui/react-icons
pnpm add framer-motion lucide-react
pnpm add tailwindcss@next @tailwindcss/typography
pnpm add -D @griffel/webpack-extractor

# State Management & Routing
pnpm add zustand @tanstack/react-query @tanstack/react-router
pnpm add react-hook-form zod

# Database & Storage
pnpm add drizzle-orm better-sqlite3
pnpm add @tauri-apps/plugin-sql
pnpm add idb
pnpm add -D drizzle-kit

# Git & Version Control
pnpm add isomorphic-git diff react-diff-view

# Rich Text Editor
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm
pnpm add @tiptap/extension-markdown @tiptap/extension-code-block-lowlight
pnpm add lowlight

# PDF & Media
pnpm add react-pdf pdfjs-dist
pnpm add sharp  # Via Tauri

# Visualization
pnpm add @xyflow/react recharts
pnpm add react-big-calendar vis-timeline
pnpm add date-fns

# User Interaction Components
pnpm add cmdk sonner
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
pnpm add @radix-ui/react-dialog @radix-ui/react-tooltip
pnpm add @radix-ui/react-context-menu @radix-ui/react-dropdown-menu

# Tauri Plugins
pnpm add @tauri-apps/api
pnpm add @tauri-apps/plugin-fs @tauri-apps/plugin-dialog
pnpm add @tauri-apps/plugin-clipboard @tauri-apps/plugin-notification
pnpm add @tauri-apps/plugin-shell

# Search & Indexing
pnpm add fuse.js flexsearch compromise

# Utilities
pnpm add uuid pathe
pnpm add jszip pako

# Terminal
pnpm add xterm xterm-addon-fit

# Performance
pnpm add @tanstack/react-virtual
pnpm add comlink

# Error Handling & Logging
pnpm add react-error-boundary

# Testing
pnpm add -D vitest @vitest/coverage-v8
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D playwright msw

# Developer Tools
pnpm add -D eslint@9 prettier@3
pnpm add -D husky commitlint @commitlint/config-conventional
pnpm add -D typescript @types/react @types/node

# Initialize Tailwind
pnpx tailwindcss init -p

# Initialize Drizzle
pnpm drizzle-kit generate

# Setup Git Hooks
pnpm exec husky init

# Start development server
pnpm tauri dev
```

---

## Success Criteria

✅ Non-technical users manage projects without confusion  
✅ Users explore history confidently via visual tree  
✅ UI responds < 100ms for typical operations  
✅ Zero data loss in normal usage  
✅ Works on Windows, macOS, Linux

---

## ⚠️ Potential Conflicts & Solutions

### 1. **File System Conflicts**

#### Problem: External File Modifications
- **Scenario**: User edits a file in external editor (Word, VS Code) while app has it open
- **Conflict**: App's in-memory version differs from disk version
- **Solution**:
  - Use file watcher to detect external changes
  - Show notification: "File changed externally. Reload?"
  - Offer 3 options: Keep Current | Load External | Compare & Merge
  - Auto-reload if no unsaved changes exist

#### Problem: Simultaneous Edits (Collaboration)
- **Scenario**: Two team members edit same synced file
- **Conflict**: Both versions exist after sync
- **Solution**:
  - Detect timestamp mismatch
  - Create backup of both versions (`file.txt`, `file.conflict-2024-12-30.txt`)
  - Show diff viewer to manually resolve
  - Save resolution as new version in history

### 2. **Git/Version Control Conflicts**

#### Problem: Hidden Git Complexity
- **Scenario**: User doesn't understand "detached HEAD" or merge conflicts
- **Conflict**: Git operations fail with technical errors
- **Solution**:
  - Never show Git errors directly
  - Translate to plain English: "You're viewing an old version. Would you like to make changes from this point?"
  - Auto-resolve simple conflicts (one person changed, other didn't)
  - Show visual "Version A vs Version B" picker for complex conflicts

#### Problem: Large Binary Files
- **Scenario**: User commits 500MB video files
- **Conflict**: Git becomes extremely slow
- **Solution**:
  - Warn before adding files >50MB
  - Suggest moving large files to separate folder
  - Implement Git LFS (Large File Storage) transparently
  - Show progress bar for large commits

### 3. **Database Race Conditions**

#### Problem: Concurrent Database Writes
- **Scenario**: Auto-save and manual save happen simultaneously
- **Conflict**: Database lock or corrupted transaction
- **Solution**:
  - Use SQLite WAL (Write-Ahead Logging) mode
  - Implement database queue with single writer
  - Debounce auto-save by 3 seconds
  - Show "Saving..." indicator during writes

#### Problem: Schema Migration Failure
- **Scenario**: App updates with new database schema, migration fails
- **Conflict**: App can't read old database format
- **Solution**:
  - Create database backup before migration
  - Use Drizzle ORM's automatic migration rollback
  - Show friendly error: "Update failed. App restored to previous version"
  - Log technical details to file for debugging

### 4. **State Management Conflicts**

#### Problem: Stale State After Navigation
- **Scenario**: User switches projects, old data briefly visible
- **Conflict**: Confusing UI flickering
- **Solution**:
  - Show loading skeleton while switching
  - Clear state immediately on project change
  - Use TanStack Query for automatic state invalidation
  - Implement optimistic updates for instant feedback

#### Problem: Memory Leaks from Subscriptions
- **Scenario**: File watcher/event listeners not cleaned up
- **Conflict**: App slows down over time
- **Solution**:
  - Use React cleanup functions (`useEffect` return)
  - Implement singleton pattern for global subscriptions
  - Add memory profiling in development mode
  - Auto-cleanup on component unmount

### 5. **Cross-Platform Path Issues**

#### Problem: Windows vs macOS/Linux Paths
- **Scenario**: `C:\Users\...` paths don't work on macOS
- **Conflict**: Project folders can't be shared across OS
- **Solution**:
  - Use `pathe` library for cross-platform paths
  - Store relative paths in database, not absolute
  - Normalize paths on load: `/` separators everywhere
  - Test on all 3 platforms before release

### 6. **Performance Bottlenecks**

#### Problem: Large File Trees
- **Scenario**: 10,000+ files in project folder
- **Conflict**: UI freezes when loading
- **Solution**:
  - Implement virtual scrolling (`@tanstack/react-virtual`)
  - Load file tree lazily (expand on demand)
  - Index files in background Web Worker
  - Show max 1000 items initially, "Load More" button

#### Problem: Heavy Diff Computations
- **Scenario**: Comparing large text files (10MB+)
- **Conflict**: UI blocks for seconds
- **Solution**:
  - Move diff calculation to Web Worker (Comlink)
  - Show progress indicator for >1 second operations
  - Limit diff display to first 10,000 lines
  - Offer "Download full diff" option

### 7. **Backup & Recovery Conflicts**

#### Problem: Incomplete Backups
- **Scenario**: Backup interrupted mid-process
- **Conflict**: Corrupted ZIP file
- **Solution**:
  - Create backup in temp folder first
  - Verify ZIP integrity (CRC check)
  - Only move to final location if valid
  - Keep previous backup until new one succeeds

#### Problem: Restore Overwrites Current Work
- **Scenario**: User restores backup, losing recent changes
- **Conflict**: Data loss
- **Solution**:
  - Create auto-backup of current state before restore
  - Show warning: "This will replace your current project. Continue?"
  - Offer "Restore to new folder" option
  - Add restore operation to undo tree

---

## 🏗️ Architecture Patterns & Best Practices

### **1. Layered Architecture**

```
┌─────────────────────────────────────────────────┐
│          Presentation Layer (React)             │
│  Components, Hooks, Stores, UI Logic            │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│          Service Layer (TypeScript)             │
│  Business Logic, Git, Search, Backup            │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│           Data Layer (Rust + SQL)               │
│  Tauri Commands, Database, File System          │
└─────────────────────────────────────────────────┘
```

**Benefits**:
- Clear separation of concerns
- Easy to test each layer independently
- Can swap implementations (e.g., different database)

### **2. Repository Pattern for Data Access**

```typescript
// Abstract repository interface
interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: string, updates: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}

// SQLite implementation
class SQLiteProjectRepository implements ProjectRepository {
  // Implementation details...
}
```

### **3. Command Pattern for Undo/Redo**

```typescript
interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
  description: string;
}

class CreateFileCommand implements Command {
  async execute() {
    await fs.writeFile(this.path, this.content);
    await git.commit(`Created ${this.path}`);
  }
  
  async undo() {
    await fs.deleteFile(this.path);
    await git.commit(`Deleted ${this.path}`);
  }
}
```

### **4. Observer Pattern for File Watching**

```typescript
class FileWatcher {
  private listeners: Map<string, Set<(event: FileEvent) => void>>;
  
  subscribe(path: string, callback: (event: FileEvent) => void) {
    // Add listener
  }
  
  private notify(path: string, event: FileEvent) {
    this.listeners.get(path)?.forEach(cb => cb(event));
  }
}
```

### **5. Strategy Pattern for Conflict Resolution**

```typescript
interface ConflictResolver {
  canResolve(conflict: Conflict): boolean;
  resolve(conflict: Conflict): Promise<Resolution>;
}

class AutoMergeResolver implements ConflictResolver {
  canResolve(conflict: Conflict) {
    return conflict.type === 'non-overlapping';
  }
  
  async resolve(conflict: Conflict) {
    // Auto-merge non-conflicting changes
  }
}
```

### **6. Facade Pattern for Git Abstraction**

```typescript
class GitFacade {
  // Simple API hiding Git complexity
  async saveSnapshot(message: string): Promise<string> {
    // Internally: git add, git commit
  }
  
  async restoreVersion(commitId: string): Promise<void> {
    // Internally: git checkout
  }
}
```

---

## 🔒 Security & Data Integrity

### **1. Data Encryption**
- Encrypt sensitive project metadata using `better-sqlite3-multiple-ciphers`
- Password-protect backup ZIP files (AES-256)
- Never store credentials in plain text
- Use OS keychain for Git credentials

### **2. Input Validation**
- Validate all user input with Zod schemas
- Sanitize file paths to prevent directory traversal
- Limit file upload sizes (configurable)
- Reject malicious file types (.exe, .sh in wrong context)

### **3. Safe File Operations**
- Never delete files directly - move to trash first
- Verify file permissions before operations
- Atomic writes (write to temp, then move)
- Checksum verification for critical files

### **4. Error Handling Hierarchy**

```typescript
// 1. Try to recover automatically
try {
  await saveFile(path, content);
} catch (error) {
  // 2. Retry with backoff
  await retryWithBackoff(() => saveFile(path, content));
  // 3. Save to backup location
  await saveToBackup(path, content);
  // 4. Show error to user
  notify.error("Could not save file. Try closing other programs.");
}
```

---

## 🚀 Performance Optimization Strategies

### **1. Virtualization**
- Use `@tanstack/react-virtual` for file lists >100 items
- Render only visible rows (10-20 at a time)
- Infinite scrolling for search results

### **2. Code Splitting**
- Lazy load heavy components (PDF viewer, terminal)
- Route-based splitting with TanStack Router
- Separate bundle for rarely-used features

### **3. Memoization**
- Memo expensive calculations (diff, search indexing)
- Use `React.memo` for pure components
- Zustand selectors to prevent unnecessary re-renders

### **4. Debouncing & Throttling**
- Debounce search input (300ms)
- Debounce auto-save (3 seconds)
- Throttle file watcher events (100ms max)

### **5. Background Processing**
- Move heavy work to Web Workers (search indexing, diff)
- Use Rust for CPU-intensive tasks (file hashing, compression)
- Incremental indexing (don't reindex entire project every time)

### **6. Caching**
- Cache file tree in memory (invalidate on change)
- Cache search results for 5 minutes
- Cache rendered previews (invalidate on file modify)

---

## 📊 Monitoring & Logging

### **Development Mode**
- Console logs for all state changes
- Performance profiling with React DevTools
- Memory leak detection
- Git command logging

### **Production Mode**
- Log only errors and warnings to file
- Structured logging with Winston (JSON format)
- Rotate logs daily (keep last 7 days)
- Optional Sentry integration for crash reports

### **User Analytics (Privacy-First)**
- Track feature usage locally (never send data)
- Show user their own usage stats in dashboard
- No telemetry without explicit opt-in

---

## ✅ Code Quality Checklist

### **Before Committing**
- [ ] All TypeScript errors resolved
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied
- [ ] All tests pass (`pnpm test`)
- [ ] No console.logs in production code
- [ ] New features have tests
- [ ] Updated documentation if API changed

### **Before Releasing**
- [ ] E2E tests pass on all platforms
- [ ] Performance benchmarks acceptable (<100ms)
- [ ] Accessibility audit passed
- [ ] Security audit complete
- [ ] Database migrations tested
- [ ] Backup/restore tested with real data
- [ ] User testing with 5+ non-technical users

---

## 🎯 Detailed Success Metrics

### **Performance Targets**
- ⚡ App startup: < 2 seconds
- ⚡ Project switch: < 500ms
- ⚡ File tree load (1000 files): < 300ms
- ⚡ Diff calculation (1MB file): < 1 second
- ⚡ Search query: < 200ms
- ⚡ Save operation: < 100ms

### **Reliability Targets**
- 🎯 Zero data loss in normal operation
- 🎯 <0.1% crash rate
- 🎯 Auto-recovery from 90%+ of errors
- 🎯 All file operations atomic (no partial writes)

### **Usability Targets**
- 👤 New user completes first task < 2 minutes
- 👤 90%+ of features discoverable without manual
- 👤 Task completion success rate >95%
- 👤 Average user completes 80% of tasks without help

### **Accessibility Targets**
- ♿ WCAG 2.1 AA compliant
- ♿ Full keyboard navigation support
- ♿ Screen reader compatible
- ♿ Minimum touch target size: 44x44px

