<p align="center">
  <img src="app/src-tauri/icons/128x128.png" alt="Research Vault Logo" width="80"/>
</p>

<h1 align="center">Research Vault</h1>

<p align="center">
  <strong>A modern desktop app for researchers to manage projects with visual version control</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#development">Development</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platforms"/>
  <img src="https://img.shields.io/badge/built%20with-Tauri%202.0-orange" alt="Tauri"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
</p>

---

## ✨ Features

### 📁 Project Management
- **Create & organize** research projects with custom colors
- **Tag system** for categorization and filtering
- **Quick search** (Cmd/Ctrl+K) across all projects, tasks, and notes
- **Recent projects** for quick access

### ✅ Task Management
- **Task lists** with priorities, due dates, and status tracking
- **Kanban board** for visual workflow management
- **Drag-and-drop** task organization

### 📝 Rich Note Taking
- **Tiptap-powered editor** with formatting, tables, and code blocks
- **Link notes** to projects and tasks
- **Full-text search** across all notes

### 🔄 Visual Version Control
- **Automatic Git backup** - every change is saved
- **Visual Undo Tree** - see branching history like a mind map
- **One-click restore** - go back to any previous state
- **Diff viewer** - see exactly what changed

### 📊 Analytics Dashboard
- **Progress tracking** with charts and heatmaps
- **Milestone tracking** for research phases
- **Activity timeline** across all projects

### 🎨 Modern UI/UX
- **Dark/Light/System themes** with smooth transitions
- **Keyboard-first navigation** (j/k, Enter, Esc)
- **Inline editing** - double-click to rename
- **Toast notifications** with undo actions
- **Focus mode** for distraction-free work

---

## 📥 Installation

### Download Pre-built Release

| Platform | Download |
|----------|----------|
| Windows | [Download .msi](https://github.com/EhsanulHaqueSiam/Research-Vault/releases/latest) |
| macOS | [Download .dmg](https://github.com/EhsanulHaqueSiam/Research-Vault/releases/latest) |
| Linux | [Download .AppImage](https://github.com/EhsanulHaqueSiam/Research-Vault/releases/latest) |

### Build from Source

**Prerequisites:**
- Node.js 20+
- pnpm 8+
- Rust (latest stable)

```bash
# Clone the repository
git clone https://github.com/EhsanulHaqueSiam/Research-Vault.git
cd research-vault/app

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev

# Build for production
pnpm tauri build
```

---

## 🚀 Usage

### Quick Start

1. **Create a Project** - Click "New Project" or press `Cmd+N`
2. **Add Tasks** - Switch to Tasks tab, create tasks with priorities
3. **Write Notes** - Use the rich text editor for research notes
4. **Track Progress** - View the Analytics dashboard

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + N` | New project |
| `j / k` | Navigate up/down in lists |
| `Enter` | Open selected item |
| `Esc` | Close dialog / Cancel |
| `?` | Show all shortcuts |

### Tips

- **Double-click** project titles to rename inline
- **Cmd+Click** to multi-select projects
- Every edit is **auto-saved** with version history
- Use **Focus Mode** for distraction-free work

---

## 🛠 Development

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Tauri 2.0 (Rust) |
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand + TanStack Query |
| Database | SQLite + Drizzle ORM |
| Editor | Tiptap |
| Version Control | isomorphic-git |

### Project Structure

```
research-vault/
├── app/                    # Frontend + Tauri
│   ├── src/                # React application
│   │   ├── components/     # UI components
│   │   ├── features/       # Feature modules
│   │   └── shared/         # Shared utilities
│   └── src-tauri/          # Rust backend
├── .github/workflows/      # CI/CD
└── docs/                   # Documentation
```

### Scripts

```bash
pnpm dev          # Start Vite dev server
pnpm tauri dev    # Start Tauri in dev mode
pnpm build        # Build frontend
pnpm tauri build  # Build production app
pnpm test         # Run tests
pnpm lint         # Lint code
```

---

## 🏷️ Repository Topics

```
tauri, react, typescript, research, project-management, 
desktop-app, version-control, sqlite, notes, tasks, 
kanban, git, productivity, cross-platform
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- [Tauri](https://tauri.app/) - Desktop framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tiptap](https://tiptap.dev/) - Rich text editor
- [React Flow](https://reactflow.dev/) - Undo tree visualization

---

<p align="center">
  Made with ❤️ for researchers
</p>
