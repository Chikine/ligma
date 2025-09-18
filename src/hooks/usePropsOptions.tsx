import { PropsOptionsContext } from "@/contexts/PropsOptionsContext";
import { useContext } from "react";

export function usePropsOptions() {
    const ctx = useContext(PropsOptionsContext)
    if(!ctx) throw 'no props options provider found'
    return ctx
}