import { useEffect, useState } from "react";

/**click props response */
type channelNode = {
    propsId: string | null
}

/**
 * a channel that save clicks for each channel id
 */
const channelRecord: Record<string, channelNode[]> = {}

/**
 * @param channelID channel id to listen on
 * 
 * @description
 * + a hook that helps detect and handle a **single** click
 * + a click could be commit and listen with index , only if the elements 
 * using the same channel id. all the commited click will be list as an array of channel node
 * + use case: to handle click on a stack of clickable elements
 * 
 * @hint
 * + to listen on new click in useEffect function, add ***change*** to dependency
 * + to commit a click, use ***commitClick(propsId: string, update?: boolean)***, to prevent update ***change***, set **update** to false
 * + to get the exact click index, use ***getPropsId(at?: number)*** 
 * 
 * @example
 * import { useEffect } from 'react'
 * 
 * //... 
 * 
 * function SomeJSXElement() {
 *   const { change, setChange, commitClick, getPropsId } = useClickProps('example')
 * 
 *   useEffect(() => {
 *     //the commits will turn change to true
 *     if(change) {
 *       const {propsId} = getPropsId(1) // get second element clicked
 *       console.log(propsId) // > 'second'
 * 
 *        // remember to set change to false again 
 *        // if you don't want to reuse the previous result
 *       setChange(false) 
 *     }
 *   }, [change])
 * 
 *   return (
 *     <div onClick={() => commitClick('not necessary I will get the second one')}>
 *       <div onClick={() => commitClick('second')}>
 *         <div style={{width: 10, height: 10}} onClick={() => commitClick('first (the top one)')} />
 *       </div>
 *     </div>
 *   )
 * }
 * 
 * @returns
 */
export function useClickProps(channelID: string) {
    //change state
    const [change, setChange] = useState(false)

    //if the record not contains any channel with channelId, create new one
    useEffect(() => {
        if(!channelRecord[channelID]) {
            channelRecord[channelID] = []
        }
    }, [])

    //if change is false , clear channel
    useEffect(() => {
        if(!change) {
            channelRecord[channelID] = []
        }
    }, [change])

    function commitClick(propsId: string, update = true) {
        channelRecord[channelID].push({propsId})
        if(update) {
            setChange(true)
        }
    }

    function getPropsId(at = 0) {
        if(!channelRecord[channelID]?.length) {
            return null
        } else {
            at = at % channelRecord[channelID].length
            at = (at + channelRecord[channelID].length) % channelRecord[channelID].length
        }

        const {propsId} = channelRecord[channelID][at] 
        return propsId
    }

    return { 
        /**
         * @description
         * + commit a click with the propsId that user clicked
         * + will set change to true if not provide second arguement
         * 
         * @param propsId props id 
         */
        commitClick,
        
        /**
         * @description
         * + get the props id at index
         * 
         * @remark
         * + you can use number larger than the amount of clicked element, or negative number, to get the element
         * + only return null when the channel not exist or not receive any click yet
         * 
         * @param at element click index, default is the first element
         * @returns 
         */
        getPropsId, 

        /**change state variable, boolean type */
        change, 

        /**set **change** value */
        setChange 
    }
}