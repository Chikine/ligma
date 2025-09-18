import { defaultFrameAttribs } from '@/frames'
import { HTMLAttributes, RefObject } from 'react'

export * from './values'

export type Project = {
    /**project name */
    name: string

    /**project id */
    id: string

    /**project parent frame as json string, use for retrieve and save project */
    frameAsJSON?: string
}

/* frame types */

export type FrameType = keyof typeof defaultFrameAttribs

export type FrameProps = {
    /**props type */
    type: string

    /**props name */
    name: string

    /**props id */
    id: string

    /**props element attributes */
    attribs?: HTMLAttributes<HTMLElement>

    /**props children */
    children: FrameProps[]

    /**extra options */
    options?: Record<string, any>
}

/** others */
export type UnsyncHistoryNode<T> = {
    /**previous values in history*/
    prev: T[],
    /**current value */
    current?: T,
    /**next values in history*/
    next: T[]
}

export type PropsOptions = {
    isVisible: boolean
}

export type CustomFrameAttribs = {
    name: string,
    attribs: string,
    html: string,
    image: string
}