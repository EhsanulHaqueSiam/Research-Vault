use std::path::Path;
use std::process::Command;
use crate::error::{AppError, AppResult};

pub struct GitService;

impl GitService {
    /// Initialize a git repository at the given path
    pub fn init(path: &str) -> AppResult<()> {
        let output = Command::new("git")
            .arg("init")
            .current_dir(Path::new(path))
            .output()
            .map_err(|e| AppError::Git(format!("Failed to execute git init: {}", e)))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(AppError::Git(format!("Git init failed: {}", stderr)));
        }

        Ok(())
    }
}
