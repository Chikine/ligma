import { Frame } from "@/utils/frame";
import { FrameProps, Project, PropsOptions } from ".";
import { JSX } from "react";

export type ProjectContextValue = { 
    /**user projects*/
    projects: Project[]

    /**current project */
    currentProject: Project | null

    /**get projects from database */
    retrieveProjects: () => Project[]

    /**save projects to database */
    saveProjects: () => void

    /**add project(s) to existed projects */
    addProjects: (...projects: Project[]) => void

    /**delete existed projects */
    deleteProjects: (...projectIds: string[]) => void

    /**create new project */
    createNewProject: (name: string) => void

    /**focus on user project */
    focusOnProject: (projectId: string | null) => void

    /**save the focus project with project's new info or previous unsaved info, sync or unsync */
    saveCurrentProject(info?: Partial<Project>, update?: boolean): void
}

export type FrameContextValue = {
    /**the frame parent, which use currentProps from props history */
    parentFrame: React.RefObject<Frame | null>

    /**state for detect change on parent frame */
    _parentFrameState: number

    /**
     * + find a props that is in the parent props, or the parent props itself
     * + return an object that may contains the found props, and its parent which contain the found one
     * @remark 
     * + use case: select the exact reference to edit and commit, prevent edit the copy of the props
     * + **parentProps**, default is main props, is the one we use to find props in it
     * + if no props was found, props and propsParent will be undefined, 
     * + if the props found is the parent props, the propsParent will be undefined
     * 
     * @example
     * const { findProps, commitFrame } = useFrame()
     * 
     * //...
     * 
     * const copyProps = structuredCopy(aPropsFromParent)
     * 
     * //...
     * 
     * function onClickChangeProps(propertiesToChange = {} as Partial<FrameProps>) {
     *   const {props} = findProps(propsId)
     *   if(props) {
     *     //we found the exact reference here
     *     props = {...copyProps, ...propertiesToChange}
     *     //don't forget to commit frame to history
     *     commitFrame()
     *   }
     * }
     * 
     * @param propsId 
     * @param parentProps 
     * @returns 
     */
    findProps: (propsId: string, parentProps?: any) => { props?: FrameProps, propsParent?: FrameProps}
    
    /**
     * + function to commit this frame to history
     * + ***works only if you modify the parent frame but not the copy one***
     * 
     * @example
     * 
     * const { parentFrame, commitFrame } = useFrame()
     * 
     * const props = parentFrame.current?.props.children?.[0] // the reference of the first child
     * 
     * if(props) {
     *   //update props... => modify the actual props of parent frame
     * 
     *   commitFrame()
     * }
     */
    commitFrame: () => void
}

export type MenuContextValue = { 
    /**current menu */
    menu: JSX.Element | undefined

    /**set current menu */
    setMenu: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>

    /**the menu position on screen */
    menuPosition: { x: number, y: number}

    /**set menu position on screen */
    setMenuPosition: React.Dispatch<{ x: number, y: number}>

    /**menu options */
    isVisible: boolean

    /**hide menu */
    hideMenu: () => void

    /**show menu */
    showMenu: () => void
}

export type PropsHistoryContextValue = { 
    /**the previous committed props */
    prevProps: FrameProps[]

    /**the current props / parent props of the project */
    currentProps: FrameProps | null

    /**the next committed props*/
    nextProps: FrameProps[]

    /**
     * + commit a props as props parent to the history
     * + will overwrite nextProps and push currentProps to prevProps (if currentProps not null)
     * + usage: for push the parent props to the history 
     * @param props 
     * @returns 
     */
    commitProps: (props: FrameProps) => void

    /**
     * + go to the previous props (if there are any commit before)
     * + push currentProps to the nextProps
     * @returns 
     */
    undoProps: () => void

    /**
     * + go to the next props (if there are any undo before)
     * + push currentProps to the prevProps
     * @returns 
     */
    redoProps: () => void

    /**
     * **clear all the history:**
     * + prevProps => []
     * + currentProps => null
     * + nextProps => []
     * 
     * @remark
     * + **should not** use this function to reset history when changing to a different project,
     * it will make the currentProps become null, and the first commit will not save to the prevProps
     * + instead, use replaceHistory with *currentProps = Frame.fromJSON(currentProjects?.frameAsJSON)*
     * + use case: for clear all history when delete project / for custom project with root = null
     * 
     * @returns 
     */
    clearHistory: () => void

    /**
     * **replace the history with the new one**
     * + use case: when changing currentProjects, or get history from database
     * 
     * @example
     * import { Frame } from "@/utils/frame";
     * 
     * //... 
     * 
     * const { currentProject } = useProject()
     * const { replaceHistory, clearHistory } = usePropsHistory()
     * 
     * //... 
     * 
     * useEffect(() => {
     *   //if currentProject is not null, replace history
     *   if(currentProject) {
     *     //get project history from database
     *     //type: ({current: FrameProps, prev: FrameProps[], next: FrameProps})
     *     const history = API.retrieveHistory(currentProject.id)
     * 
     *     //if there are any data, replace to the currentProject
     *     if(history) {
     *       replaceHistory(history)
     *       return
     *     }
     * 
     *     //try get project parent frame instead if no history found
     *     const frame = Frame.fromJSON(currentProps.frameAsJSON)
     * 
     *     if(frame) {
     *         replaceHistory({current: frame.props, prev: [], next: []})
     *     } else {
     *         clearHistory()
     *     }
     *   }
     *   //clear history when currentProject null is not necessary here
     *   //because if there's no project, the history not use
     *   //instead add undo delete project here
     * }, [currentProject])
     * 
     * //...
     * 
     * @param param0 
     * @returns 
     */
    replaceHistory: ({ current, prev, next }: {current?: FrameProps | null | undefined, prev?: FrameProps[] ,next?: FrameProps[]}) => void
}

export type FocusPropsContextValue = {
    /**current focus props / frame */
    focusProps: FrameProps | null

    /**set focus props*/
    setFocusProps: React.Dispatch<React.SetStateAction<FrameProps | null>>

    /**
     * focus props options:
     * + isLock: lock focus on a props, cannot be change until this equal false
     */
    focusPropsOptions: React.RefObject<{ isLock: boolean }>
}

export type ScaleContextValue = { 
    /**Current scale */
    scale: number

    /**Return scale in percentage compare to default scale */
    scaleInPercentage: () => number

    /**Change scale, in percentage or scale value */
    changeScale: ({ percentage, scale }: { percentage?: number, scale?: number }) => void
}

export type PropsOptionsContextValue = { 
    propsOptionsRecord: Record<string, PropsOptions>
    setOptions: (propsId: string, options: PropsOptions) => void
}