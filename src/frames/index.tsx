import { getCustomFrameAttribs } from "@/api/frameApi";
import { HTMLAttributes } from "react";

export const customFrameAttribs = getCustomFrameAttribs()

const attribs = Object.fromEntries(
    [...Object.entries(customFrameAttribs)]
    .map(([key, {attribs}]) => ([key, JSON.parse(attribs || '{}') as HTMLAttributes<HTMLElement>]))
)

/**
 * + all default frame attributes
 */
export const defaultFrameAttribs: Record<string, HTMLAttributes<HTMLElement>> = {
    div: {
        style: {
            position: 'relative',
            width: '50%',
            height: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(105, 227, 255)',
            color: 'black',
            border: '2px solid black'
        }
    } as HTMLAttributes<HTMLDivElement>,
    p: {
        style: {
            position: 'relative',
            whiteSpace: 'pre-wrap',
            fontSize: 50,
            font: 'inherit',
            width: 300
        },
        defaultValue: "text here"
    } as HTMLAttributes<HTMLParagraphElement>,
    ...attribs
}