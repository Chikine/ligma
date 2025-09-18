import { useFocusProps } from "@/hooks/useFocusProps";
import { useFrame } from "@/hooks/useFrame";
import { useMenu } from "@/hooks/useMenu";
import { useName } from "@/hooks/useName";
import { useProject } from "@/hooks/useProject";
import { usePropsOptions } from "@/hooks/usePropsOptions";
import { FrameProps } from "@/types";
import { Frame } from "@/utils/frame";
import { Eye, EyeOff, SquareChevronDown, SquareChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PopMenuWhenClick } from "./PopMenuWhenClick";

/**
 * ### Layer Displayer
 * + display project element in folder form
 * + use to control element (focus, delete, add element , hide element...)
 * @param param0 
 * @returns 
 */
export function LayerDisplayer({props, depth = 0, display = true, visible = true, openDispatchList = []} : {props: FrameProps, depth?: number, display?: boolean, visible?: boolean, openDispatchList?: React.Dispatch<React.SetStateAction<boolean>>[]}) {
    const { saveCurrentProject } = useProject()

    const { propsOptionsRecord, setOptions } = usePropsOptions()

    const { parentFrame, findProps, commitFrame } = useFrame()

    const { setFocusProps, focusProps } = useFocusProps()

    const { hideMenu } = useMenu()

    const { getNameWithIndex } = useName()

    const [isOpen, setIsOpen] = useState(false)

    const [isVisible, setIsVisible] = useState(true)

    const menuRef = useRef<HTMLDivElement | null>(null)

    const layerMenu = useRef(
        <div ref={menuRef} className="relative w-75 h-auto p-1 bg-amber-100">
            <div
                className="hover:bg-amber-800 select-none"
                onClick={() => {
                    const newProps: FrameProps = {
                        type: 'div',
                        id: crypto.randomUUID(),
                        name: getNameWithIndex({startsWith: 'div'}),
                        children: []
                    }

                    const {props: parent} = findProps(props.id)
                    if(parent) {
                        parent.children.push(newProps)
                        commitFrame()
                    }
                }}
            >add div</div>
            <div
                className="hover:bg-amber-800 select-none"
                onClick={() => {
                    const newProps: FrameProps = {
                        type: 'p',
                        id: crypto.randomUUID(),
                        name: getNameWithIndex({startsWith: 'div'}),
                        children: []
                    }

                    const {props: parent} = findProps(props.id)
                    if(parent) {
                        parent.children.push(newProps)
                        commitFrame()
                    }
                }}
            >add p</div>
            <div
                className="hover:bg-amber-800 select-none"
                onClick={() => {
                    const {propsParent} = findProps(props.id)
                    if(propsParent) {
                        propsParent.children = propsParent.children.filter(child => child.id !== props.id)
                        commitFrame()
                        hideMenu()
                    } else {
                        alert((props.name || 'this') + ' cannot be delete')
                    }
                }}
            >delete?</div>
        </div>
    )

    function focusThis() {
        const obj = findProps(props.id)
        if(obj.props) {
            setFocusProps(obj.props)
        }
    }

    useEffect(() => {
        setOptions(props.id, {...propsOptionsRecord[props.id], isVisible})
    }, [isVisible])

    useEffect(() => {
        if(props.id === focusProps?.id) {
            openDispatchList.forEach(dispatch => dispatch(true))
        }
    }, [focusProps])

    return (
        <>
            <PopMenuWhenClick
                menu={layerMenu.current}
                menuRef={menuRef}
                rightClick
            >
                <div
                    className="relative w-full h-6 flex flex-row bg-transparent hover:bg-blue-500/50"
                    style={{
                        display: display ? 'flex' : 'none',
                        opacity: visible && isVisible ? 1 : 0.6
                    }}
                    onClick={focusThis}
                >
                    <div
                        className="relative self-start h-full aspect-square flex justify-center items-center"
                    >
                        {isVisible ?
                            <Eye size={20} onClick={() => setIsVisible(b => !b)} className="text-black/50 hover:text-red-500/50"/> :
                            <EyeOff size={20} onClick={() => setIsVisible(b => !b)} className="text-black/50 hover:text-red-500/50"/>
                        }
                    </div>
                    <div style={{marginRight: 5 + depth * 12}}></div>
                    {isOpen ?
                        <SquareChevronDown onClick={() => setIsOpen(b => !b)} /> :
                        <SquareChevronRight onClick={() => setIsOpen(b => !b)} />
                    }
                    <div className={"self-center select-none" + (props.id === focusProps?.id ? " text-red-500/80" : "")} onClick={() => setIsOpen(b => !b)} > 
                        {props.name || props.type} 
                    </div>
                </div>
            </PopMenuWhenClick>
            
            <div
                className="relative w-full h-auto flex flex-col"
                style={{
                    display: display ? 'flex' : 'none'
                }}
            >
                {props.children?.map(child => (
                    <LayerDisplayer key={child.id} props={child} depth={depth + 1} display={isOpen} visible={visible && isVisible} openDispatchList={[...openDispatchList, setIsOpen]}/>
                ))}
            </div>
        </>
    )
}