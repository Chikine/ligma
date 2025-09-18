import { useProject } from "@/hooks/useProject"
import { FrameProps, PropsOptions, PropsOptionsContextValue } from "@/types"
import { Frame } from "@/utils/frame"
import { createContext, ReactNode, useEffect, useState } from "react"

export const PropsOptionsContext = createContext<PropsOptionsContextValue | null>(null)

export function PropsOptionsProvider({children}: {children: ReactNode}) {
    const { currentProject } = useProject()

    const [propsOptionsRecord, setPropsOptionsRecord] = useState<Record<string, PropsOptions>>({})

    function setOptions(propsId: string, options: PropsOptions) {
        setPropsOptionsRecord(record => {
            return {
                ...record,
                [propsId]: options
            }
        })
    }

    useEffect(() => {
        if(currentProject) {
            const frame = Frame.fromJSON(currentProject.frameAsJSON || '')

            if(frame) {
                const options:Record<string, PropsOptions> = {}

                function getOptions(props: FrameProps) {
                    options[props.id] = {
                        isVisible: true
                    }

                    props.children.forEach(child => getOptions(child))
                }

                getOptions(frame.props)

                setPropsOptionsRecord(options)
            }
        }
    }, [currentProject])

    return (
        <PropsOptionsContext.Provider
            value={{
                propsOptionsRecord,
                setOptions
            }}
        >
            {children}
        </PropsOptionsContext.Provider>
    )
}