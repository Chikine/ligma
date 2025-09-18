import { PropsHistoryContext } from "@/contexts/PropsHistoryContext";
import { PropsHistoryContextValue } from "@/types";
import { useContext } from "react";

/**use {@link PropsHistoryContextValue} */
export function usePropsHistory() {
    const ctx = useContext(PropsHistoryContext)
    if(!ctx) throw 'no history provider found'
    return ctx
}