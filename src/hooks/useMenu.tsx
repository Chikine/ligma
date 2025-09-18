import { MenuContext } from "@/contexts/MenuContext";
import { MenuContextValue } from "@/types";
import { useContext } from "react";

/**use {@link MenuContextValue} */
export function useMenu() {
    const ctx = useContext(MenuContext)
    if(!ctx) throw 'no menu provider found'
    return ctx
}