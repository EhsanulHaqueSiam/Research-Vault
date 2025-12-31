/**
 * Comment Types
 * 
 * Types for the commenting and discussion system
 */

// ============================================
// Comment Types
// ============================================

export interface Comment {
    id: string
    projectId: string
    parentId?: string // For thread replies
    targetType: 'project' | 'task' | 'note'
    targetId: string
    content: string
    authorName: string
    authorAvatar?: string
    createdAt: Date
    updatedAt: Date
    isEdited: boolean
    reactions?: CommentReaction[]
}

export interface CommentReaction {
    emoji: string
    count: number
    users: string[]
}

export interface CreateCommentInput {
    projectId: string
    parentId?: string
    targetType: Comment['targetType']
    targetId: string
    content: string
    authorName: string
}

export interface UpdateCommentInput {
    content: string
}

// ============================================
// Activity Types
// ============================================

export type ActivityType =
    | 'project_created'
    | 'project_updated'
    | 'project_archived'
    | 'task_created'
    | 'task_completed'
    | 'task_updated'
    | 'note_created'
    | 'note_updated'
    | 'comment_added'
    | 'backup_created'
    | 'file_added'

export interface Activity {
    id: string
    projectId: string
    type: ActivityType
    title: string
    description?: string
    targetType?: 'project' | 'task' | 'note' | 'comment'
    targetId?: string
    actorName: string
    actorAvatar?: string
    metadata?: Record<string, unknown>
    createdAt: Date
}

export interface CreateActivityInput {
    projectId: string
    type: ActivityType
    title: string
    description?: string
    targetType?: Activity['targetType']
    targetId?: string
    actorName: string
    metadata?: Record<string, unknown>
}
