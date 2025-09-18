import { useEffect, useRef } from "react";

/**use mouse position and status */
export function useMouse() {
    /**
     * mouse reference object
     */
    const mouse = useRef({
        x:0, 
        y:0,
        isMouseDown: false
    })

    //listeners on mouse ref
    useEffect(() => {
        const setMousePos = (e: MouseEvent) => {
            Object.assign(mouse.current,{x: e.clientX, y: e.clientY})
        }

        const setMouseIsDown = () => {
            Object.assign(mouse.current, {isMouseDown: true})
        }

        const setMouseIsUp = () => {
            Object.assign(mouse.current, {isMouseDown: false})
        }

        document.addEventListener('mousemove', setMousePos)

        document.addEventListener('mousedown', setMouseIsDown)

        document.addEventListener('mouseup', setMouseIsUp)  


        return () => {
            document.removeEventListener('mousemove', setMousePos)
            document.removeEventListener('mousedown', setMouseIsDown)
            document.removeEventListener('mouseup', setMouseIsUp)
        }
    },[])

    return mouse
}