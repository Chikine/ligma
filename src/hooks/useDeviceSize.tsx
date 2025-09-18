import { useEffect, useRef, useState } from "react";

const sizeContainer: Record<string, {width: number, height: number}> = {
    desktop: {width: 1920, height: 1080}
}

export function useDeviceSize(_device = 'desktop') {
    const [size, setSize] = useState({width: 0, height: 0})

    const [device, setDevice] = useState<string>(_device)

    useEffect(() => {
        setSize(sizeContainer[device] ?? {width: 0, height: 0})
    }, [device])

    function changeSize(newSize: Partial<typeof size>, _device = device) {
        sizeContainer[_device] = {...sizeContainer[_device] ?? {}, ...newSize}
        if(device === _device) {
            setSize(size => ({...size, ...newSize}))
        }
    }

    return { size, changeSize, device, setDevice }
}