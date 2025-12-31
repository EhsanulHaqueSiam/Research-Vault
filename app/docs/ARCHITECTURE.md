# Desktop Application Architecture Guide

## Professional Windows Desktop Software Development

This document outlines the architecture, patterns, and best practices for building maintainable, professional Windows desktop applications with Tauri + React.

---

## Architecture Principles

### Core Principles
1. **Separation of Concerns** - Clear boundaries between UI, business logic, and data
2. **Dependency Injection** - Loose coupling, easy testing
3. **Single Responsibility** - Each module has one reason to change
4. **Feature-Based Organization** - Group by feature, not by type
5. **SOLID Principles** - Object-oriented design fundamentals

### Desktop-Specific Principles
6. **IPC Abstraction** - Clean interface between frontend and backend
7. **Offline-First** - Local data, no server dependencies
8. **Process Isolation** - Rust backend separate from UI thread
9. **Native Integration** - Leverage OS capabilities professionally

---

## Project Structure

```
src/
├── features/              # Feature modules (business domains)
│   ├── projects/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # React hooks
│   │   ├── services/      # Business logic
│   │   ├── stores/        # State management
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Public API
│   ├── tasks/
│   ├── notes/
│   └── git-history/
│
├── shared/                # Shared resources
│   ├── components/ui/     # Reusable UI (shadcn/ui)
│   ├── hooks/             # Shared hooks
│   ├── utils/             # Utilities
│   └── types/             # Global types
│
├── core/                  # Core application
│   ├── api/               # Tauri IPC
│   ├── database/          # Drizzle ORM
│   ├── services/          # Core services
│   └── store/             # Global state
│
└── config/                # Configuration
```

---

## Design Patterns

### 1. Repository Pattern
```typescript
// Abstraction over data access
export class ProjectRepository {
  async findAll(): Promise<Project[]>
  async findById(id: string): Promise<Project | null>
  async create(data: Partial<Project>): Promise<Project>
  async update(id: string, data: Partial<Project>): Promise<Project>
  async delete(id: string): Promise<void>
}
```

### 2. Service Layer
```typescript
// Business logic separation
export class ProjectService {
  constructor(
    private repo: ProjectRepository,
    private git: GitService
  ) {}
  
  async createProject(data: CreateProjectDto): Promise<Project> {
    // Validation, directory creation, git init, save
  }
}
```

### 3. Command Pattern (IPC)
```typescript
// Tauri command wrappers
export const projectCommands = {
  create: (data: CreateProjectDto) => 
    invoke<Project>('create_project', { data }),
  update: (id: string, data: UpdateProjectDto) =>
    invoke<Project>('update_project', { id, data }),
}
```

---

## State Management

1. **Local State**: `useState` for simple UI state
2. **Shared UI**: Zustand for theme, sidebar, etc.
3. **Server State**: TanStack Query for backend data
4. **Form State**: React Hook Form + Zod validation

---

## Coding Standards

### Naming Conventions
- Components: `PascalCase` (ProjectCard.tsx)
- Hooks: `camelCase` with use prefix (useProjects.ts)
- Utils: `camelCase` (formatDate.ts)
- Constants: `UPPER_SNAKE_CASE`
- Types: `PascalCase` (Project, CreateProjectDto)

### File Organization
- One component per file
- Co-locate tests with source
- Index files for public API
- Group related files in folders

---

## Testing Strategy

1. **Unit Tests**: Vitest for utilities and services
2. **Integration Tests**: Component + services
3. **E2E Tests**: Playwright for full flows

---

## Performance

1. Code splitting with `React.lazy`
2. Virtualization for large lists
3. Debouncing user input
4. Memoization with `useMemo`/`useCallback`
5. Lazy loading heavy components

---

## Security

1. Input validation (Zod schemas)
2. Path sanitization (Rust side)
3. Parameterized queries (Drizzle)
4. No direct SQL concatenation

---

## Documentation

- JSDoc for functions
- Component examples
- README per feature
- API documentation

For detailed patterns and examples, see inline code documentation.
