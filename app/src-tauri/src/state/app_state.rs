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

    /// Initialize the database
    pub fn init_db(&self, path: &str) -> Result<(), rusqlite::Error> {
        let conn = Connection::open(path)?;
        
        // Enable foreign keys
        conn.execute_batch("PRAGMA foreign_keys = ON;")?;
        
        // Initialize schema via DbService
        if let Err(e) = crate::services::DbService::init(&conn) {
            eprintln!("Failed to initialize database schema: {}", e);
            return Err(rusqlite::Error::SqliteFailure(
                rusqlite::ffi::Error::new(1),
                Some(e.to_string()),
            ));
        }
        
        let mut db = self.db.lock().unwrap();
        *db = Some(conn);
        
        Ok(())
    }

    /// Get database connection (will be used by future Tauri commands)
    #[allow(dead_code)]
    pub fn get_db(&self) -> std::sync::MutexGuard<'_, Option<Connection>> {
        self.db.lock().unwrap()
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}
