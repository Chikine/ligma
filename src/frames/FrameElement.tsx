import { useClickProps } from "@/hooks/useClickProps";
import { useDelayEffect } from "@/hooks/useDelayEffect";
import { useFocusProps } from "@/hooks/useFocusProps";
import { useFrame } from "@/hooks/useFrame";
import { useName } from "@/hooks/useName";
import { usePropsOptions } from "@/hooks/usePropsOptions";
import { useUnsyncHistory } from "@/hooks/useUnsyncHistory";
import { FrameProps, FrameType } from "@/types";
import { Frame } from "@/utils/frame";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { defaultFrameAttribs } from ".";
import { getCustomFrameAttribs } from "@/api/frameApi";
import { objectToHTMLAttributes } from "@/helpers";
import parse, { domToReact } from "html-react-parser";


/**
 * + frame element, which use to display frame props as a jsx element
 * @param param0 
 * @returns 
 */
export function FrameElement({props}: {props: FrameProps}) {
    const { propsOptionsRecord } = usePropsOptions()

    const { commitFrame, findProps } = useFrame()

    const { focusProps, setFocusProps, focusPropsOptions } = useFocusProps()

    const { commitClick, getPropsId, change: clickChange, setChange: setClickChange} = useClickProps('frame-channel')

    const { getNameWithIndex } = useName()

    const focusedFrameId = useRef('')
    
    //on click element commit click
    function handleClick() {
        commitClick(props.id)
    }

    //on any click receive check if this the first click
    //if it is, try focus on this element
    useEffect(() => {
        if(clickChange) {
            const propsId = getPropsId(0)
            if(propsId === props.id && !focusPropsOptions.current.isLock) {
                if(focusProps?.id === props.id) {
                    setFocusProps(null)
                } else {
                    const {props: focusProps} = findProps(props.id)
                    if(focusProps) {
                        setFocusProps(focusProps)
                    }
                }
            }
            setClickChange(false)
        }
    }, [clickChange])

    //update current focus frame id
    useEffect(() => {
        focusedFrameId.current = focusProps?.id || props.id
    }, [focusProps])

    //drop area handler
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FRAME',
        //when drop draggable frame to element, will drop on current focus frame
        drop: (item: { props: FrameProps}, monitor) => {
            if(monitor.didDrop()) {
                return
            } else {
                const { props: parent } = findProps((() => focusedFrameId.current)())
                if(parent) {
                    parent.children.push(structuredClone({
                        ...item.props, 
                        name: getNameWithIndex({startsWith: item.props.type}),
                        id: crypto.randomUUID()
                    }))
                    commitFrame()
                }
            }
        },
        //only get the main hovering element, not the parents that contains hovering element
        collect: monitor => ({
            isOver: monitor.isOver({ shallow: true })
        }),
        //when hovering this, try set this as focus props
        hover: () => {
            if(!focusPropsOptions.current.isLock) {
                setFocusProps(props)
            }
        }
    }))

    if(!propsOptionsRecord[props.id]?.isVisible) {
        return <></>
    }

    /*=== return element base on type ===*/

    if(props.type === 'div') {
        return drop(
            <div
                {...props.attribs}
                id={props.id}
                onClick={handleClick}
            >
                {props.children?.map(child => {
                    const frame = new Frame(child)
                    return frame.element
                })}
            </div>
        )
    }

    if(props.type === 'p') {
        return drop(
            <p
                {...props.attribs}
                id={props.id}
                onClick={handleClick}
            >
                {props.attribs?.defaultValue || ''}
            </p>
        )
    }

    /* else if custom display */

    if(defaultFrameAttribs[props.type]) {
        const { html } = getCustomFrameAttribs()[props.type]

        let res = html

        const attribsAsString = objectToHTMLAttributes(props.attribs || {})

        res = res.replace(/{\s*attributes\s*}/g, attribsAsString)

        // res = res.replace(/{\s*children\s*}/, )

        const element = parse(res, {
            replace: (domNode) => {
                if (domNode.type === "text" && /\{\s*children\s*\}/.test(domNode.data)) {
                    return (
                        <>
                            {props.children?.map(child => {
                                const frame = new Frame(child)
                                return frame.element
                            })}
                        </>
                    )
                }
            },
        })

        return drop(
            <span
                id={props.id}
                onClick={handleClick}
            >
                {element}
            </span>
        )
    }

    /*if type is not recognise, return none */
    
    return <></>
}