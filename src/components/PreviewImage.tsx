
export function PreviewImage({ imageSrc }: {imageSrc: string}) {
    return (
        <div
            className="relative flex flex-col text-inherit"
        >
            <div>Preview Image:</div>
            <div
                className="relative w-50 aspect-square border-2 border-green-500"
            >
                {imageSrc ? <img src={imageSrc} alt="Image?"></img> : <div className=" whitespace-pre-wrap">No Image Provided ._. </div>}
            </div>
        </div>
    )
}