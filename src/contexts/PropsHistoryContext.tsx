import { isEqual } from "@/helpers";
import { useProject } from "@/hooks/useProject";
import { FrameProps, PropsHistoryContextValue } from "@/types";
import { Frame } from "@/utils/frame";
import { createContext, ReactNode, useEffect, useState } from "react";

export const PropsHistoryContext = createContext<PropsHistoryContextValue | null>(null)

export function PropsHistoryProvider({children}: {children: ReactNode}) {
    const { currentProject } = useProject()

    const [prevProps, setPrevProps] = useState<FrameProps[]>([])

    const [currentProps, setCurrentProps] = useState<FrameProps | null>(null)

    const [nextProps, setNextProps] = useState<FrameProps[]>([])

    function commitProps(props: FrameProps) {
        if(currentProps) {
            setPrevProps(prev => [...prev, structuredClone(currentProps)])
        }
        setCurrentProps(structuredClone(props))
        setNextProps([])
    }

    function undoProps() {
        if(!prevProps.length) {
            return
        }

        if(currentProps) {
            setNextProps(next => [...next, structuredClone(currentProps)])
        }

        setCurrentProps(structuredClone(prevProps.slice(-1)[0]))
        setPrevProps(prev => prev.slice(0, -1))
    }

    function redoProps() {
        if(!nextProps.length) {
            return
        }

        if(currentProps) {
            setPrevProps(prev => [...prev, structuredClone(currentProps)])
        }

        setCurrentProps(structuredClone(nextProps.slice(-1)[0]))
        setNextProps(next => next.slice(0,-1))
    }

    function clearHistory() {
        setPrevProps([])
        setCurrentProps(null)
        setNextProps([])
    }

    function replaceHistory({current, prev, next}: {current?: FrameProps | null, prev?: FrameProps[], next?: FrameProps[]}) {
        if(current) setCurrentProps(structuredClone(current))
        if(prev) setPrevProps(prev.map(props => structuredClone(props)))
        if(next) setNextProps(next.map(props => structuredClone(props)))
    }

    //on change project, get frame from project data
    //if there has any data, the parent frame will be update
    //else clear the history to get new parent frame
    useEffect(() => {
        if(currentProject) {
            const frame = Frame.fromJSON(currentProject.frameAsJSON || '')
            if(frame) {
                replaceHistory({current: frame.props, prev: [], next: []})
            } else {
                clearHistory()
            }
        }
    }, [currentProject])

    return (
        <PropsHistoryContext.Provider
            value={{
                prevProps,
                currentProps,
                nextProps,
                commitProps,
                undoProps,
                redoProps,
                clearHistory,
                replaceHistory
            }}
        >
            {children}
        </PropsHistoryContext.Provider>
    )
}