/**
 * Research Sections Overview
 * 
 * Shows all research sections for a project
 */

import {
    BookOpen,
    GitBranch,
    FileSearch,
    Database,
    Lightbulb,
    FileText,
    ChevronRight,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Card, CardContent, Badge } from '@/components/ui'

export type ResearchSection =
    | 'literature-review'
    | 'mind-map'
    | 'methodology'
    | 'data-collection'
    | 'findings'
    | 'references'

export interface ResearchSectionInfo {
    id: ResearchSection
    name: string
    description: string
    icon: typeof BookOpen
    itemCount?: number
    lastUpdated?: Date
}

const sections: ResearchSectionInfo[] = [
    {
        id: 'literature-review',
        name: 'Literature Review',
        description: 'Track and organize research papers, citations, and reading notes',
        icon: BookOpen,
    },
    {
        id: 'mind-map',
        name: 'Mind Map',
        description: 'Visual brainstorming and connecting ideas',
        icon: GitBranch,
    },
    {
        id: 'methodology',
        name: 'Methodology',
        description: 'Document your research methods and approach',
        icon: FileSearch,
    },
    {
        id: 'data-collection',
        name: 'Data Collection',
        description: 'Organize raw data, surveys, and experiments',
        icon: Database,
    },
    {
        id: 'findings',
        name: 'Findings',
        description: 'Record results, insights, and conclusions',
        icon: Lightbulb,
    },
    {
        id: 'references',
        name: 'References',
        description: 'Manage your bibliography and citations',
        icon: FileText,
    },
]

export interface ResearchSectionsProps {
    projectId: string
    activeSection?: ResearchSection
    onSelectSection?: (section: ResearchSection) => void
    sectionCounts?: Partial<Record<ResearchSection, number>>
    className?: string
}

export function ResearchSections({
    projectId: _projectId,
    activeSection,
    onSelectSection,
    sectionCounts = {},
    className,
}: ResearchSectionsProps) {
    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
            {sections.map(section => {
                const Icon = section.icon
                const count = sectionCounts[section.id]
                const isActive = activeSection === section.id

                return (
                    <Card
                        key={section.id}
                        className={cn(
                            'cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
                            isActive && 'border-primary bg-primary/5'
                        )}
                        onClick={() => onSelectSection?.(section.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'p-2 rounded-lg',
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                    )}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{section.name}</h3>
                                        {count !== undefined && (
                                            <Badge variant="secondary" className="mt-1">
                                                {count} items
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className={cn(
                                    'h-5 w-5 text-muted-foreground transition-transform',
                                    isActive && 'text-primary rotate-90'
                                )} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                {section.description}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default ResearchSections
