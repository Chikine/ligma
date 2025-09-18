import { useFrame } from "@/hooks/useFrame";
import { useProject } from "@/hooks/useProject";
import { usePropsHistory } from "@/hooks/usePropsHistory";
import { useScale } from "@/hooks/useScale";
import { Redo, Save, SaveOff, Undo, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";
import { ElementWithDescription } from "./ElementWithDescription";
import { alterOptions, getOptions } from "@/api";

/**
 * frame tools
 * @returns 
 */
export function FrameTools() {
    const { undoProps, redoProps } = usePropsHistory()

    const [autoSave, setAutoSave] = useState(false)

    const [settings, setSettings] = useState(getOptions())

    const { zoomIn, zoomOut, scaleInString } = useScaleChanger()

    useAutoSave({saveState: autoSave})

    function alterSetting(props: typeof settings) {
        alterOptions(props)
        setSettings(getOptions())
    }
    
    //on change setting change some values that depends on setting
    useEffect(() => {
        setAutoSave(!!settings.autoSave)
    }, [settings])

    return (
        <div
            className="absolute bottom-0 left-0 w-full h-10 flex flex-row justify-center items-center gap-10 bg-white border-t-black border-4"
        >
            <Undo className=" text-yellow-400 hover:text-cyan-400" onClick={undoProps} />
            <ZoomOut className=" text-black hover:text-red-500" onClick={zoomOut}/>
            <div className=" select-none">
                {scaleInString}
            </div>
            <ZoomIn className=" text-black hover:text-green-500" onClick={zoomIn}/>
            <Redo  className=" text-yellow-400 hover:text-cyan-400" onClick={redoProps} />
            {autoSave ? 
                <ElementWithDescription 
                    description="Auto Save: On" 
                    allowHover
                    descProps={{
                        style: {
                            backgroundColor: 'rgba(0, 255, 0, 0.5)'
                        }
                    }}
                >
                    <Save className="text-amber-300 hover:text-blue-400" onClick={() => alterSetting({autoSave: false})}/>
                </ElementWithDescription> :
                <ElementWithDescription 
                    description="Auto Save: Off" 
                    allowHover
                    descProps={{
                        style: {
                            backgroundColor: 'rgba(0, 255, 0, 0.5)'
                        }
                    }}
                >
                    <SaveOff className="text-zinc-300 hover:text-pink-400" onClick={() => alterSetting({autoSave: true})}/>
                </ElementWithDescription>
            }
        </div>
    )
}

//use auto save
function useAutoSave({saveState}: {saveState: boolean}) {
    const { saveCurrentProject, currentProject } = useProject()

    const { parentFrame, _parentFrameState } = useFrame()

    useEffect(() => {
        if(saveState && currentProject && parentFrame.current) {
            const frameAsJSON = JSON.stringify(parentFrame.current)

            saveCurrentProject({frameAsJSON}, false)
        }
    }, [_parentFrameState])
}

//use scale changer
function useScaleChanger() {
    const { scaleInPercentage, changeScale, scale } = useScale()

    const [scaleInString, setScaleInString] = useState('')

    function zoomIn() {
        const floorScaleInPercentageBaseFloor25 = Math.floor(scaleInPercentage() / 25 + 1e-6) * 25

        changeScale({percentage: Math.min(200, floorScaleInPercentageBaseFloor25 + 25)})
    }

    function zoomOut() {
        const ceilScaleInPercentageBaseCeil25 = Math.ceil(scaleInPercentage() / 25 - 1e-6) * 25

        changeScale({percentage: Math.max(25, ceilScaleInPercentageBaseCeil25 - 25)})
    }

    useEffect(() => {
        setScaleInString(scaleInPercentage() + '%')
    },[scale])

    return { zoomIn, zoomOut, scaleInString }
}