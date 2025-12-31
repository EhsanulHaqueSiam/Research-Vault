use crate::error::{AppError, AppResult};
use crate::models::{CreateProjectDto, Project, UpdateProjectDto};
use crate::services::{DbService, GitService};
use crate::state::AppState;
use std::fs;
use uuid::Uuid;

/// Project service for business logic
pub struct ProjectService;

impl ProjectService {
    /// Create a new project
    pub async fn create_project(state: &AppState, data: CreateProjectDto) -> AppResult<Project> {
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

        // Initialize git repository
        GitService::init(&data.path)?;

        // Create research.json metadata
        let now = chrono::Utc::now().timestamp();
        let metadata = serde_json::json!({
            "version": "1.0.0",
            "title": data.name,
            "description": data.description,
            "created_at": chrono::Utc::now().to_rfc3339(),
            "updated_at": chrono::Utc::now().to_rfc3339(),
            "settings": {
                "auto_commit": true,
                "backup_enabled": true
            }
        });

        let metadata_path = format!("{}/research.json", data.path);
        fs::write(metadata_path, serde_json::to_string_pretty(&metadata)?)
            .map_err(|e| AppError::FileSystem(e))?;

        // Generate project model
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

        // Save to database
        let db = state.db.lock().map_err(|_| AppError::System("Failed to lock database".into()))?;
        if let Some(conn) = db.as_ref() {
            DbService::insert_project(conn, &project)?;
        } else {
            return Err(AppError::System("Database not initialized".into()));
        }

        Ok(project)
    }

    /// Get all projects
    pub async fn list_projects(state: &AppState) -> AppResult<Vec<Project>> {
        let db = state.db.lock().map_err(|_| AppError::System("Failed to lock database".into()))?;
        if let Some(conn) = db.as_ref() {
            DbService::get_all_projects(conn)
        } else {
            Err(AppError::System("Database not initialized".into()))
        }
    }

    /// Get project by ID
    pub async fn get_project(state: &AppState, id: String) -> AppResult<Project> {
        let db = state.db.lock().map_err(|_| AppError::System("Failed to lock database".into()))?;
        if let Some(conn) = db.as_ref() {
            let project = DbService::get_project_by_id(conn, &id)?;
            project.ok_or_else(|| AppError::NotFound("Project", id))
        } else {
            Err(AppError::System("Database not initialized".into()))
        }
    }

    /// Update project
    pub async fn update_project(state: &AppState, id: String, data: UpdateProjectDto) -> AppResult<Project> {
        let db = state.db.lock().map_err(|_| AppError::System("Failed to lock database".into()))?;
        if let Some(conn) = db.as_ref() {
            DbService::update_project(
                conn, 
                &id, 
                data.name.as_deref(), 
                data.description.as_deref(), 
                data.status.as_deref(), 
                data.tags.as_ref()
            )?;
            
            // Return updated project
            let project = DbService::get_project_by_id(conn, &id)?;
            project.ok_or_else(|| AppError::NotFound("Project", id))
        } else {
            Err(AppError::System("Database not initialized".into()))
        }
    }

    /// Delete project
    pub async fn delete_project(state: &AppState, id: String) -> AppResult<()> {
        let db = state.db.lock().map_err(|_| AppError::System("Failed to lock database".into()))?;
        if let Some(conn) = db.as_ref() {
            DbService::delete_project(conn, &id)
        } else {
            Err(AppError::System("Database not initialized".into()))
        }
    }
}
