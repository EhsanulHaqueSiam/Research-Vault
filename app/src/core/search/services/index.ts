/**
 * Search Services - Public API
 */

export { SearchService } from './search.service'
export type { SearchResult, SearchResultType, SearchableItem } from './search.service'
export { parseNaturalQuery, getSearchSuggestions } from './naturalLanguage.service'
export type { ParsedQuery, SearchFilter } from './naturalLanguage.service'
