import { CustomFrameAttribs } from "@/types"

const custom_frame_attribs_api_location = 'custom frame attribs api location'

const last_edit_attribs_api_location = 'last attribs api location'

export const getCustomFrameAttribs = () => JSON.parse(localStorage.getItem(custom_frame_attribs_api_location) || '{}') as Record<string, CustomFrameAttribs>

export const setCustomFrameAttribs = (record: Record<string, CustomFrameAttribs>) => localStorage.setItem(custom_frame_attribs_api_location, JSON.stringify(record))

export const addCustomFrameAttribs = (record: Record<string, CustomFrameAttribs>) => {
    const res = {...getCustomFrameAttribs(), ...record}
    setCustomFrameAttribs(res)
}

export const getLastEditAttribs = () => JSON.parse(localStorage.getItem(last_edit_attribs_api_location) || '{}') as Partial<CustomFrameAttribs> | null

export const setLastEditAttribs = (last: Partial<CustomFrameAttribs>) => localStorage.setItem(last_edit_attribs_api_location, JSON.stringify(last))