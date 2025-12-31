/**
 * Base Repository Pattern
 * 
 * Abstract base class for all repositories providing standard CRUD operations
 */

export abstract class BaseRepository<T> {
    /**
     * Find all records
     */
    abstract findAll(): Promise<T[]>

    /**
     * Find a single record by ID
     */
    abstract findById(id: string): Promise<T | null>

    /**
     * Create a new record
     */
    abstract create(data: Partial<T>): Promise<T>

    /**
     * Update an existing record
     */
    abstract update(id: string, data: Partial<T>): Promise<T>

    /**
     * Delete a record
     */
    abstract delete(id: string): Promise<void>
}
