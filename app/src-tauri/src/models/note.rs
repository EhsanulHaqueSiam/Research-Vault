use serde::{Deserialize, Serialize};

/// Note data transfer object for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateNoteDto {
    pub project_id: String,
    pub title: String,
    pub content: String,
    pub tags: Option<Vec<String>>,
    pub is_pinned: Option<bool>,
}

/// Note data transfer object for updates
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateNoteDto {
    pub title: Option<String>,
    pub content: Option<String>,
    pub tags: Option<Vec<String>>,
    pub is_pinned: Option<bool>,
}

/// Note model
#[derive(Debug, Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub project_id: String,
    pub title: String,
    pub content: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub tags: Option<Vec<String>>,
    pub is_pinned: bool,
}
