/**
 * Tasks Feature - Public API
 */

// Types
export * from './types/task.types'
export type { TaskHierarchy } from '@/core/database/repositories'

// Services
export { TaskService } from './services/task.service'

// Hooks
export {
    useTasks,
    useTask,
    useTaskHierarchy,
    useTaskStats,
    useFilteredTasks,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useToggleTask,
    useReorderTasks,
    useProjectTasks,
    taskKeys,
} from './hooks/useTasks'

// Components
export { TaskCard } from './components/TaskCard'
export { TaskForm } from './components/TaskForm'
export { TaskList } from './components/TaskList'
export { KanbanBoard } from './components/KanbanBoard'
