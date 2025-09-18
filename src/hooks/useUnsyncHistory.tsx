import { UnsyncHistoryNode } from "@/types"
import { useEffect } from "react"

/** unsync history record */
const unsyncHistoryRecord: Record<string, UnsyncHistoryNode<any>> = {}

/**
 * use ***unsync history***
 * 
 * @description
 * + each **channel id** will has different history, with type of {@link UnsyncHistoryNode}
 * + use history methods like **undo**, **redo** for a value with the same type
 * + the history is ***unsync***, so it will ***not*** trigger re-render in app. consider use **forceRender** to re-render
 * 
 * @param channelId the history channel id
 * @returns 
 */
export function useUnsyncHistory<T>(channelId: string) {
    useEffect(() => {
        if(!unsyncHistoryRecord[channelId]) {
            unsyncHistoryRecord[channelId] = {prev: [], next: []}
        }
    },[])

    const history = () => unsyncHistoryRecord[channelId] || {prev: [], next: []} as UnsyncHistoryNode<T>

    function commit(value: T) {
        if(history().current) {
            history().prev.push(history().current)
        }

        history().current = value

        history().next = []
    }

    function undo() {
        if(!history().prev.length) return

        if(history().current) history().next.push(history().current)

        history().current = history().prev.pop()
    }

    function redo() {
        if(!history().next.length) return

        if(history().current) history().prev.push(history().current)

        history().current = history().next.pop()
    }

    function clearHistory() {
        replaceHistory({prev: [], next: [], current: undefined})
    }

    function replaceHistory(newHistory: Partial<UnsyncHistoryNode<T>>) {
        Object.assign(history(), newHistory)
    }

    return { 
        /**
         * a function that return reference of history channel, which contains:
         * + prev: an array of previous history values
         * + current: current value, may be undefined
         * + next: an array of next history values
         */
        history, 

        /**commit a value to history */
        commit, 

        /**get the previous value in history */
        undo, 

        /**get the next value in history */
        redo, 

        /**clear all the history */
        clearHistory, 

        /**replace history values */
        replaceHistory 
    }
}