//! Research Management Library
//! 
//! Core library for the Research Management desktop application.

pub mod commands;
pub mod error;
pub mod models;
pub mod services;
pub mod state;
pub mod utils;

pub use error::{AppError, AppResult};
