export {
    // Query keys
    projectKeys,

    // Query hooks
    useProjects,
    useActiveProjects,
    useArchivedProjects,
    useProject,
    useRecentProjects,
    useProjectStats,
    useSearchProjects,
    useProjectTemplates,

    // Mutation hooks
    useCreateProject,
    useCreateProjectFromTemplate,
    useUpdateProject,
    useArchiveProject,
    useRestoreProject,
    useDeleteProject,
    useAddProjectTag,
    useRemoveProjectTag,
    useTouchProject,
} from './useProjects'
