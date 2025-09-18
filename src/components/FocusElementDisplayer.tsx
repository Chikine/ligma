import { isEqual } from "@/helpers"
import { useFocusProps } from "@/hooks/useFocusProps"
import { useForceRender } from "@/hooks/useForceRender"
import { useFrame } from "@/hooks/useFrame"
import { useWindowSize } from "@/hooks/useWindowSize"
import { RefObject, useEffect, useState } from "react"

type FocusElementStyle = {
    left: number,
    top: number,
    width: number,
    height: number
}

/**
 * + display a border that cover the current focus element
 * @returns 
 */
export function FocusElementDisplayer({parentId}: {parentId: string}) {
    const { findProps } = useFrame()

    const { focusProps, focusPropsOptions } = useFocusProps()

    const { forceRender } = useForceRender()

    const { wSize } = useWindowSize()

    /**the focus element id */
    const [focusElementId, setFocusElementId] = useState('')

    /**the domrect of the focus element*/
    const [styles, setStyles] = useState<FocusElementStyle | null>(null)

    /**convert DOMRect to style */
    const toFocusElementStyleType = (rect: DOMRect | null) => (rect ? {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    } as FocusElementStyle : null)

    // on change focus props , change the focus element id
    useEffect(() => {
        setFocusElementId(focusProps?.id || '')
    }, [focusProps])

    // on every changes that may affect the domrect, redeclare it
    useEffect(() => {
        if(focusElementId) {
            const rect = toFocusElementStyleType(document.getElementById(focusElementId)?.getBoundingClientRect() || null)
            const parentRect = toFocusElementStyleType(document.getElementById(parentId)?.getBoundingClientRect() || null)

            if(!rect) {
                setFocusElementId('')
            } else{
                //relative with parent
                rect.top -= 2 + (parentRect?.top || 0)
                rect.left -= 2 + (parentRect?.left || 0)

                if(!isEqual(styles, rect)) {
                    setStyles(rect)
                }
            }
        } else {
            setStyles(null)
        }
    })

    return (
        <div className="absolute top-0 left-0 pointer-events-none z-1000">
            {styles && wSize.width > 600 && (
                <div
                    className={"border-2 border-dashed border-yellow-500 bg-blue-100/25"}
                    style={{
                        position: 'absolute',
                        left: styles.left,
                        top: styles.top,
                        width: styles.width,
                        height: styles.height
                    }}
                />
            )}
        </div>
    )
}