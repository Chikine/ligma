import { useProject } from "@/hooks/useProject"
import { usePropsHistory } from "@/hooks/usePropsHistory"
import { Project } from "@/types"
import { CircleX } from "lucide-react"

/**
 * + project container, which handle interact with projects
 * @param param0 
 * @returns 
 */
export function ProjectDisplayer({project}: {project: Project}) {
    const { currentProject, focusOnProject, deleteProjects } = useProject()

    const { clearHistory } = usePropsHistory()

    return (
        <div 
            className="relative mr-2"
        >
            <div
                className={"relative h-full w-auto pl-1 pr-1 border-2 justify-center items-center select-none" + " "
                    + `${currentProject?.id === project.id ? 'bg-blue-600' : 'bg-white hover:bg-emerald-500'}`
                }
                style={{
                    borderColor: currentProject?.id === project.id ? 'red' : 'gray',
                    // backgroundColor: currentProject?.id === project.id ? 'aqua' : 'white',
                    opacity: currentProject?.id === project.id ? 1 : 0.8
                }}
                onClick={() => focusOnProject(project.id)}
            >
                {project.name}
            </div>
            <CircleX
                size={16} 
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hover:text-red-500" 
                onClick={() => {
                    deleteProjects(project.id)
                    if(project.id === currentProject?.id) {
                        clearHistory()
                    }
                }}
            />
        </div>
    )
}