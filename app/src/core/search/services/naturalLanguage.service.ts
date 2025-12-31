/**
 * Natural Language Search Parser
 * 
 * Parses natural language queries into structured filters
 * - Date parsing: "last week", "yesterday", "this month"
 * - Type filters: "type:note", "type:project"
 * - Tag filters: "tag:important", "#research"
 * - Date ranges: "after:2024-01-01", "before:2024-12-31"
 */

// ============================================
// Types
// ============================================

export interface ParsedQuery {
    text: string // The remaining search text
    filters: SearchFilter[]
}

export interface SearchFilter {
    type: 'date' | 'type' | 'tag' | 'status'
    operator: 'eq' | 'before' | 'after' | 'contains'
    value: string | Date
}

// ============================================
// Date Parsing
// ============================================

const DATE_PATTERNS: { pattern: RegExp; getDate: () => Date }[] = [
    {
        pattern: /\btoday\b/i,
        getDate: () => {
            const d = new Date()
            d.setHours(0, 0, 0, 0)
            return d
        },
    },
    {
        pattern: /\byesterday\b/i,
        getDate: () => {
            const d = new Date()
            d.setDate(d.getDate() - 1)
            d.setHours(0, 0, 0, 0)
            return d
        },
    },
    {
        pattern: /\blast\s*week\b/i,
        getDate: () => {
            const d = new Date()
            d.setDate(d.getDate() - 7)
            d.setHours(0, 0, 0, 0)
            return d
        },
    },
    {
        pattern: /\bthis\s*week\b/i,
        getDate: () => {
            const d = new Date()
            const day = d.getDay()
            d.setDate(d.getDate() - day)
            d.setHours(0, 0, 0, 0)
            return d
        },
    },
    {
        pattern: /\blast\s*month\b/i,
        getDate: () => {
            const d = new Date()
            d.setMonth(d.getMonth() - 1)
            d.setHours(0, 0, 0, 0)
            return d
        },
    },
    {
        pattern: /\bthis\s*month\b/i,
        getDate: () => {
            const d = new Date()
            d.setDate(1)
            d.setHours(0, 0, 0, 0)
            return d
        },
    },
    {
        pattern: /\bthis\s*year\b/i,
        getDate: () => {
            const d = new Date()
            d.setMonth(0, 1)
            d.setHours(0, 0, 0, 0)
            return d
        },
    },
]

// ============================================
// Filter Patterns
// ============================================

const FILTER_PATTERNS = {
    type: /\btype:(\w+)/gi,
    tag: /\btag:(\w+)/gi,
    hashTag: /#(\w+)/g,
    status: /\bstatus:(\w+)/gi,
    after: /\bafter:(\d{4}-\d{2}-\d{2})/gi,
    before: /\bbefore:(\d{4}-\d{2}-\d{2})/gi,
}

// ============================================
// Parser
// ============================================

export function parseNaturalQuery(query: string): ParsedQuery {
    const filters: SearchFilter[] = []
    let text = query

    // Parse date keywords
    for (const { pattern, getDate } of DATE_PATTERNS) {
        if (pattern.test(text)) {
            filters.push({
                type: 'date',
                operator: 'after',
                value: getDate(),
            })
            text = text.replace(pattern, '').trim()
        }
    }

    // Parse type: filters
    let match
    while ((match = FILTER_PATTERNS.type.exec(query)) !== null) {
        filters.push({
            type: 'type',
            operator: 'eq',
            value: match[1].toLowerCase(),
        })
        text = text.replace(match[0], '').trim()
    }

    // Parse tag: filters and #hashtags
    FILTER_PATTERNS.tag.lastIndex = 0
    while ((match = FILTER_PATTERNS.tag.exec(query)) !== null) {
        filters.push({
            type: 'tag',
            operator: 'contains',
            value: match[1].toLowerCase(),
        })
        text = text.replace(match[0], '').trim()
    }

    FILTER_PATTERNS.hashTag.lastIndex = 0
    while ((match = FILTER_PATTERNS.hashTag.exec(query)) !== null) {
        filters.push({
            type: 'tag',
            operator: 'contains',
            value: match[1].toLowerCase(),
        })
        text = text.replace(match[0], '').trim()
    }

    // Parse status: filters
    FILTER_PATTERNS.status.lastIndex = 0
    while ((match = FILTER_PATTERNS.status.exec(query)) !== null) {
        filters.push({
            type: 'status',
            operator: 'eq',
            value: match[1].toLowerCase(),
        })
        text = text.replace(match[0], '').trim()
    }

    // Parse after: date filters
    FILTER_PATTERNS.after.lastIndex = 0
    while ((match = FILTER_PATTERNS.after.exec(query)) !== null) {
        filters.push({
            type: 'date',
            operator: 'after',
            value: new Date(match[1]),
        })
        text = text.replace(match[0], '').trim()
    }

    // Parse before: date filters
    FILTER_PATTERNS.before.lastIndex = 0
    while ((match = FILTER_PATTERNS.before.exec(query)) !== null) {
        filters.push({
            type: 'date',
            operator: 'before',
            value: new Date(match[1]),
        })
        text = text.replace(match[0], '').trim()
    }

    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim()

    return { text, filters }
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(query: string): string[] {
    const suggestions: string[] = []
    const lower = query.toLowerCase()

    // Suggest date keywords
    if ('today'.startsWith(lower) || lower === '') suggestions.push('today')
    if ('yesterday'.startsWith(lower)) suggestions.push('yesterday')
    if ('last week'.startsWith(lower)) suggestions.push('last week')
    if ('this week'.startsWith(lower)) suggestions.push('this week')
    if ('this month'.startsWith(lower)) suggestions.push('this month')

    // Suggest filters
    if ('type:'.startsWith(lower)) {
        suggestions.push('type:project', 'type:note', 'type:task')
    }
    if ('tag:'.startsWith(lower)) {
        suggestions.push('tag:')
    }
    if ('status:'.startsWith(lower)) {
        suggestions.push('status:active', 'status:completed', 'status:pending')
    }
    if ('after:'.startsWith(lower) || 'before:'.startsWith(lower)) {
        const today = new Date().toISOString().split('T')[0]
        suggestions.push(`after:${today}`, `before:${today}`)
    }

    return suggestions.slice(0, 5)
}
