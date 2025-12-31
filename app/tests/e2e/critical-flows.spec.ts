/**
 * Critical Flows E2E Tests
 * 
 * End-to-end tests for critical user journeys
 */

import { test, expect, fixtures, AppPage, ProjectsPage, TasksPage, NotesPage } from './setup'

test.describe('Application Launch', () => {
    test('should load the application', async ({ page }) => {
        const appPage = new AppPage(page)
        await appPage.goto()

        const title = await appPage.getTitle()
        expect(title).toContain('Research Management')
    })
})

test.describe('Project Management Flow', () => {
    test('should create a new project', async ({ page }) => {
        const projectsPage = new ProjectsPage(page)
        await projectsPage.goto()

        await projectsPage.createProject(fixtures.testProject.name)

        const projectCards = await projectsPage.getProjectCards()
        await expect(projectCards).toContainText(fixtures.testProject.name)
    })

    test('should open project and view details', async ({ page }) => {
        const projectsPage = new ProjectsPage(page)
        await projectsPage.goto()

        await projectsPage.openProject(fixtures.testProject.name)

        await expect(page.locator('h1')).toContainText(fixtures.testProject.name)
    })
})

test.describe('Task Management Flow', () => {
    test('should create a task within a project', async ({ page }) => {
        const projectsPage = new ProjectsPage(page)
        const tasksPage = new TasksPage(page)

        await projectsPage.goto()
        await projectsPage.openProject(fixtures.testProject.name)

        await tasksPage.createTask(fixtures.testTask.title)

        const taskItems = await tasksPage.getTaskItems()
        await expect(taskItems).toContainText(fixtures.testTask.title)
    })

    test('should mark task as complete', async ({ page }) => {
        const projectsPage = new ProjectsPage(page)
        const tasksPage = new TasksPage(page)

        await projectsPage.goto()
        await projectsPage.openProject(fixtures.testProject.name)

        await tasksPage.toggleTaskComplete(fixtures.testTask.title)

        await expect(
            page.locator(`[data-testid="task-item"]:has-text("${fixtures.testTask.title}")`)
        ).toHaveAttribute('data-completed', 'true')
    })
})

test.describe('Note Taking Flow', () => {
    test('should create a note with rich text', async ({ page }) => {
        const projectsPage = new ProjectsPage(page)
        const notesPage = new NotesPage(page)

        await projectsPage.goto()
        await projectsPage.openProject(fixtures.testProject.name)

        await notesPage.createNote(fixtures.testNote.title, fixtures.testNote.content)

        const noteCards = await notesPage.getNoteCards()
        await expect(noteCards).toContainText(fixtures.testNote.title)
    })
})

test.describe('Search Flow', () => {
    test('should open command palette with keyboard shortcut', async ({ page }) => {
        const appPage = new AppPage(page)
        await appPage.goto()

        await page.keyboard.press('Meta+k')

        await expect(page.locator('[data-testid="command-palette"]')).toBeVisible()
    })

    test('should search and navigate to result', async ({ page }) => {
        const appPage = new AppPage(page)
        await appPage.goto()

        await page.keyboard.press('Meta+k')
        await page.fill('[data-testid="search-input"]', fixtures.testProject.name)

        await expect(page.locator('[data-testid="search-result"]')).toContainText(fixtures.testProject.name)
    })
})

test.describe('Backup Flow', () => {
    test('should create and download backup', async ({ page }) => {
        await page.goto('/settings/backup')

        const downloadPromise = page.waitForEvent('download')
        await page.click('[data-testid="create-backup-btn"]')

        const download = await downloadPromise
        expect(download.suggestedFilename()).toMatch(/backup.*\.zip/)
    })
})
