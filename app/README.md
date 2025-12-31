# Research Management System

A professional desktop application for managing research projects, built with Tauri + React + TypeScript.

## Features

- **Project Management** - Create, organize, and manage research projects
- **Git Integration** - Visual undo tree and version control
- **Task Management** - Kanban boards and hierarchical tasks
- **Rich Notes** - Tiptap editor with markdown support
- **File Explorer** - Navigate project files
- **Search** - Universal search across all content
- **Backup** - Automated local backups

## Tech Stack

- **Frontend**: React 19, TypeScript 5.9, Tailwind CSS v4
- **Backend**: Rust (Tauri 2.0)
- **Database**: SQLite + Drizzle ORM
- **State**: Zustand + TanStack Query
- **UI**: Radix UI + shadcn/ui architecture
- **Icons**: 15,000+ from Lucide, Tabler, Heroicons, Iconoir, Phosphor

## Getting Started

### Prerequisites
- Node.js v25+
- Rust 1.92+
- pnpm 10+

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Run desktop app
pnpm run tauri:dev
```

### Building

```bash
# Build frontend
pnpm run build

# Build desktop installers
pnpm run tauri:build
```

## Project Structure

```
app/
├── src/
│   ├── features/          # Feature modules
│   ├── shared/            # Shared components/utils
│   ├── core/              # Core services/API
│   └── config/            # Configuration
├── src-tauri/             # Rust backend
├── tests/                 # Test suites
└── docs/                  # Documentation
```

## Development

### Code Quality

```bash
# Type checking
pnpm run type-check

# Linting
pnpm run lint

# Formatting
pnpm run format

# Testing
pnpm test
```

### Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed patterns and best practices.

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for development guidelines.

## License

MIT
