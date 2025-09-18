import { useFrame } from "@/hooks/useFrame"
import { useProject } from "@/hooks/useProject"
import { FocusPropsContextValue, FrameProps } from "@/types"
import { createContext, ReactNode, useEffect, useRef, useState } from "react"

/**
 * + focus props context, use for managing focus props
 */
export const FocusPropsContext = createContext<FocusPropsContextValue | null>(null)

/** context provider */
export function FocusPropsProvider({children} : {children: ReactNode}) {
    const { currentProject } = useProject()

    const { findProps, _parentFrameState } = useFrame()

    const [focusProps, setFocusProps] = useState<FrameProps | null>(null)

    const focusPropsOptions = useRef({
        isLock: false
    })

    //on change project set to null
    useEffect(() => {
        if(currentProject) {
            setFocusProps(null)
        }
    }, [currentProject])

    //on update parent frame point again to the props with same id
    useEffect(() => {
        if(focusProps) {
            const {props} = findProps(focusProps.id)
            setFocusProps(props || null)
        }
    }, [_parentFrameState])

    return (
        <FocusPropsContext.Provider
            value={{
                focusProps,
                setFocusProps,
                focusPropsOptions
            }}
        >
            {children}
        </FocusPropsContext.Provider>
    )
}