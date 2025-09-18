import { useEffect, EffectCallback, DependencyList } from "react";

/**
 * @description
 * + use effect with ***timeout***
 * + the {@link effect} will trigger after {@link ms} milliseconds, 
 * and will be cancel if any dependency in {@link dependencies} changed
 * 
 * @example
 * //example: use on update search after user stop typing for 500ms
 * //import
 * import { useDelayEffect } from "@/hooks/useDelayEffect"; //examlpe directory
 * import { SearchDisplayer } from "@/components/SearchDisplayer"; // example directory
 * import * as api from "@/api/searchApi"; // example directory
 * 
 * //...
 * 
 * export function SearchInput() {
 *   //user input
 *   const [searchValue, setSearchValue] = useState('')
 * 
 *   //result get from user input
 *   const [searchResult, setSearchResult] = useState<string>([])
 *   
 *   //on input stop, will get search result after 500 milliseconds 
 *   useDelayEffect(() => {
 *     //get search and set result
 *     api.getSearch({searchValue}).then(res => setSearchResult(res))
 *   }, [searchValue], 500)
 * 
 *   return (
 *     <div style={{
 *       position: "relative"
 *     }}>
 *       <input type="text" placeHolder="Search..." />
 *       <SearchDisplayer result={searchResult} />
 *     </div>
 *   )
 * }
 * 
 * @param effect - react effect 
 * @param dependencies - react dependencies
 * @param ms - timeout before trigger effect, if not given it will trigger immediately
 */
export function useDelayEffect(effect: EffectCallback, dependencies?: DependencyList, ms: number | null = 500) {
    useEffect(() => {
        let cleanup: any

        function triggerEffect() {
            cleanup = effect()
        }

        if(typeof ms === 'number') {
            const timeout = setTimeout(triggerEffect, Math.max(0, ms))

            return () => {
                clearTimeout(timeout)
                cleanup?.()
            }
        } else {
            triggerEffect()
            return () => {
                cleanup?.()
            }
        }
    }, dependencies)
}