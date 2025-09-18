import { FrameContext } from "@/contexts/FrameContext";
import { FrameContextValue } from "@/types";
import { useContext } from "react";

/**use {@link FrameContextValue} */
export function useFrame() {
    const ctx = useContext(FrameContext)
    if(!ctx) throw 'no frame provider found'
    return ctx
}