import { Project } from "@/types"

/* temporary method: use LocalStorage to get and set project */
const projects_location = 'project-local-storage-location'
const project_last_focused_location = 'project-last-focused-location'

/**
 * + get projects from local storage (temp method)
 * + use case: on loading app
 */
export function getProjects() {
    const projectsAsJson = localStorage.getItem(projects_location)

    if(projectsAsJson) {
        const projects = JSON.parse(projectsAsJson) as Project[] | []
        return projects
    } else {
        return []
    }
}

/**
 * + set project to local storage
 * + use case: adding/deleting project, before unload window
 * @param projects 
 */
export function setProjects(projects: Project[]) {
    const projectsAsJson = JSON.stringify(projects)

    localStorage.setItem(projects_location, projectsAsJson)
}

/**
 * + get the project that user edited last
 * + use case: on loading app
 * @returns 
 */
export function getLastFocusedProjectId() {
    const projectId = localStorage.getItem(project_last_focused_location)
    return projectId
}

/**
 * + set the project that user edited last to memory
 * + use case: before unload window
 * @param projectId 
 */
export function setLastFocusedProjectId(projectId: string) {
    localStorage.setItem(project_last_focused_location, projectId)
}