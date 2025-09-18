import { useMenu } from "@/hooks/useMenu"
import { JSX, useState } from "react"

/**
 * + element that display menu which show when right click to specific element (layer)
 * @returns 
 */
export function MenuContainer() {
    const { menu, menuPosition, hideMenu, isVisible } = useMenu()

    return (
        <>
        {menu && isVisible && 
            <div className="absolute top-0 left-0 w-full h-full z-1001">
                <div 
                    className="w-auto h-auto flex flex-col" 
                    style={{
                        position: 'absolute',
                        top: menuPosition.y,
                        left: menuPosition.x
                    }}
                >
                    <div className="relative w-full h-full bg-green-200 border-1 -mt-0.25 border-black">
                        {menu}
                    </div>
                </div>
            </div>
        }   
        </>
    )
}