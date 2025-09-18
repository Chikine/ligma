import { useDeviceSize } from "@/hooks/useDeviceSize"

export function PreviewHTMLString({html}: {html: string}) {
    const { size } = useDeviceSize()

    return (
        <div
            className="relative flex flex-col text-inherit"
        >
            <div>Preview Element:</div>
            <div
                className="relative w-full bg-black border-2 border-green-500 overflow-auto grid place-items-center"
                style={{
                    aspectRatio: size.width / size.height || 1
                }}
            >
                <div dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
            
        </div>
    )
}