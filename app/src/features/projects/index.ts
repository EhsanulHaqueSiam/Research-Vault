/**
 * Project Feature - Public API
 * 
 * This file exports the public interface of the projects feature.
 * Other features should only import from this file.
 */

// Types
export type {
    Project,
    ProjectStatus,
    CreateProjectDto,
    UpdateProjectDto,
    ResearchMetadata,
    ProjectMember,
    ProjectStats,
    ProjectFilter,
    ProjectTemplate,
} from './types/project.types'

// Schemas (for validation)
export {
    ProjectSchema,
    CreateProjectDtoSchema,
    UpdateProjectDtoSchema,
    ResearchMetadataSchema,
    ProjectMemberSchema,
    builtInProjectTemplates,
    PROJECT_COLORS,
} from './types/project.types'

// Services
export { ProjectService } from './services/project.service'

// Hooks
export * from './hooks'
