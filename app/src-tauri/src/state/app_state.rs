use rusqlite::Connection;
use std::sync::Mutex;

/// Application state managed by Tauri
pub struct AppState {
    pub db: Mutex<Option<Connection>>,
}

impl AppState {
    /// Create new application state
    pub fn new() -> Self {
        Self {
            db: Mutex::new(None),
        }
    }

    /// Initialize the database connection
    pub fn init_db(&self, path: &str) -> Result<(), rusqlite::Error> {
        let conn = Connection::open(path)?;
        
        // Enable foreign keys
        conn.execute_batch("PRAGMA foreign_keys = ON;")?;
        
        // Run migrations
        self.run_migrations(&conn)?;
        
        let mut db = self.db.lock().unwrap();
        *db = Some(conn);
        
        Ok(())
    }

    /// Run database migrations
    fn run_migrations(&self, conn: &Connection) -> Result<(), rusqlite::Error> {
        conn.execute_batch(
            r#"
            -- Projects table
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                path TEXT NOT NULL UNIQUE,
                description TEXT,
                status TEXT NOT NULL DEFAULT 'active',
                created_at INTEGER NOT NULL,
                last_modified_at INTEGER NOT NULL,
                tags TEXT,
                metadata TEXT
            );

            -- Tasks table
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                parent_id TEXT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL DEFAULT 'todo',
                priority TEXT NOT NULL DEFAULT 'medium',
                due_date INTEGER,
                completed_at INTEGER,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                "order" INTEGER NOT NULL DEFAULT 0,
                tags TEXT
            );

            -- Notes table
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                tags TEXT,
                is_pinned INTEGER NOT NULL DEFAULT 0
            );

            -- Tags table
            CREATE TABLE IF NOT EXISTS tags (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                color TEXT,
                created_at INTEGER NOT NULL
            );

            -- Junction tables
            CREATE TABLE IF NOT EXISTS project_tags (
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (project_id, tag_id)
            );

            CREATE TABLE IF NOT EXISTS task_tags (
                task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
                tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (task_id, tag_id)
            );

            CREATE TABLE IF NOT EXISTS note_tags (
                note_id TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
                tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (note_id, tag_id)
            );

            -- File metadata table
            CREATE TABLE IF NOT EXISTS file_metadata (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                relative_path TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_extension TEXT,
                file_size INTEGER,
                mime_type TEXT,
                git_hash TEXT,
                last_commit_hash TEXT,
                created_at INTEGER NOT NULL,
                modified_at INTEGER NOT NULL,
                last_indexed_at INTEGER,
                content TEXT,
                metadata TEXT,
                is_deleted INTEGER NOT NULL DEFAULT 0,
                is_ignored INTEGER NOT NULL DEFAULT 0
            );

            -- Indexes for performance
            CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
            CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id);
            CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
            CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
            CREATE INDEX IF NOT EXISTS idx_file_metadata_project_id ON file_metadata(project_id);
            "#
        )?;
        
        Ok(())
    }

    /// Get database connection
    pub fn get_db(&self) -> std::sync::MutexGuard<Option<Connection>> {
        self.db.lock().unwrap()
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}
