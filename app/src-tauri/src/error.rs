use serde::Serialize;

/// Application error types
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    /// Database operation failed
    #[error("Database error: {0}")]
    Database(String),

    /// File system operation failed
    #[error("File system error: {0}")]
    FileSystem(#[from] std::io::Error),

    /// Git operation failed
    #[error("Git error: {0}")]
    Git(String),

    /// Resource not found
    #[error("{0} not found: {1}")]
    NotFound(&'static str, String),

    /// Invalid input provided
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    /// Permission denied (reserved for future permission handling)
    #[allow(dead_code)]
    #[error("Permission denied: {0}")]
    PermissionDenied(String),

    /// Operation conflict
    #[error("Conflict: {0}")]
    Conflict(String),

    /// Internal server error
    #[error("Internal error: {0}")]
    Internal(String),

    /// JSON serialization error
    #[error("Serialization error: {0}")]
    Serialization(String),

    /// System error
    #[error("System error: {0}")]
    System(String),
}

/// Result type alias for application operations
pub type AppResult<T> = Result<T, AppError>;

/// Serialization for sending errors to frontend
impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

/// Convert from rusqlite error
impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::Database(err.to_string())
    }
}

/// Convert from serde_json error
impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::Serialization(err.to_string())
    }
}

/// Convert from anyhow error
impl From<anyhow::Error> for AppError {
    fn from(err: anyhow::Error) -> Self {
        AppError::Internal(err.to_string())
    }
}
