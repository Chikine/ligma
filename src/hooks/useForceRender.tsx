import { useState } from "react"

/**
 * @description
 * + force render function, with dirty update way
 * + usually use when updating ref object
 * + has function ***forceRender*** to force re render and ***forceState*** to use as dependency
 * 
 * @param timeout time out (in milliseconds) before force render
 * @returns 
 */
export function useForceRender(timeout = 100) {
    const [forceState ,_render] = useState(0)

    const forceRender = () => timeout ? setTimeout(() => _render(n => n + 1), timeout) : _render(n => n + 1)

    return {
        /**force render, process after {@link timeout} milliseconds */
        forceRender, 
        
        /**force state, use as a dependency */
        forceState
    }
}