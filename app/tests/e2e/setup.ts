/**
 * E2E Test Configuration
 * 
 * Setup for end-to-end testing with Playwright
 */

import { test, expect, type Page } from '@playwright/test'

// ============================================
// Page Objects
// ============================================

export class AppPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/')
    }

    async waitForApp() {
        await this.page.waitForSelector('[data-testid="app-container"]', { timeout: 10000 })
    }

    async getTitle() {
        return this.page.title()
    }
}

export class ProjectsPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/projects')
    }

    async createProject(name: string) {
        await this.page.click('[data-testid="create-project-btn"]')
        await this.page.fill('[data-testid="project-name-input"]', name)
        await this.page.click('[data-testid="submit-project-btn"]')
    }

    async getProjectCards() {
        return this.page.locator('[data-testid="project-card"]')
    }

    async openProject(name: string) {
        await this.page.click(`[data-testid="project-card"]:has-text("${name}")`)
    }
}

export class TasksPage {
    constructor(private page: Page) { }

    async createTask(title: string) {
        await this.page.click('[data-testid="create-task-btn"]')
        await this.page.fill('[data-testid="task-title-input"]', title)
        await this.page.click('[data-testid="submit-task-btn"]')
    }

    async toggleTaskComplete(title: string) {
        await this.page.click(`[data-testid="task-item"]:has-text("${title}") [data-testid="task-checkbox"]`)
    }

    async getTaskItems() {
        return this.page.locator('[data-testid="task-item"]')
    }
}

export class NotesPage {
    constructor(private page: Page) { }

    async createNote(title: string, content: string) {
        await this.page.click('[data-testid="create-note-btn"]')
        await this.page.fill('[data-testid="note-title-input"]', title)
        await this.page.fill('[data-testid="note-content-editor"]', content)
        await this.page.click('[data-testid="save-note-btn"]')
    }

    async getNoteCards() {
        return this.page.locator('[data-testid="note-card"]')
    }
}

// ============================================
// Test Fixtures
// ============================================

export const fixtures = {
    testProject: {
        name: 'Test Research Project',
        description: 'A project for E2E testing',
    },
    testTask: {
        title: 'Complete E2E test setup',
        priority: 'high',
    },
    testNote: {
        title: 'Test Note',
        content: 'This is a test note content',
    },
}

// ============================================
// Helper Functions
// ============================================

export async function login(page: Page) {
    // If authentication is implemented
    await page.goto('/login')
    // await page.fill('[data-testid="email-input"]', 'test@example.com')
    // await page.fill('[data-testid="password-input"]', 'password')
    // await page.click('[data-testid="login-btn"]')
}

export async function clearTestData(_page: Page) {
    // Clear any test data before/after tests
    // This would call an API or use direct database access
}

// ============================================
// Export Common Assertions
// ============================================

export { test, expect }
