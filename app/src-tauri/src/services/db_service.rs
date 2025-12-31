use rusqlite::{params, Connection, Row};
use crate::error::AppResult;
use crate::models::{Project, Task, Note};

/// Database service for SQLite operations
pub struct DbService;

impl DbService {
    // ==========================================
    // Project Operations
    // ==========================================

    /// Insert a project into the database
    pub fn insert_project(conn: &Connection, project: &Project) -> AppResult<()> {
        let tags_json = project.tags.as_ref()
            .map(|t| serde_json::to_string(t).unwrap_or_default());
        
        conn.execute(
            "INSERT INTO projects (id, name, path, description, status, created_at, last_modified_at, tags)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                project.id,
                project.name,
                project.path,
                project.description,
                project.status,
                project.created_at,
                project.last_modified_at,
                tags_json,
            ],
        )?;
        Ok(())
    }

    /// Get all projects
    pub fn get_all_projects(conn: &Connection) -> AppResult<Vec<Project>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, path, description, status, created_at, last_modified_at, tags 
             FROM projects ORDER BY last_modified_at DESC"
        )?;
        
        let projects = stmt.query_map([], |row| {
            Ok(Self::row_to_project(row))
        })?
        .filter_map(|r| r.ok())
        .collect();
        
        Ok(projects)
    }

    /// Get project by ID
    pub fn get_project_by_id(conn: &Connection, id: &str) -> AppResult<Option<Project>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, path, description, status, created_at, last_modified_at, tags 
             FROM projects WHERE id = ?1"
        )?;
        
        let mut rows = stmt.query(params![id])?;
        
        if let Some(row) = rows.next()? {
            Ok(Some(Self::row_to_project(row)))
        } else {
            Ok(None)
        }
    }

    /// Update project
    pub fn update_project(conn: &Connection, id: &str, name: Option<&str>, description: Option<&str>, status: Option<&str>, tags: Option<&Vec<String>>) -> AppResult<()> {
        let now = chrono::Utc::now().timestamp();
        
        // Build dynamic update query
        let mut updates = vec!["last_modified_at = ?1"];
        let _params_idx = 2;
        
        if name.is_some() { updates.push("name = ?2"); }
        if description.is_some() { updates.push("description = ?3"); }
        if status.is_some() { updates.push("status = ?4"); }
        if tags.is_some() { updates.push("tags = ?5"); }
        
        let query = format!(
            "UPDATE projects SET {} WHERE id = ?6",
            updates.join(", ")
        );
        
        let tags_json = tags.map(|t| serde_json::to_string(t).unwrap_or_default());
        
        conn.execute(
            &query,
            params![
                now,
                name.unwrap_or(""),
                description.unwrap_or(""),
                status.unwrap_or(""),
                tags_json.unwrap_or_default(),
                id,
            ],
        )?;
        
        Ok(())
    }

    /// Delete project (soft delete)
    pub fn delete_project(conn: &Connection, id: &str) -> AppResult<()> {
        let now = chrono::Utc::now().timestamp();
        conn.execute(
            "UPDATE projects SET status = 'archived', last_modified_at = ?1 WHERE id = ?2",
            params![now, id],
        )?;
        Ok(())
    }

    // ==========================================
    // Task Operations
    // ==========================================

    /// Insert a task
    pub fn insert_task(conn: &Connection, task: &Task) -> AppResult<()> {
        let tags_json = task.tags.as_ref()
            .map(|t| serde_json::to_string(t).unwrap_or_default());
        
        conn.execute(
            r#"INSERT INTO tasks (id, project_id, parent_id, title, description, status, priority, 
                due_date, completed_at, created_at, updated_at, "order", tags)
               VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)"#,
            params![
                task.id,
                task.project_id,
                task.parent_id,
                task.title,
                task.description,
                task.status,
                task.priority,
                task.due_date,
                task.completed_at,
                task.created_at,
                task.updated_at,
                task.order,
                tags_json,
            ],
        )?;
        Ok(())
    }

    /// Get tasks by project ID
    pub fn get_tasks_by_project(conn: &Connection, project_id: &str) -> AppResult<Vec<Task>> {
        let mut stmt = conn.prepare(
            r#"SELECT id, project_id, parent_id, title, description, status, priority,
                due_date, completed_at, created_at, updated_at, "order", tags
               FROM tasks WHERE project_id = ?1 ORDER BY "order" ASC"#
        )?;
        
        let tasks = stmt.query_map(params![project_id], |row| {
            Ok(Self::row_to_task(row))
        })?
        .filter_map(|r| r.ok())
        .collect();
        
        Ok(tasks)
    }

    /// Get task by ID
    pub fn get_task_by_id(conn: &Connection, id: &str) -> AppResult<Option<Task>> {
        let mut stmt = conn.prepare(
            r#"SELECT id, project_id, parent_id, title, description, status, priority,
                due_date, completed_at, created_at, updated_at, "order", tags
               FROM tasks WHERE id = ?1"#
        )?;
        
        let mut rows = stmt.query(params![id])?;
        
        if let Some(row) = rows.next()? {
            Ok(Some(Self::row_to_task(row)))
        } else {
            Ok(None)
        }
    }

    /// Delete task
    pub fn delete_task(conn: &Connection, id: &str) -> AppResult<()> {
        conn.execute("DELETE FROM tasks WHERE id = ?1", params![id])?;
        Ok(())
    }

    // ==========================================
    // Note Operations  
    // ==========================================

    /// Insert a note
    pub fn insert_note(conn: &Connection, note: &Note) -> AppResult<()> {
        let tags_json = note.tags.as_ref()
            .map(|t| serde_json::to_string(t).unwrap_or_default());
        
        conn.execute(
            "INSERT INTO notes (id, project_id, title, content, created_at, updated_at, tags, is_pinned)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                note.id,
                note.project_id,
                note.title,
                note.content,
                note.created_at,
                note.updated_at,
                tags_json,
                note.is_pinned,
            ],
        )?;
        Ok(())
    }

    /// Get notes by project ID
    pub fn get_notes_by_project(conn: &Connection, project_id: &str) -> AppResult<Vec<Note>> {
        let mut stmt = conn.prepare(
            "SELECT id, project_id, title, content, created_at, updated_at, tags, is_pinned
             FROM notes WHERE project_id = ?1 ORDER BY updated_at DESC"
        )?;
        
        let notes = stmt.query_map(params![project_id], |row| {
            Ok(Self::row_to_note(row))
        })?
        .filter_map(|r| r.ok())
        .collect();
        
        Ok(notes)
    }

    /// Get note by ID
    pub fn get_note_by_id(conn: &Connection, id: &str) -> AppResult<Option<Note>> {
        let mut stmt = conn.prepare(
            "SELECT id, project_id, title, content, created_at, updated_at, tags, is_pinned
             FROM notes WHERE id = ?1"
        )?;
        
        let mut rows = stmt.query(params![id])?;
        
        if let Some(row) = rows.next()? {
            Ok(Some(Self::row_to_note(row)))
        } else {
            Ok(None)
        }
    }

    /// Delete note
    pub fn delete_note(conn: &Connection, id: &str) -> AppResult<()> {
        conn.execute("DELETE FROM notes WHERE id = ?1", params![id])?;
        Ok(())
    }
    /// Initialize the database
    pub fn init(conn: &Connection) -> AppResult<()> {
        // Create projects table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                path TEXT NOT NULL UNIQUE,
                description TEXT,
                status TEXT NOT NULL DEFAULT 'active',
                created_at INTEGER NOT NULL,
                last_modified_at INTEGER NOT NULL,
                tags TEXT
            )",
            [],
        )?;

        // Create tasks table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                parent_id TEXT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL,
                priority TEXT NOT NULL,
                due_date INTEGER,
                completed_at INTEGER,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                \"order\" INTEGER NOT NULL DEFAULT 0,
                tags TEXT,
                FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Create notes table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                is_pinned BOOLEAN DEFAULT 0,
                tags TEXT,
                FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
            )",
            [],
        )?;

        Ok(())
    }

    // ==========================================
    // Helper Functions
    // ==========================================

    fn row_to_project(row: &Row) -> Project {
        let tags_str: Option<String> = row.get("tags").unwrap_or(None);
        let tags = tags_str.and_then(|t| serde_json::from_str(&t).ok());

        Project {
            id: row.get("id").unwrap_or_default(),
            name: row.get("name").unwrap_or_default(),
            path: row.get("path").unwrap_or_default(),
            description: row.get("description").unwrap_or(None),
            status: row.get("status").unwrap_or_else(|_| "active".to_string()),
            created_at: row.get("created_at").unwrap_or_default(),
            last_modified_at: row.get("last_modified_at").unwrap_or_default(),
            tags,
        }
    }

    fn row_to_task(row: &Row) -> Task {
        let tags_str: Option<String> = row.get("tags").unwrap_or(None);
        let tags = tags_str.and_then(|t| serde_json::from_str(&t).ok());

        Task {
            id: row.get("id").unwrap_or_default(),
            project_id: row.get(1).unwrap_or_default(),
            parent_id: row.get(2).ok(),
            title: row.get(3).unwrap_or_default(),
            description: row.get(4).ok(),
            status: row.get(5).unwrap_or_default(),
            priority: row.get(6).unwrap_or_default(),
            due_date: row.get(7).ok(),
            completed_at: row.get(8).ok(),
            created_at: row.get(9).unwrap_or_default(),
            updated_at: row.get(10).unwrap_or_default(),
            order: row.get(11).unwrap_or_default(),
            tags,
        }
    }

    fn row_to_note(row: &Row) -> Note {
        let tags_str: Option<String> = row.get(6).ok();
        let tags = tags_str.and_then(|s| serde_json::from_str(&s).ok());

        Note {
            id: row.get(0).unwrap_or_default(),
            project_id: row.get(1).unwrap_or_default(),
            title: row.get(2).unwrap_or_default(),
            content: row.get(3).unwrap_or_default(),
            created_at: row.get(4).unwrap_or_default(),
            updated_at: row.get(5).unwrap_or_default(),
            tags,
            is_pinned: row.get(7).unwrap_or_default(),
        }
    }
}
