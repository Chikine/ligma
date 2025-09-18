import { createContext, ReactNode, useEffect, useRef, useState } from "react"
import { Project, ProjectContextValue } from "@/types"
import * as API from "@/api/projectApi"
import { Frame } from "@/utils/frame"
import { defaultFrameAttribs } from "@/frames"

export const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({children}: {children: ReactNode}) {
    const [projects, setProjects] = useState<Project[]>([])

    const [currentProject, setCurrentProject] = useState<Project | null>(null)

    const unsavedProjectInfo = useRef<Partial<Project>>({})

    function retrieveProjects() {
        const projects = API.getProjects()
        setProjects(projects)
        return projects
    }

    function saveProjects() {
        API.setProjects(projects)
    }

    function addProjects(...projects: Project[]) {
        setProjects(prev => [...prev, ...projects])
    } 

    function deleteProjects(...projectIds: string[]) {
        setProjects(prev => [...prev.filter(prj => !projectIds.includes(prj.id))])
    }

    function modifyProjectInProjects(projectId: string, info: Partial<Project>) {
        setProjects(prev => {
            return prev.map(prj => {
                if(prj.id === projectId) {
                    return {...prj, ...info}
                }
                return prj
            })
        })
    }

    function createNewProject(name: string) {
        const parentFrame = new Frame({
            type: 'div', name: 'root', id: crypto.randomUUID(), attribs: {
                style: {
                    ...defaultFrameAttribs['div'].style,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'wheat',
                    overflow: 'auto'
                }
            }, children: []
        })

        const frameAsJSON = JSON.stringify(parentFrame)

        const project: Project = {
            name,
            id: crypto.randomUUID(),
            frameAsJSON
        }
        
        addProjects(project)
    }

    function focusOnProject(projectId: string | null) {
        if(!projectId) {
            setCurrentProject(null)
        } else {
            const project = projects.filter(prj => prj.id === projectId)?.[0] || null

            //save prev project
            saveCurrentProject()
            
            unsavedProjectInfo.current = {}

            //focus on next project
            setCurrentProject(project)
        }
    }

    function saveCurrentProject(info: Partial<Project> = unsavedProjectInfo.current, update = true) {
        if(currentProject) {
            if(update) {
                setCurrentProject({...currentProject, ...unsavedProjectInfo, ...info})
                modifyProjectInProjects(currentProject.id, info)
            } else {
                unsavedProjectInfo.current = {...unsavedProjectInfo.current, ...info}
            }
        }
    }

    //on loading app retrieve projects form database
    useEffect(() => {
        retrieveProjects()
    }, [])

    //on change projects save to database and focus to the last focus project if it has
    useEffect(() => {
        saveProjects()
        //only on start app (no prj is focusing)
        if(projects && !currentProject) {
            const focusedProjectId = API.getLastFocusedProjectId()
            if(focusedProjectId && projects.filter(prj => prj.id === focusedProjectId).length) {
                focusOnProject(focusedProjectId)
            }
        }
    }, [projects])

    //on unload web set the last focus project
    useEffect(() => {
        if(currentProject) {
            API.setLastFocusedProjectId(currentProject.id)
        }

        const onCloseWeb = (e: BeforeUnloadEvent) => {
            saveCurrentProject()
        }

        window.addEventListener('beforeunload', onCloseWeb)

        return () => window.removeEventListener('beforeunload', onCloseWeb)
    }, [currentProject])

    return (
        <ProjectContext.Provider
            value={{
                projects,
                currentProject,
                retrieveProjects,
                saveProjects,
                addProjects,
                deleteProjects,
                createNewProject,
                focusOnProject,
                saveCurrentProject
            }}
        >
            {children}
        </ProjectContext.Provider>
    )
}