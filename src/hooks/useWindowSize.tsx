import { useEffect, useState } from "react";

/**use window size */
export function useWindowSize() {
    const [wSize, setWSize] = useState({width: 0, height: 0})

    //add window resize listener
    useEffect(() => {
        const onResize = () => setWSize({width: window.innerWidth, height: window.innerHeight})

        onResize()

        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [])

    return {
        /**window size */
        wSize
    }
}