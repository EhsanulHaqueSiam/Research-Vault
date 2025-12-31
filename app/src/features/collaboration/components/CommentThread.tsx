/**
 * Comment Thread Component
 * 
 * Display and manage comments with threaded replies
 */

import { useState, useCallback } from 'react'
import {
    MessageCircle,
    Reply,
    Edit2,
    Trash2,
    Send,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Comment } from '../types'

// ============================================
// Props
// ============================================

export interface CommentThreadProps {
    comments: Comment[]
    onAddComment: (content: string, parentId?: string) => void
    onEditComment: (commentId: string, content: string) => void
    onDeleteComment: (commentId: string) => void
    currentUser?: string
}

// ============================================
// Single Comment Component
// ============================================

interface SingleCommentProps {
    comment: Comment
    onReply: (parentId: string) => void
    onEdit: (commentId: string, content: string) => void
    onDelete: (commentId: string) => void
    isCurrentUser: boolean
    depth?: number
}

function SingleComment({ comment, onReply, onEdit, onDelete, isCurrentUser, depth = 0 }: SingleCommentProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [showActions, setShowActions] = useState(false)

    const handleSaveEdit = () => {
        onEdit(comment.id, editContent)
        setIsEditing(false)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div
            className={cn('group', depth > 0 && 'ml-8 border-l-2 border-slate-200 dark:border-slate-700 pl-4')}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                    {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm">{comment.authorName}</span>
                <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                {comment.isEdited && <span className="text-xs text-slate-400">(edited)</span>}
            </div>

            {/* Content */}
            {isEditing ? (
                <div className="ml-9 space-y-2">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 resize-none"
                        rows={2}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <p className="ml-9 text-sm text-slate-700 dark:text-slate-300">
                    {comment.content}
                </p>
            )}

            {/* Actions */}
            <div className={cn(
                'ml-9 mt-1 flex items-center gap-2 transition-opacity',
                showActions ? 'opacity-100' : 'opacity-0'
            )}>
                <button
                    onClick={() => onReply(comment.id)}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                >
                    <Reply size={12} />
                    Reply
                </button>
                {isCurrentUser && (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                            <Edit2 size={12} />
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="flex items-center gap-1 px-2 py-0.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                            <Trash2 size={12} />
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

// ============================================
// Comment Thread Component
// ============================================

export function CommentThread({
    comments,
    onAddComment,
    onEditComment,
    onDeleteComment,
    currentUser = 'You',
}: CommentThreadProps) {
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)

    const handleSubmit = useCallback(() => {
        if (newComment.trim()) {
            onAddComment(newComment, replyingTo || undefined)
            setNewComment('')
            setReplyingTo(null)
        }
    }, [newComment, replyingTo, onAddComment])

    // Group comments by parent
    const topLevel = comments.filter(c => !c.parentId)
    const replies = comments.filter(c => c.parentId)

    const getReplies = (parentId: string) => replies.filter(r => r.parentId === parentId)

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-blue-500" />
                <h3 className="font-semibold">Comments ({comments.length})</h3>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {topLevel.map(comment => (
                    <div key={comment.id} className="space-y-3">
                        <SingleComment
                            comment={comment}
                            onReply={setReplyingTo}
                            onEdit={onEditComment}
                            onDelete={onDeleteComment}
                            isCurrentUser={comment.authorName === currentUser}
                        />
                        {/* Replies */}
                        {getReplies(comment.id).map(reply => (
                            <SingleComment
                                key={reply.id}
                                comment={reply}
                                onReply={setReplyingTo}
                                onEdit={onEditComment}
                                onDelete={onDeleteComment}
                                isCurrentUser={reply.authorName === currentUser}
                                depth={1}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* New Comment Input */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                {replyingTo && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                        <Reply size={12} />
                        Replying to comment
                        <button
                            onClick={() => setReplyingTo(null)}
                            className="text-blue-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!newComment.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CommentThread
