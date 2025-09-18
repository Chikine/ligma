import { SquareChevronDown, SquareChevronRight } from "lucide-react"
import { JSX, useState } from "react"

type EditorComponentType = {
    type?: 'json' | 'text',
    title: string,
    content: JSX.Element,
    readonly?: boolean
}

export function EditorComponent({type, title, content, readonly = false} : EditorComponentType) {
    //is open boolean 
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="relative w-full h-auto"
            style={{
                transition: 'all 0.5s ease'
            }}
        >
            <div
                className="relative w-full h-6 flex flex-row"
            >
                <div
                    className="relative h-full aspect-square flex justify-center items-center"
                >
                    {isOpen ? 
                        <SquareChevronDown size={24} onClick={() => setIsOpen(b => !b)} /> :
                        <SquareChevronRight size={24} onClick={() => setIsOpen(b => !b)} />
                    }
                </div>
                <div
                    className="relative w-full h-full text-xl flex flex-row"
                >
                    <div className="self-center truncate">
                        {title}
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className="relative w-full h-auto flex justify-center items-center p-2"
                >
                    {content}
                </div>
            )}
        </div>
    )
}