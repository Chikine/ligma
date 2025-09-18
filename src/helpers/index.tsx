import isEqual from 'fast-deep-equal/es6/react'

function objectToHTMLAttributes(obj: object) {
    return Object.entries(obj)
        .map(([key, value]) => {
            if (value == null) return ""; // skip null/undefined

            if (typeof value === "object" && !Array.isArray(value)) {
                // handle nested objects (like style)
                if (key === "style") {
                    const styleString = Object.entries(value)
                        .map(([prop, val]) => `${toKebabCase(prop)}:${val}`)
                        .join(";")
                    return `style="${styleString}"`
                } else {
                    // for other objects, you could JSON.stringify or skip
                    return `${key}='${JSON.stringify(value)}'`
                }
            }

            return `${key}="${String(value)}"`
        }).filter(Boolean).join(" ")
}

function toKebabCase(str: string) {
    return str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase())
}

function resizeAndCropImage(file: File, width = 50, height = 50): Promise<string> {
    return new Promise((resolve, reject) => {
        //file reader
        const reader = new FileReader()

        //load event listener
        reader.onload = (e) => {
            const img = new Image()
            
            img.onload = () => {
                const imgWidth = img.width
                const imgHeight = img.height

                //try get target ratio
                const ratio = Math.min(imgWidth / width, imgHeight / height)

                //get start point
                const sx = (imgWidth - width * ratio) / 2
                const sy = (imgHeight - height * ratio) / 2

                //try resize using canvas => return base64 img
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
                canvas.width = width
                canvas.height = height
                ctx.drawImage(img, sx, sy, width, height)

                const base64img = canvas.toDataURL('image/png', 0.8)
                resolve(base64img)
            }

            img.onerror = reject
            img.src = (e.target?.result as string | null) || ''
        }

        reader.onerror = reject

        reader.readAsDataURL(file)
    })
}


export { isEqual, objectToHTMLAttributes, resizeAndCropImage }