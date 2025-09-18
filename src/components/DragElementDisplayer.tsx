import { customFrameAttribs, defaultFrameAttribs } from "@/frames";
import { DraggableFrame } from "./DraggableFrame";
import { FrameElement } from "@/frames/FrameElement";
import { createRef, useRef } from "react";
import { useMenu } from "@/hooks/useMenu";
import { PopMenuWhenClick } from "./PopMenuWhenClick";
import { getCustomFrameAttribs, setCustomFrameAttribs } from "@/api/frameApi";
import { useForceRender } from "@/hooks/useForceRender";
import { useNavigate } from "react-router-dom";
import { ElementWithDescription } from "./ElementWithDescription";
import { CirclePlus } from "lucide-react";

/**
 * + a draggable elements container, containing provided and custom element 
 * + each element is a dnd element, that can be drop in {@link FrameElement}
 * @returns 
 */
export function DragElementDisplayer() {
    const navigate = useNavigate()
    const { hideMenu } = useMenu()

    const { forceRender } = useForceRender()

    function deleteElement(name: string) {
        const record = getCustomFrameAttribs()

        delete record[name]

        delete customFrameAttribs[name]

        setCustomFrameAttribs(record)

        hideMenu()

        forceRender()
    }

    return (
        <div
            className="relative w-full h-12 flex flex-row gap-5 bg-green-300"
        >
            <div>Elements: </div>
            <div
                className="relative w-full h-full overflow-y-hidden overflow-x-auto my-scrollbar flex flex-row"
            >
                {Object.keys(defaultFrameAttribs).map(type => {
                    const menuRef = createRef<HTMLDivElement | null>()

                    const dragMenu = (
                        <div
                            ref={menuRef}
                        >
                            <div
                                onClick={() => deleteElement(type)}
                                className="hover:bg-amber-800 select-none"
                            >delete?</div>
                            <div
                                onClick={() => {
                                    const params = new URLSearchParams({
                                        edit: 'true',
                                        element: type
                                    })

                                    navigate('/create?' + params.toString())

                                    hideMenu()

                                    forceRender()
                                }}
                                className="hover:bg-amber-800 select-none"
                            >edit?</div>
                        </div>
                    )

                    return(
                        <PopMenuWhenClick
                            key={'drag-elem-' + type} 
                            menu={dragMenu}
                            menuRef={menuRef}
                            rightClick
                        >   
                            <DraggableFrame  
                                type={type}
                            ></DraggableFrame>
                        </PopMenuWhenClick>
                    )
                })}
            </div>
            <div
                className=" relative h-full aspect-square grid place-items-center bg-blue-700"
            >
                <ElementWithDescription
                    description={<div className=" bg-cyan-200 text-red-400">create new element</div>}
                    direction={['left']}
                    allowHover
                >
                    <CirclePlus onClick={() => navigate('/create')} className="text-emerald-500"/>
                </ElementWithDescription>
            </div>
        </div>
    )
}