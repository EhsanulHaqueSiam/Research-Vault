/**
 * Project Hooks
 * 
 * TanStack Query hooks for project data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProjectService } from '../services/project.service'
import type { CreateProjectDto, UpdateProjectDto } from '../types/project.types'

// Query keys for cache management
export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...projectKeys.lists(), filters] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: string) => [...projectKeys.details(), id] as const,
    stats: () => [...projectKeys.all, 'stats'] as const,
    templates: () => [...projectKeys.all, 'templates'] as const,
}

/**
 * Hook to fetch all projects
 */
export function useProjects() {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: () => ProjectService.getAll(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch active projects only
 */
export function useActiveProjects() {
    return useQuery({
        queryKey: projectKeys.list({ status: 'active' }),
        queryFn: () => ProjectService.getActive(),
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to fetch archived projects
 */
export function useArchivedProjects() {
    return useQuery({
        queryKey: projectKeys.list({ status: 'archived' }),
        queryFn: () => ProjectService.getArchived(),
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to fetch a single project by ID
 */
export function useProject(id: string) {
    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: () => ProjectService.getById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

/**
 * Hook to fetch recent projects
 */
export function useRecentProjects(limit: number = 5) {
    return useQuery({
        queryKey: projectKeys.list({ recent: true, limit }),
        queryFn: () => ProjectService.getRecent(limit),
        staleTime: 1 * 60 * 1000, // 1 minute
    })
}

/**
 * Hook to fetch project statistics
 */
export function useProjectStats() {
    return useQuery({
        queryKey: projectKeys.stats(),
        queryFn: () => ProjectService.getStats(),
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to search projects
 */
export function useSearchProjects(query: string) {
    return useQuery({
        queryKey: projectKeys.list({ search: query }),
        queryFn: () => ProjectService.search(query),
        enabled: query.length > 0,
        staleTime: 30 * 1000, // 30 seconds
    })
}

/**
 * Hook to get available project templates
 */
export function useProjectTemplates() {
    return useQuery({
        queryKey: projectKeys.templates(),
        queryFn: () => Promise.resolve(ProjectService.getAvailableTemplates()),
        staleTime: Infinity, // Templates don't change
    })
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateProjectDto) => ProjectService.create(data),
        onSuccess: (newProject) => {
            // Invalidate project lists
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
            queryClient.invalidateQueries({ queryKey: projectKeys.stats() })

            // Add the new project to cache
            queryClient.setQueryData(
                projectKeys.detail(newProject.id),
                newProject
            )
        },
    })
}

/**
 * Hook to create a project from template
 */
export function useCreateProjectFromTemplate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, templateId }: { data: CreateProjectDto; templateId: string }) =>
            ProjectService.createFromTemplate(data, templateId),
        onSuccess: (newProject) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
            queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
            queryClient.setQueryData(
                projectKeys.detail(newProject.id),
                newProject
            )
        },
    })
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
            ProjectService.update(id, data),
        onSuccess: (updatedProject) => {
            // Update the specific project in cache
            queryClient.setQueryData(
                projectKeys.detail(updatedProject.id),
                updatedProject
            )
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        },
    })
}

/**
 * Hook to archive a project
 */
export function useArchiveProject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => ProjectService.archive(id),
        onSuccess: (_, id) => {
            // Remove from cache and invalidate lists
            queryClient.removeQueries({ queryKey: projectKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
            queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
        },
    })
}

/**
 * Hook to restore an archived project
 */
export function useRestoreProject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => ProjectService.restore(id),
        onSuccess: (restoredProject) => {
            queryClient.setQueryData(
                projectKeys.detail(restoredProject.id),
                restoredProject
            )
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
            queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
        },
    })
}

/**
 * Hook to permanently delete a project
 */
export function useDeleteProject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => ProjectService.permanentDelete(id),
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: projectKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
            queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
        },
    })
}

/**
 * Hook to add a tag to a project
 */
export function useAddProjectTag() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, tag }: { id: string; tag: string }) =>
            ProjectService.addTag(id, tag),
        onSuccess: (updatedProject) => {
            queryClient.setQueryData(
                projectKeys.detail(updatedProject.id),
                updatedProject
            )
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        },
    })
}

/**
 * Hook to remove a tag from a project
 */
export function useRemoveProjectTag() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, tag }: { id: string; tag: string }) =>
            ProjectService.removeTag(id, tag),
        onSuccess: (updatedProject) => {
            queryClient.setQueryData(
                projectKeys.detail(updatedProject.id),
                updatedProject
            )
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        },
    })
}

/**
 * Hook to touch a project (update lastModifiedAt)
 */
export function useTouchProject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => ProjectService.touch(id),
        onSuccess: (updatedProject) => {
            queryClient.setQueryData(
                projectKeys.detail(updatedProject.id),
                updatedProject
            )
        },
    })
}
