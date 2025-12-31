/**
 * Literature Review Component
 * 
 * Track research papers, citations, and notes
 */

import { useState } from 'react'
import {
    BookOpen,
    Plus,
    Search,
    ExternalLink,
    Star,
    StarOff,
    Trash2,
    StickyNote,
} from 'lucide-react'
import { Button, Input, Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { cn } from '@/shared/utils/cn'

export interface Paper {
    id: string
    title: string
    authors: string[]
    year: number
    journal?: string
    doi?: string
    url?: string
    abstract?: string
    notes?: string
    tags?: string[]
    isStarred?: boolean
    dateAdded: Date
}

export interface LiteratureReviewProps {
    projectId: string
    papers?: Paper[]
    onAddPaper?: (paper: Omit<Paper, 'id' | 'dateAdded'>) => void
    onRemovePaper?: (id: string) => void
    onUpdatePaper?: (id: string, data: Partial<Paper>) => void
    className?: string
}

export function LiteratureReview({
    projectId: _projectId,
    papers = [],
    onAddPaper,
    onRemovePaper,
    onUpdatePaper,
    className,
}: LiteratureReviewProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)

    // New paper form state
    const [newPaper, setNewPaper] = useState({
        title: '',
        authors: '',
        year: new Date().getFullYear(),
        journal: '',
        doi: '',
        notes: '',
    })

    const filteredPapers = papers.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleAddPaper = () => {
        if (!newPaper.title) return

        onAddPaper?.({
            title: newPaper.title,
            authors: newPaper.authors.split(',').map(a => a.trim()),
            year: newPaper.year,
            journal: newPaper.journal || undefined,
            doi: newPaper.doi || undefined,
            notes: newPaper.notes || undefined,
        })

        setNewPaper({ title: '', authors: '', year: new Date().getFullYear(), journal: '', doi: '', notes: '' })
        setShowAddForm(false)
    }

    const toggleStar = (id: string, isStarred: boolean) => {
        onUpdatePaper?.(id, { isStarred: !isStarred })
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Literature Review</h2>
                    <Badge variant="secondary">{papers.length} papers</Badge>
                </div>
                <Button onClick={() => setShowAddForm(true)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Paper
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Add Paper Form */}
            {showAddForm && (
                <Card className="border-primary">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Add New Paper</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Input
                            placeholder="Paper Title *"
                            value={newPaper.title}
                            onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                        />
                        <Input
                            placeholder="Authors (comma separated)"
                            value={newPaper.authors}
                            onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Year"
                                value={newPaper.year}
                                onChange={(e) => setNewPaper({ ...newPaper, year: parseInt(e.target.value) })}
                                className="w-24"
                            />
                            <Input
                                placeholder="Journal/Conference"
                                value={newPaper.journal}
                                onChange={(e) => setNewPaper({ ...newPaper, journal: e.target.value })}
                                className="flex-1"
                            />
                        </div>
                        <Input
                            placeholder="DOI (e.g., 10.1000/xyz123)"
                            value={newPaper.doi}
                            onChange={(e) => setNewPaper({ ...newPaper, doi: e.target.value })}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddPaper} disabled={!newPaper.title}>
                                Add Paper
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Papers List */}
            <div className="space-y-2">
                {filteredPapers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No papers yet</p>
                        <p className="text-sm">Add papers to track your literature review</p>
                    </div>
                ) : (
                    filteredPapers.map(paper => (
                        <Card
                            key={paper.id}
                            className={cn(
                                'cursor-pointer hover:border-primary/50 transition-colors',
                                selectedPaper?.id === paper.id && 'border-primary'
                            )}
                            onClick={() => setSelectedPaper(paper)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm line-clamp-2">{paper.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {paper.authors.join(', ')} ({paper.year})
                                        </p>
                                        {paper.journal && (
                                            <p className="text-xs text-muted-foreground italic">{paper.journal}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleStar(paper.id, paper.isStarred || false)
                                            }}
                                        >
                                            {paper.isStarred ? (
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            ) : (
                                                <StarOff className="h-4 w-4" />
                                            )}
                                        </Button>
                                        {paper.doi && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    window.open(`https://doi.org/${paper.doi}`, '_blank')
                                                }}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onRemovePaper?.(paper.id)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                {paper.notes && (
                                    <div className="mt-2 pt-2 border-t">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                            <StickyNote className="h-3 w-3" />
                                            Notes
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{paper.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default LiteratureReview
