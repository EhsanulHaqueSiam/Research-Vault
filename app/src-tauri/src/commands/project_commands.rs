use crate::error::AppResult;
use crate::models::{CreateProjectDto, Project, UpdateProjectDto};
use crate::services::ProjectService;
use crate::state::AppState;
use tauri::State;

/// Create a new project
#[tauri::command]
pub async fn create_project(
    state: State<'_, AppState>,
    data: CreateProjectDto,
) -> AppResult<Project> {
    ProjectService::create_project(&state, data).await
}

/// List all projects
#[tauri::command]
pub async fn list_projects(state: State<'_, AppState>) -> AppResult<Vec<Project>> {
    ProjectService::list_projects(&state).await
}

/// Get project by ID
#[tauri::command]
pub async fn get_project(state: State<'_, AppState>, id: String) -> AppResult<Project> {
    ProjectService::get_project(&state, id).await
}

/// Update project
#[tauri::command]
pub async fn update_project(
    state: State<'_, AppState>,
    id: String,
    data: UpdateProjectDto,
) -> AppResult<Project> {
    ProjectService::update_project(&state, id, data).await
}

/// Delete project
#[tauri::command]
pub async fn delete_project(state: State<'_, AppState>, id: String) -> AppResult<()> {
    ProjectService::delete_project(&state, id).await
}
