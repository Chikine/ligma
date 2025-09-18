import { useMenu } from "@/hooks/useMenu";
import { JSX, ReactNode, RefObject, useEffect } from "react";

export function PopMenuWhenClick({ children, menu, menuRef, leftClick = false, rightClick = false}: {children?: ReactNode, menu: JSX.Element, menuRef: RefObject<HTMLDivElement | null>, leftClick?: boolean, rightClick?: boolean}) {
    const { setMenu, setMenuPosition, hideMenu, showMenu } = useMenu()
    
    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        setMenuPosition({
            x: Math.min(1400, e.clientX + 10),
            y: Math.max(0, e.clientY - 50)
        })
        setMenu(menu)
        showMenu()
    }
    
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                hideMenu()
            }
        }

        document.addEventListener('mousedown', handleClick)

        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div
            {...leftClick && {onClick:(e) => handleClick(e)}}
            {...rightClick && {onContextMenu: (e) => handleClick(e)}}
        >
            {children}
        </div>
    )
}