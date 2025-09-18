import { MenuContextValue } from "@/types";
import { createContext, JSX, ReactNode, useState } from "react";

/** menu context, has methods to manage the menu */
export const MenuContext = createContext<MenuContextValue | null>(null)

/** context provided */
export function MenuProvider({children}: {children: ReactNode}) {
    const [menu, setMenu] = useState<JSX.Element>()

    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0})

    const [isVisible, setIsVisible] = useState(false)

    function showMenu() {
        setIsVisible(true)
    }

    function hideMenu() {
        setIsVisible(false)
    }

    return (
        <MenuContext.Provider 
            value={{
                menu, 
                setMenu,
                menuPosition,
                setMenuPosition,
                isVisible,
                hideMenu,
                showMenu
            }}
        >
            {children}
        </MenuContext.Provider>
    )
}