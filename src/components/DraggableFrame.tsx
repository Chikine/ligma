import { customFrameAttribs } from "@/frames"
import { FrameProps } from "@/types"
import { HTMLAttributes, useState } from "react"
import { useDrag } from "react-dnd"

/**
 * + draggable element, which has type and attributes , for drag and drop
 * @param param0 
 * @returns 
 */
export function DraggableFrame({type, attribs}: {type: string, attribs?: HTMLAttributes<HTMLElement>}) {
    //detect user hover
    const [isHover, setIsHover] = useState(false)

    //drag element handler
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'FRAME',
        //item: frame props with default name and no id (set later in drop area)
        item: { props: {type, id: '', name: type, attribs, children: []} as FrameProps },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))

    const imageSrc = customFrameAttribs[type]?.['image'] || ('/' + type + '-frame-icon.png')

    return (
        <div
            className="relative h-full aspect-square flex justify-center items-center bg-amber-300"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
                cursor: isDragging ? 'grabbing' : isHover ? 'grab' : 'default'
            }}
        >
            {drag(<span className="relative w-full h-full grid place-items-center"><img 
                className="relative w-full h-auto"
                src={imageSrc}
            ></img></span>)}
            <div
                className={"absolute w-full left-0 bottom-11/10 h-4 text-xs border-blue-800 border-2 rounded-xl bg-black flex justify-center items-center text-white"
                    + " " + (isHover ? "select-none" : "pointer-events-none")
                }
                style={{
                    transition: 'all 0.3s ease',
                    opacity: isHover ? 1 : 0
                }}
            >
                <div>{type}</div>
            </div>
        </div>
    )
}