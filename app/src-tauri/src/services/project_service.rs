use crate::error::{AppError, AppResult};
use crate::models::{CreateProjectDto, Project, UpdateProjectDto};
use std::fs;
use uuid::Uuid;

/// Project service for business logic
pub struct ProjectService;

impl ProjectService {
    /// Create a new project
    pub async fn create_project(data: CreateProjectDto) -> AppResult<Project> {
        // Validate input
        if data.name.is_empty() {
            return Err(AppError::InvalidInput("Project name cannot be empty".into()));
        }

        if data.path.is_empty() {
            return Err(AppError::InvalidInput("Project path cannot be empty".into()));
        }

        // Check if path already exists
        if fs::metadata(&data.path).is_ok() {
            return Err(AppError::Conflict("Project path already exists".into()));
        }

        // Create project directory
        fs::create_dir_all(&data.path)
            .map_err(|e| AppError::FileSystem(e))?;

        // Create default subdirectories
        fs::create_dir_all(format!("{}/docs", data.path))?;
        fs::create_dir_all(format!("{}/data", data.path))?;
        fs::create_dir_all(format!("{}/notes", data.path))?;

        // Generate project
        let now = chrono::Utc::now().timestamp();
        let project = Project {
            id: Uuid::new_v4().to_string(),
            name: data.name,
            path: data.path,
            description: data.description,
            status: "active".to_string(),
            created_at: now,
            last_modified_at: now,
            tags: data.tags,
        };

        // TODO: Save to database
        // TODO: Initialize git repository
        // TODO: Create research.json metadata

        Ok(project)
    }

    /// Get all projects
    pub async fn list_projects() -> AppResult<Vec<Project>> {
        // TODO: Fetch from database
        Ok(vec![])
    }

    /// Get project by ID
    pub async fn get_project(id: String) -> AppResult<Project> {
        // TODO: Fetch from database
        Err(AppError::NotFound("Project", id))
    }

    /// Update project
    pub async fn update_project(id: String, data: UpdateProjectDto) -> AppResult<Project> {
        // TODO: Update in database
        Err(AppError::NotFound("Project", id))
    }

    /// Delete project
    pub async fn delete_project(id: String) -> AppResult<()> {
        // TODO: Soft delete in database
        Err(AppError::NotFound("Project", id))
    }
}
