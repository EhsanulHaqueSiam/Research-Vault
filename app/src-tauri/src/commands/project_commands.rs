use crate::error::{AppError, AppResult};
use crate::models::{CreateProjectDto, Project, UpdateProjectDto};
use crate::services::ProjectService;

/// Create a new project
#[tauri::command]
pub async fn create_project(data: CreateProjectDto) -> AppResult<Project> {
    ProjectService::create_project(data).await
}

/// List all projects
#[tauri::command]
pub async fn list_projects() -> AppResult<Vec<Project>> {
    ProjectService::list_projects().await
}

/// Get project by ID
#[tauri::command]
pub async fn get_project(id: String) -> AppResult<Project> {
    ProjectService::get_project(id).await
}

/// Update project
#[tauri::command]
pub async fn update_project(id: String, data: UpdateProjectDto) -> AppResult<Project> {
    ProjectService::update_project(id, data).await
}

/// Delete project
#[tauri::command]
pub async fn delete_project(id: String) -> AppResult<()> {
    ProjectService::delete_project(id).await
}
