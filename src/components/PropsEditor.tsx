import { useFocusProps } from "@/hooks/useFocusProps"
import { useForceRender } from "@/hooks/useForceRender"
import { Lock, LockOpen } from "lucide-react"
import { EditorComponent } from "./EditorComponent"
import { useEffect, useRef, useState } from "react"
import { useFrame } from "@/hooks/useFrame"
import CodeEditor from '@uiw/react-textarea-code-editor'
import { useUnsyncHistory } from "@/hooks/useUnsyncHistory"
import { isEqual } from "@/helpers"
import { useDelayEffect } from "@/hooks/useDelayEffect"

/**
 * + an editor textarea that will show Focus Element props
 * + use to edit, control, decorate element
 * @returns 
 */
export function PropsEditor() {
    const { focusProps, focusPropsOptions } = useFocusProps()

    const { findProps, commitFrame } = useFrame()

    const { forceRender } = useForceRender()

    const [tempName, setTempName] = useState('')

    type OptionsType = typeof focusPropsOptions.current

    /**change focus props options  */
    function changeOptions(options: Partial<OptionsType>) {
        focusPropsOptions.current = {...focusPropsOptions.current, ...options}
        forceRender()
    }

    useEffect(() => {
        if(focusProps) {
            setTempName(focusProps.name || 'unnamed')
        }
    }, [focusProps])

    return (
        <div
            className="absolute top-0 left-0 w-full h-full flex flex-col text-xl bg-black/60 text-white"
        >
            <div
                className="relative h-10 w-full border-b-2 border-b-blue-600 border-dashed flex flex-row"
            >
                {!focusProps ? 'no element is focusing' : (
                    <>
                        <div
                            className="relative self-start w-full h-full truncate flex justify-center items-center"
                        >
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => {
                                    setTempName(e.target.value)
                                }}
                                onBlur={() => {
                                    if(focusProps && tempName) {
                                        const {props: p} = findProps(focusProps.id)
                                        if(p) {
                                            p.name = tempName
                                            commitFrame()
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div
                            className="relative h-full aspect-square flex justify-center items-center"
                        >
                            {!focusPropsOptions.current.isLock ? 
                                <LockOpen onClick={() => changeOptions({isLock: true})} className="text-black hover:text-green-500" /> :
                                <Lock onClick={() => changeOptions({isLock: false})} className="text-yellow-500 hover:text-red-500" />
                            }
                        </div>
                    </>
                )}
            </div>
            {focusProps && (
                <div
                    className="relative w-full h-full flex flex-col text-xl"
                >
                    <AttribsEditor/>
                </div>
            )}
        </div>
    )
}

function AttribsEditor() {
    const { findProps, commitFrame } = useFrame()

    const { focusProps } = useFocusProps()

    if(!focusProps) return <></>

    const { history, commit, undo, redo, clearHistory } = useUnsyncHistory<string>('props-attribs-history')

    const [tempText, setTempText] = useState('')

    useEffect(() => {
        const text = JSON.stringify(focusProps.attribs, null, 4)

        setTempText(text)
        clearHistory()
        commit(text)    
    }, [focusProps])

    useDelayEffect(() => {
        if(history().current !== tempText) {
            commit(tempText)
        }

        try {
            const attribs = JSON.parse(tempText) as React.HTMLAttributes<HTMLElement> | null
            if(attribs) {
                const {props} = findProps(focusProps.id)
                if(props && !isEqual(attribs, props.attribs)) {
                    props.attribs = structuredClone(attribs)
                    commitFrame()
                }
            }
        } catch (e) {
            //do nothing
        }
    }, [tempText], 500)

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.ctrlKey) {
            if(e.key === 'z') {
                e.preventDefault()
                undo()
                setTempText(s => history().current ?? s)
            }
            if(e.key === 'y') {
                e.preventDefault()
                redo()
                setTempText(s => history().current ?? s)
            }
        }
    }

    return <EditorComponent
        title={'attributes'}
        content={(
            <CodeEditor
                value={tempText}
                language="json"
                placeholder="element attribute..."
                onChange={(e) => setTempText(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    width: '100%',
                    borderRadius: 5,
                    fontSize: 16
                }}
            />
        )}
    />
}