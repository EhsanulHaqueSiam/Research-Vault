// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod error;
mod models;
mod services;
mod state;
mod utils;

use commands::{
    // Project commands
    create_project, list_projects, get_project, update_project, delete_project,
    // Task commands
    create_task, list_tasks, get_task, update_task, delete_task,
    list_root_tasks, list_subtasks, get_task_hierarchy,
    move_task, reorder_task, list_tasks_by_status, search_tasks,
    // Note commands
    create_note, list_notes, get_note, update_note, delete_note,
    list_pinned_notes, list_recent_notes, toggle_note_pin, duplicate_note,
    search_notes, get_note_tags, list_notes_by_tags,
};
use state::AppState;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .manage(AppState::new())
        .setup(|app| {
            use tauri::Manager;
            
            let app_handle = app.handle();
            let app_data_dir = app.path().app_data_dir().unwrap();
            
            if !app_data_dir.exists() {
                std::fs::create_dir_all(&app_data_dir).unwrap();
            }
            
            let db_path = app_data_dir.join("research.db");
            let state = app_handle.state::<AppState>();
            
            if let Err(e) = state.init_db(db_path.to_str().unwrap()) {
                eprintln!("Failed to initialize database: {}", e);
                return Err(e.into());
            }
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Project commands
            create_project,
            list_projects,
            get_project,
            update_project,
            delete_project,
            // Task commands
            create_task,
            list_tasks,
            get_task,
            update_task,
            delete_task,
            list_root_tasks,
            list_subtasks,
            get_task_hierarchy,
            move_task,
            reorder_task,
            list_tasks_by_status,
            search_tasks,
            // Note commands
            create_note,
            list_notes,
            get_note,
            update_note,
            delete_note,
            list_pinned_notes,
            list_recent_notes,
            toggle_note_pin,
            duplicate_note,
            search_notes,
            get_note_tags,
            list_notes_by_tags,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
