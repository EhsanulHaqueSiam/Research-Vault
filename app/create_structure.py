#!/usr/bin/env python3
"""
Creates the complete project structure for the Research Management System
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Frontend structure
FRONTEND_FILES = {
    "src/components/layout": ["AppShell.tsx", "Sidebar.tsx", "TitleBar.tsx", "StatusBar.tsx"],
    "src/components/project": ["ProjectList.tsx", "ProjectCard.tsx", "CreateProject.tsx", "ProjectSettings.tsx"],
    "src/components/explorer": ["FileTree.tsx", "FileNode.tsx", "ContextMenu.tsx", "FilePreview.tsx"],
    "src/components/undo-tree": ["UndoTree.tsx", "TreeNode.tsx", "TreeControls.tsx", "NodeTooltip.tsx"],
    "src/components/diff": ["DiffViewer.tsx", "SideBySide.tsx", "UnifiedDiff.tsx", "BinaryDiff.tsx"],
    "src/components/tasks": ["TaskList.tsx", "KanbanBoard.tsx", "TaskCard.tsx", "TaskForm.tsx", "SubtaskTree.tsx"],
    "src/components/notes": ["NoteEditor.tsx", "NotesList.tsx", "Toolbar.tsx"],
    "src/components/notes/Extensions": [".gitkeep"],
    "src/components/search": ["CommandPalette.tsx", "SearchResults.tsx", "Filters.tsx"],
    "src/components/backup": ["BackupManager.tsx", "BackupList.tsx", "RestoreWizard.tsx"],
    "src/components/collaboration": ["ShareDialog.tsx", "Comments.tsx", "ActivityFeed.tsx", "MemberList.tsx"],
    "src/components/analytics": ["Dashboard.tsx", "Calendar.tsx", "Charts.tsx", "Timeline.tsx"],
    "src/components/settings": ["SettingsPanel.tsx", "Preferences.tsx", "ThemeSelector.tsx", "Shortcuts.tsx"],
    "src/components/help": ["Tutorial.tsx", "HelpDialog.tsx", "VideoLibrary.tsx", "KnowledgeBase.tsx"],
    "src/components/common": ["Button.tsx", "Modal.tsx", "Tooltip.tsx", "LoadingSpinner.tsx", "ErrorBoundary.tsx", "EmptyState.tsx"],
    "src/stores": ["projectStore.ts", "fileStore.ts", "taskStore.ts", "noteStore.ts", "undoTreeStore.ts", "uiStore.ts", "settingsStore.ts"],
    "src/hooks": ["useProject.ts", "useFileSystem.ts", "useGit.ts", "useAutoSave.ts", "useKeyboard.ts", "useTheme.ts", "useDebounce.ts"],
    "src/services/api": ["tauri.ts", "database.ts", "filesystem.ts"],
    "src/services/git": ["gitService.ts", "diffService.ts", "historyService.ts", "conflictResolver.ts"],
    "src/services/backup": ["backupService.ts", "restoreService.ts", "zipService.ts"],
    "src/services/search": ["searchEngine.ts", "fuzzySearch.ts", "nlpParser.ts"],
    "src/services/sync": ["fileWatcher.ts", "syncManager.ts", "conflictDetector.ts"],
    "src/lib/utils": ["dateUtils.ts", "fileUtils.ts", "pathUtils.ts", "validators.ts"],
    "src/lib/constants": ["routes.ts", "shortcuts.ts", "config.ts"],
    "src/lib/types": ["project.ts", "task.ts", "note.ts", "git.ts", "index.ts"],
    "src/styles": ["globals.css", "animations.css"],
    "src/styles/themes": ["light.css", "dark.css", "highContrast.css"],
    "src/routes": ["__root.tsx", "index.tsx", "settings.tsx"],
    "src/routes/projects": ["index.tsx", "$projectId.tsx"],
    "src/assets/icons": [".gitkeep"],
    "src/assets/images": [".gitkeep"],
    "src/assets/fonts": [".gitkeep"],
}

# Rust backend structure
RUST_FILES = {
    "src-tauri/src/commands": ["mod.rs", "project.rs", "filesystem.rs", "git.rs", "database.rs", "backup.rs", "system.rs"],
    "src-tauri/src/services": ["mod.rs", "git_service.rs", "file_watcher.rs", "encryption.rs", "backup_service.rs"],
    "src-tauri/src/utils": ["mod.rs", "path.rs", "hash.rs", "compression.rs"],
    "src-tauri/src/state": ["mod.rs", "app_state.rs"],
}

# Test structure
TEST_FILES = {
    "tests/unit/services": [".gitkeep"],
    "tests/unit/hooks": [".gitkeep"],
    "tests/unit/utils": [".gitkeep"],
    "tests/integration": ["git.test.ts", "database.test.ts", "fileSystem.test.ts"],
    "tests/e2e": ["project-creation.spec.ts", "undo-tree.spec.ts", "task-management.spec.ts"],
}

# Documentation
DOC_FILES = {
    "docs": ["ARCHITECTURE.md", "API.md", "CONTRIBUTING.md", "USER_GUIDE.md"],
    "scripts": ["setup.sh", "build.sh", "release.sh"],
    ".github/workflows": ["ci.yml", "release.yml"],
}

def create_files(file_dict):
    """Create files from a dictionary of path: [files]"""
    for directory, files in file_dict.items():
        dir_path = BASE_DIR / directory
        dir_path.mkdir(parents=True, exist_ok=True)
        for file in files:
            file_path = dir_path / file
            if not file_path.exists():
                file_path.touch()
                print(f"Created: {file_path.relative_to(BASE_DIR)}")

def main():
    print("Creating project structure...\n")
    
    create_files(FRONTEND_FILES)
    create_files(RUST_FILES)
    create_files(TEST_FILES)
    create_files(DOC_FILES)
    
    # Create error.rs in Rust src
    error_file = BASE_DIR / "src-tauri/src/error.rs"
    if not error_file.exists():
        error_file.touch()
        print(f"Created: {error_file.relative_to(BASE_DIR)}")
    
    print("\n✅ Project structure created successfully!")
    print(f"Total directories created: {sum(len(files) for files in [FRONTEND_FILES, RUST_FILES, TEST_FILES, DOC_FILES])}")

if __name__ == "__main__":
    main()
