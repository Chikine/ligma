import { ProjectContext } from "@/contexts/ProjectContext";
import { ProjectContextValue } from "@/types";
import { useContext } from "react";

/**use {@link ProjectContextValue} */
export function useProject() {
    const ctx = useContext(ProjectContext)
    if(!ctx) throw 'no project provider found'
    return ctx
}