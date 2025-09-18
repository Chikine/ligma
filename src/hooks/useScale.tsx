import { ScaleContext } from "@/contexts/ScaleContext";
import { useContext } from "react";

/**use scale for controlling app scale */
export function useScale() {
    const ctx = useContext(ScaleContext)
    if(!ctx) throw 'no scale provider found'
    return ctx
}