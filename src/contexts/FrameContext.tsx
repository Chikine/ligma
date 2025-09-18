import { useForceRender } from "@/hooks/useForceRender";
import { useProject } from "@/hooks/useProject";
import { usePropsHistory } from "@/hooks/usePropsHistory";
import { FrameContextValue, FrameProps } from "@/types";
import { Frame } from "@/utils/frame";
import { createContext, ReactNode, useEffect, useState, useRef } from "react";

/**
 * + frame context
 * + handle the project data
 * + provide the parent frame of project, methods to
 * select reference from project element and commit props to history
 */
export const FrameContext = createContext<FrameContextValue | null>(null)

export function FrameProvider({children}: {children: ReactNode}) {
    const { currentProject } = useProject()

    const { currentProps, commitProps } = usePropsHistory()

    const { forceRender, forceState } = useForceRender()

    const [change, setChange] = useState(0)

    const parentFrame = useRef<Frame | null>(null)

    //on change current props, update frame parent with a copy of current props and force render
    useEffect(() => {
        if(currentProps) {
            const frame = new Frame(structuredClone(currentProps))
            parentFrame.current = frame
        } else {
            parentFrame.current = null
        }
        forceRender()
    }, [currentProps])

    function findProps(propsId: string, parentProps = parentFrame.current?.props): {props?: FrameProps, propsParent?: FrameProps} {
        if(parentProps?.id === propsId) {
            return {
                props: parentProps
            }
        }
        if(parentProps?.children) {
            for(let child of parentProps.children) {
                const res = findProps(propsId, child)
                if(res.props) {
                    return {
                        ...res,
                        propsParent: res.propsParent || parentProps
                    }
                }
            }
        }
        return {}
    }

    function commitFrame() {
        setChange(n => n + 1)
    }

    useEffect(() => {
        const props = parentFrame.current?.props
        if(props) {
            commitProps(structuredClone(props))
        }
    }, [change])

    return (
        <FrameContext.Provider
            value={{
                parentFrame,
                findProps,
                commitFrame,
                _parentFrameState: forceState
            }}
        >
            {children}
        </FrameContext.Provider>
    )
}