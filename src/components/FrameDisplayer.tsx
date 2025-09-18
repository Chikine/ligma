import { useFrame } from "@/hooks/useFrame"
import { useProject } from "@/hooks/useProject"
import { LayerDisplayer } from "./LayerDisplayer"
import { ProjectDisplayer } from "./ProjectDisplayer"
import { PropsEditor } from "./PropsEditor"
import { FrameTools } from "./FrameTools"
import { useScale } from "@/hooks/useScale"
import { useDeviceSize } from "@/hooks/useDeviceSize"
import { useEffect, useRef } from "react"
import { FocusElementDisplayer } from "./FocusElementDisplayer"
import { useForceRender } from "@/hooks/useForceRender"
import { ElementWithDescription } from "./ElementWithDescription"
import { Save } from "lucide-react"

/**
 * #### a container that display:
 * + the {@link LayerDisplayer}
 * + the **project elements**
 * + the {@link FrameTools}
 * + the {@link PropsEditor}
 * 
 * may be ***refractor*** later for cleaner code
 * @returns 
 */
export function FrameDisplayer() {
    const { projects, createNewProject, currentProject, saveCurrentProject } = useProject()

    const { parentFrame, _parentFrameState } = useFrame()

    const { scale } = useScale()

    const { forceRender } = useForceRender()

    const { size: sizeDevice } = useDeviceSize('desktop')

    useEffect(() => {
        //@ts-ignore
        window.getInnerHTML = () => {
            const html = document.getElementById('frame-root')?.innerHTML

            return html
        }
    }, [_parentFrameState])

    return (
        <div
            className="absolute top-0 left-0 w-full h-full flex flex-col text-xl"
        >
            {/* project display  */}
            <header
                className="relative w-full flex flex-row min-h-8 border-2 border-red-500 p-1"
            >
                {projects.map((prj)=> {
                    return <ProjectDisplayer key={'project-' + prj.id} project={prj}/>
                })}
                <button 
                    className="relative bg-blue-500 h-full aspect-square rounded-2xl flex justify-center items-center border-2"
                    onClick={() => createNewProject('untitled')}
                >(+)</button>
            </header>

            <div
                className="relative w-full h-full flex flex-row border-1 border-black"
            >
                <div
                    className="relative h-full border-2 border-green-500 bg-[rgba(0,0,0,0.3)] flex flex-col overflow-auto"
                    style={{
                        minWidth: 300
                    }}
                >
                    {/* project name */}
                    <div
                        className="relative w-auto h-5 flex flex-row bg-red-700"
                    >
                        <div
                            className=" text-base text-red-300 whitespace-pre-wrap"
                        >Project: </div>
                        <input 
                            type="text"
                            value={currentProject?.name || ''}
                            onChange={(e) => {
                                if(currentProject) {
                                    currentProject.name = e.target.value
                                    forceRender()
                                }
                            }}
                            onBlur={(e) => {
                                if(currentProject) {
                                    saveCurrentProject({name: e.target.value || 'untitled'})
                                    forceRender()
                                }
                            }}
                        />
                        <div className="absolute right-0 h-full aspect-square z-1">
                            <ElementWithDescription
                                description="save project?"
                                allowHover
                                direction={['left']}
                            >
                                <Save onClick={() => {
                                    console.log(parentFrame.current)
                                    if(parentFrame.current) {
                                        const json = JSON.stringify(parentFrame.current)
                                        saveCurrentProject({frameAsJSON: json})
                                    }
                                }}/>
                            </ElementWithDescription>
                        </div>
                    </div>

                    <div className="relative w-full h-2 bg-emerald-200/50"/>
                    
                    {/* layer display  */}
                    {parentFrame.current && <LayerDisplayer props={parentFrame.current.props} />}
                </div>

                {/* frame display  */}
                
                <div
                    className="relative self-baseline border-2 border-fuchsia-500 flex justify-center items-center bg-black overflow-hidden"
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    id="frame-displayer"
                >
                    {parentFrame.current ? 
                        <>
                            <div
                                className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white overflow-auto my-scrollbar"
                            >
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-1/2 flex items-center justify-center overflow-hidden"
                                    style={{
                                        scale: scale,
                                        transformOrigin: "center",
                                        ...sizeDevice
                                    }}
                                    id='frame-root'
                                >
                                    {parentFrame.current.element }
                                </div>
                            </div>
                            <FocusElementDisplayer parentId="frame-displayer"/>
                            <FrameTools/>
                        </> : 
                        <div className="text-white">no project is chosen</div>
                    }
                </div>

                {/* editor display  */}
                <div
                    className="relative h-full border-2 border-yellow-500 bg-[rgba(0,0,0,0.3)]"
                    style={{
                        minWidth: 300
                    }}
                >
                    <PropsEditor/>
                </div>
            </div>
        </div>
    )
}