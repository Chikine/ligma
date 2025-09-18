import { useDelayEffect } from "@/hooks/useDelayEffect";
import { HTMLAttributes, JSX, ReactNode, useEffect, useState } from "react";

type DescDirectionNode = 'bottom' | 'top' | 'left' | 'right' | 'center'

type DescDirection = DescDirectionNode[]

export function ElementWithDescription({description, children, descProps = {}, direction = ['top'], timeout, allowHover = false, allowFocus = false}: {description: string | JSX.Element, children?: ReactNode, direction?: DescDirection , descProps?: HTMLAttributes<HTMLDivElement>, timeout?: number, allowHover?: boolean, allowFocus?: boolean}) {
    const [isHover, setIsHover] = useState(false)

    const [isFocus, setIsFocus] = useState(false)

    const [isVisible, setIsVisible] = useState(false)

    useDelayEffect(() => {
        setIsVisible((allowHover && isHover) || (allowFocus && isFocus))
    }, [isHover, isFocus], timeout ?? null)

    return (
        <div
            className="relative z-1000"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
        >
            <div>{children}</div>
            {isVisible &&
                <div
                    {...descProps}
                    className={[
                        descProps.className || '',
                        'absolute bg-black/500 text-white select-none border-2 border-blue-300 text-xs',
                        (typeof description === 'string' && 'rounded-full pl-2 pr-2'),
                        (direction.includes('center') && 'left-1/2 top-1/2 -translate-1/2 m-0'),
                        (direction.includes('bottom') && 'top-full mt-1 -translate-x-1/2'),
                        (direction.includes('top') && 'bottom-full mt-1 -translate-x-1/2'),
                        (direction.includes('left') && 'right-full ml-1 -translate-y-1/2'),
                        (direction.includes('right') && 'left-full mr-1 -translate-y-1/2'),
                        ((direction.includes('bottom') || direction.includes('top')) && !(direction.includes('left') || direction.includes('right')) && 'left-1/2'),
                        (!(direction.includes('bottom') || direction.includes('top')) && (direction.includes('left') || direction.includes('right')) && 'top-1/2')
                    ].filter(s => s).join(' ')}
                >
                    {description}
                </div>
            }
        </div>
    )
}