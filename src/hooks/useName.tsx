import { useEffect, useState } from "react"
import { useProject } from "./useProject"
import { Frame } from "@/utils/frame"
import { FrameProps } from "@/types"

/**
 * name record for each project, each name in a project is unique
 */
const namesRecord: Record<string, Set<string>> = {}

/**name options */
type NameOptions = {
    startsWith?: string
    middlePath?: string | number
    maxIndex?: number
}

/**name restricts */
type NameRestricts = {
    startsWith?: string
    index?: number
}

/**
 * @description
 * + unique name generator 
 * + each name in a project is unique
 * + use case: for objects that use name to display (project, props,...)
 */
export function useName() {
    const { currentProject } = useProject()

    //on change project check if project has any record and receive all existed name from props
    useEffect(() => {
        if(currentProject) {
            if(!namesRecord[currentProject.id]) {
                namesRecord[currentProject.id] = new Set<string>()
            }

            if(!namesRecord[currentProject.id].size) {
                const props = Frame.fromJSON(currentProject.frameAsJSON || '{}')?.props
                if(props) {
                    (function getNames(props: FrameProps) {
                        if(props.name) {
                            namesRecord[currentProject.id].add(props.name)
                        }

                        props.children.forEach(child => {
                            getNames(child)
                        })
                    })(props)
                }
            }
        }
    }, [currentProject])

    function getNameWithIndex({startsWith = 'unnamed', middlePath = ' ', maxIndex = 1000}: NameOptions) {
        for(let i = 1; i <= maxIndex; i++) {
            const name = startsWith + middlePath + i
            if(!namesRecord[currentProject?.id || ''].has(name)) {
                namesRecord[currentProject?.id || ''].add(name)
                return name
            }
        }

        console.warn('Index limit exceeded')
        console.warn('Use random name instead')

        return crypto.randomUUID()
    }

    function getExistedNames({startsWith = '', index = 1}: NameRestricts) {
        let keys = [...namesRecord[currentProject?.id || ''].keys()]

        if(startsWith) {
            keys = keys.filter(name => name.startsWith(startsWith))
        }

        if(index) {
            keys = keys.filter(name => name.includes(index + ''))
        }

        return keys
    }

    function removeNames(...nameList: string[]) {
        nameList.forEach(name => namesRecord[currentProject?.id || ''].delete(name))
    }

    function validname(name: string) {
        return !namesRecord[currentProject?.id || ''].has(name)
    }

    function registerName(name: string) {
        if(!validname(name) || !currentProject?.id) {
            return false
        }

        namesRecord[currentProject.id].add(name)
        return true
    }

    return { 
        /**
         * + get an unique name, by use name prefix + index, with options
         * + use case: for multiple objects that has same name 
         * 
         * ### Options:
         * + startsWith: default is 'unnamed'
         * + middlePath: a bit unnecessary, use like a path between startsWith and index, default is whitespace ' '
         * + maxIndex: the max index that you accept
         */
        getNameWithIndex, 

        /**
         * + get existed name in project, with restricts
         * + filter the name by restricts or simply get all existed name 
         */
        getExistedNames, 

        /**remove names from set */
        removeNames, 

        /**check if a name is valid or not */
        validname, 

        /**
         * + try register a name 
         * + return true if successfully register name, false if not
         * @param name custom name
         * @returns 
         */
        registerName 
    }
}