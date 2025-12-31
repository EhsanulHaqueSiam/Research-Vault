use serde::{Deserialize, Serialize};

/// Task data transfer object for creation
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTaskDto {
    pub project_id: String,
    pub parent_id: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub status: Option<String>,  // todo, in_progress, done
    pub priority: Option<String>, // low, medium, high
    pub due_date: Option<i64>,
    pub order: Option<i32>,
    pub tags: Option<Vec<String>>,
}

/// Task data transfer object for updates
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateTaskDto {
    pub title: Option<String>,
    pub description: Option<String>,
    pub status: Option<String>,
    pub priority: Option<String>,
    pub due_date: Option<i64>,
    pub parent_id: Option<String>,
    pub order: Option<i32>,
    pub tags: Option<Vec<String>>,
}

/// Task model
#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub project_id: String,
    pub parent_id: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    pub priority: String,
    pub due_date: Option<i64>,
    pub completed_at: Option<i64>,
    pub created_at: i64,
    pub updated_at: i64,
    pub order: i32,
    pub tags: Option<Vec<String>>,
}

/// Hierarchical task with children
#[derive(Debug, Serialize, Deserialize)]
pub struct TaskWithChildren {
    #[serde(flatten)]
    pub task: Task,
    pub children: Vec<TaskWithChildren>,
}
