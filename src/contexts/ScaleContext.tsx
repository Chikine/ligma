import { useProject } from "@/hooks/useProject"
import { ScaleContextValue } from "@/types"
import { createContext, ReactNode, useEffect, useState } from "react"

export const ScaleContext = createContext<ScaleContextValue | null>(null)

export function ScaleProvider({children}: {children: ReactNode}) {
    const { currentProject } = useProject()

    const defaultScale = 0.4

    const [scale, setScale] = useState(defaultScale)

    function scaleInPercentage() {
        return (scale * 100) / defaultScale 
    }

    function changeScale({percentage, scale}: {percentage?: number, scale?: number}) {
        if(percentage) {
            setScale(defaultScale * percentage / 100)
        } else if(scale) {
            setScale(scale)
        }
    }

    useEffect(() => {
        changeScale({scale: defaultScale})
    }, [currentProject])

    return (
        <ScaleContext.Provider 
            value={{
                scale,
                scaleInPercentage,
                changeScale
            }}
        >
            {children}
        </ScaleContext.Provider>
    )
}