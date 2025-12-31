use crate::error::AppResult;
use crate::models::{CreateNoteDto, Note, UpdateNoteDto};
use crate::services::NoteService;

/// Create a new note
#[tauri::command]
pub async fn create_note(data: CreateNoteDto) -> AppResult<Note> {
    NoteService::create_note(data).await
}

/// List all notes for a project
#[tauri::command]
pub async fn list_notes(project_id: String) -> AppResult<Vec<Note>> {
    NoteService::list_notes(project_id).await
}

/// List pinned notes for a project
#[tauri::command]
pub async fn list_pinned_notes(project_id: String) -> AppResult<Vec<Note>> {
    NoteService::list_pinned_notes(project_id).await
}

/// List recent notes
#[tauri::command]
pub async fn list_recent_notes(project_id: String, limit: i32) -> AppResult<Vec<Note>> {
    NoteService::list_recent_notes(project_id, limit).await
}

/// Get note by ID
#[tauri::command]
pub async fn get_note(id: String) -> AppResult<Note> {
    NoteService::get_note(id).await
}

/// Update note
#[tauri::command]
pub async fn update_note(id: String, data: UpdateNoteDto) -> AppResult<Note> {
    NoteService::update_note(id, data).await
}

/// Delete note
#[tauri::command]
pub async fn delete_note(id: String) -> AppResult<()> {
    NoteService::delete_note(id).await
}

/// Toggle pin status
#[tauri::command]
pub async fn toggle_note_pin(id: String) -> AppResult<Note> {
    NoteService::toggle_pin(id).await
}

/// Duplicate note
#[tauri::command]
pub async fn duplicate_note(id: String, new_title: Option<String>) -> AppResult<Note> {
    NoteService::duplicate_note(id, new_title).await
}

/// Search notes
#[tauri::command]
pub async fn search_notes(project_id: String, query: String) -> AppResult<Vec<Note>> {
    NoteService::search_notes(project_id, query).await
}

/// Get all tags for a project
#[tauri::command]
pub async fn get_note_tags(project_id: String) -> AppResult<Vec<String>> {
    NoteService::get_all_tags(project_id).await
}

/// Get notes by tags
#[tauri::command]
pub async fn list_notes_by_tags(project_id: String, tags: Vec<String>) -> AppResult<Vec<Note>> {
    NoteService::list_notes_by_tags(project_id, tags).await
}
