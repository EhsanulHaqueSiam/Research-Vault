# Contributing to Research Management System

Thank you for your interest in contributing! This document provides guidelines for development.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Run dev server: `pnpm run dev`
4. Make your changes
5. Run tests: `pnpm test`
6. Submit a pull request

## Code Standards

### TypeScript
- Use strict mode
- Define types for all functions
- Avoid `any` type
- Use meaningful variable names

### React
- Functional components only
- Use hooks for state management
- Keep components small and focused
- Co-locate tests with components

### Rust
- Follow Rust naming conventions
- Use `Result<T, AppError>` for operations that can fail
- Document public APIs
- Run `cargo fmt` before committing

## Architecture Guidelines

### Feature Organization
- Group code by feature, not by type
- Each feature has its own folder
- Features export a public API through index.ts
- Features should be as independent as possible

### Naming Conventions
- Components: `PascalCase` (ProjectCard.tsx)
- Hooks: `camelCase` with `use` prefix (useProjects.ts)
- Utils: `camelCase` (formatDate.ts)
- Constants: `UPPER_SNAKE_CASE` (MAX_FILE_SIZE)
- Types: `PascalCase` (Project, CreateProjectDto)

### File Structure
```typescript
// ✅ Good structure
features/
  projects/
    components/
      ProjectCard/
        ProjectCard.tsx
        ProjectCard.test.tsx
        index.ts
    hooks/
      useProjects.ts
    types/
      project.types.ts
    index.ts  // Public API

// ❌ Bad structure
components/
  ProjectCard.tsx
  TaskList.tsx
hooks/
  useProjects.ts
  useTasks.ts
```

## Testing

### Unit Tests
```typescript
// Component tests
describe('ProjectCard', () => {
  it('renders project name', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
  })
})
```

### Integration Tests
Test feature workflows, not individual components.

### E2E Tests
Test critical user flows end-to-end.

## Git Workflow

### Commits
Use conventional commits:
```
feat: add project creation dialog
fix: resolve file path issue
docs: update architecture guide
test: add project service tests
refactor: extract project utilities
```

### Branches
- `main` - production-ready code
- `develop` - integration branch
- `feature/*` - new features
- `fix/*` - bug fixes

### Pull Requests
- Include tests for new features
- Update documentation
- Ensure all checks pass
- Request review from maintainers

## Performance Guidelines

1. Use React.lazy for code splitting
2. Implement virtualization for large lists
3. Debounce user input
4. Memoize expensive computations
5. Avoid unnecessary re-renders

## Accessibility

1. Use semantic HTML
2. Include ARIA labels
3. Support keyboard navigation
4. Maintain color contrast ratios
5. Test with screen readers

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for structural changes
- Add JSDoc comments for public APIs
- Include examples in documentation

## Questions?

Open an issue or start a discussion on GitHub.
