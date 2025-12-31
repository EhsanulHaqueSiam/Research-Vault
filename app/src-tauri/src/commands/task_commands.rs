use crate::error::AppResult;
use crate::models::{CreateTaskDto, Task, UpdateTaskDto, TaskWithChildren};
use crate::services::TaskService;

/// Create a new task
#[tauri::command]
pub async fn create_task(data: CreateTaskDto) -> AppResult<Task> {
    TaskService::create_task(data).await
}

/// List all tasks for a project
#[tauri::command]
pub async fn list_tasks(project_id: String) -> AppResult<Vec<Task>> {
    TaskService::list_tasks(project_id).await
}

/// List root tasks (no parent) for a project
#[tauri::command]
pub async fn list_root_tasks(project_id: String) -> AppResult<Vec<Task>> {
    TaskService::list_root_tasks(project_id).await
}

/// List subtasks for a parent task
#[tauri::command]
pub async fn list_subtasks(parent_id: String) -> AppResult<Vec<Task>> {
    TaskService::list_subtasks(parent_id).await
}

/// Get task by ID
#[tauri::command]
pub async fn get_task(id: String) -> AppResult<Task> {
    TaskService::get_task(id).await
}

/// Get task with all descendants (hierarchy)
#[tauri::command]
pub async fn get_task_hierarchy(id: String) -> AppResult<TaskWithChildren> {
    TaskService::get_task_hierarchy(id).await
}

/// Update task
#[tauri::command]
pub async fn update_task(id: String, data: UpdateTaskDto) -> AppResult<Task> {
    TaskService::update_task(id, data).await
}

/// Delete task and all subtasks
#[tauri::command]
pub async fn delete_task(id: String) -> AppResult<()> {
    TaskService::delete_task(id).await
}

/// Move task to a different parent
#[tauri::command]
pub async fn move_task(id: String, new_parent_id: Option<String>) -> AppResult<Task> {
    TaskService::move_task(id, new_parent_id).await
}

/// Reorder task
#[tauri::command]
pub async fn reorder_task(id: String, new_order: i32) -> AppResult<Task> {
    TaskService::reorder_task(id, new_order).await
}

/// List tasks by status
#[tauri::command]
pub async fn list_tasks_by_status(project_id: String, status: String) -> AppResult<Vec<Task>> {
    TaskService::list_tasks_by_status(project_id, status).await
}

/// Search tasks
#[tauri::command]
pub async fn search_tasks(project_id: String, query: String) -> AppResult<Vec<Task>> {
    TaskService::search_tasks(project_id, query).await
}
