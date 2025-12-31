use serde::{Deserialize, Serialize};

/// Project data transfer object for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProjectDto {
    pub name: String,
    pub path: String,
    pub description: Option<String>,
    pub tags: Option<Vec<String>>,
}

/// Project data transfer object for updates
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProjectDto {
    pub name: Option<String>,
    pub description: Option<String>,
    pub status: Option<String>,
    pub tags: Option<Vec<String>>,
}

/// Project model
#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
    pub description: Option<String>,
    pub status: String,
    pub created_at: i64,
    pub last_modified_at: i64,
    pub tags: Option<Vec<String>>,
}
