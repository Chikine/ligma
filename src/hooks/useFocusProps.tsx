import { FocusPropsContext } from "@/contexts/FocusPropsContext";
import { FocusPropsContextValue } from "@/types";
import { useContext } from "react";

/**use {@link FocusPropsContextValue} */
export function useFocusProps() {
    const ctx = useContext(FocusPropsContext)
    if(!ctx) throw 'no focus provider found'
    return ctx
}