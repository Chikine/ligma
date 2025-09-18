import { HTMLAttributes, useEffect, useState } from "react";
import { PreviewHTMLString } from "./PreviewHTMLString";
import { customFrameAttribs, defaultFrameAttribs } from "@/frames";
import { useDelayEffect } from "@/hooks/useDelayEffect";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Info } from "lucide-react";
import { ElementWithDescription } from "./ElementWithDescription";
import { objectToHTMLAttributes, resizeAndCropImage } from "@/helpers";
import { PreviewImage } from "./PreviewImage";
import { CustomFrameAttribs, FrameProps } from "@/types";
import { addCustomFrameAttribs, getLastEditAttribs, setLastEditAttribs } from "@/api/frameApi";
import { useLocation, useNavigate } from "react-router-dom";

export function CreateElementRoute() {
    const navigate = useNavigate()

    const [name, setName] = useState('')

    const [html, setHtml] = useState('')

    const [attributes, setAttributes] = useState('{}')

    const [avatarSrc, setAvatarSrc] = useState('')

    const [errors, setErrors] = useState<boolean[]>([])

    const [previewHTML, setPreviewHTML] = useState('')

    const {search} = useLocation()

    const params = new URLSearchParams(search)

    const isEdit = params.get('edit') === 'true'

    function getHTMLString() {
        try {
            let res = html

            const attribsAsString = objectToHTMLAttributes(JSON.parse(attributes))

            res = res.replace(/{\s*attributes\s*}/g, attribsAsString)

            res = res.replace(/{\s*children\s*}/, '<button style="color: aqua; position: relative"> children / inner html here</button>')

            setPreviewHTML(res)
        } catch (e) {
            console.log('[html error] -', e)
        }
    }

    function getErrorsFromInput() {
        //check for { children } in string
        const childRegex = /{\s*children\s*}/g

        //check if attributes is not correct form
        let error3:boolean = true

        try {
            error3 = !(JSON.parse(attributes) as React.HTMLAttributes<HTMLElement> | false)
        } catch(e) {}

        return [
            !name, //error 0, no name
            !isEdit && !!defaultFrameAttribs[name as keyof typeof defaultFrameAttribs], //error 1, name existed (if not in edit mode)
            (html.match(childRegex) || []).length >= 2, //error 2: {children} occur more than 1 in html 
            error3, //error 3: attributes incomplete or not a html attributes 
        ]
    }

    async function handleInputImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const imageSrc = await resizeAndCropImage(file, 200, 200)
            console.log(imageSrc)
            setAvatarSrc(imageSrc)
        } catch(e) {
            alert('unexpected error')
        }
    }

    function handleCreate() {
        if(!errors.some(b => b)) {
            const record: Record<string, CustomFrameAttribs> = {
                [name]: {
                    name,
                    attribs: attributes,
                    html,
                    image: avatarSrc
                }
            }

            addCustomFrameAttribs(record)

            alert('successfully created element')
        }
    }

    function handleClear() {
        const c = confirm('clear all?')
        if(!c) return

        setName('')
        setAttributes('')
        setHtml('')
        setAvatarSrc('')
    }

    function handleCancel() {
        const last = {
            name,
            attribs: attributes,
            html,
            image: avatarSrc
        } as Partial<CustomFrameAttribs>
        setLastEditAttribs(last)
        navigate('/')
    }

    useEffect(() => {

        if(isEdit) {
            const name = params.get('element') || ''
            const element = customFrameAttribs[name]

            if(element) {
                setName(element.name)
                setAttributes(element.attribs)
                setHtml(element.html)
                setAvatarSrc(element.image)
            }
        } else {
            const last = getLastEditAttribs()

            if(last) {
                setName(last.name || '')
                setAttributes(last.attribs || '{}')
                setHtml(last.html || '')
                setAvatarSrc(last.image || '')
            }
        }
    }, [])

    useDelayEffect(() => {
        const errors = getErrorsFromInput()
        setErrors(errors)
        if(!errors.some(b => b)) {
            getHTMLString()
        }

        function saveLastEdit() {
            const last = {
                name,
                attribs: attributes,
                html,
                image: avatarSrc
            } as Partial<CustomFrameAttribs>
            setLastEditAttribs(last)
        }

        window.addEventListener('beforeunload', saveLastEdit)

        return () => {
            window.removeEventListener('beforeunload', saveLastEdit)
        }
    }, [name, html, attributes, avatarSrc], 500)

    return (
        <div
            className="relative w-full h-full bg-black/80 border-2 border-red-500 flex flex-row text-white"
        >
            <div
                className="relative w-full h-full mr-2 flex flex-col"
            >
                <PreviewHTMLString html={previewHTML} />
                <PreviewImage imageSrc={avatarSrc} />
            </div>
            <div
                className="relative w-full h-full"
            >
                <InputWithError 
                    value={name} 
                    setValue={setName} 
                    label="Name:" 
                    error={errors[0] ? 'missing name' : errors[1] ? 'name existed' : ''} 
                    inputAttribs={{placeholder: 'enter unique name'}}
                />
                <div
                    className="relative flex"
                >
                    <div
                        style={{
                            color: errors[2] ? 'red' : 'inherit'
                        }}
                    >HTML element:</div>
                    <div
                        className="relative w-full flex flex-row-reverse mr-5"
                    >
                        <ElementWithDescription
                            description={
                                <div
                                    className="relative bg-indigo-400 flex flex-col"
                                >
                                    <div>provide a HTML Element :</div>
                                    <div>+ use <span style={{color: 'purple'}}>{'{attributes}'}</span> to represent for editable attributes of the element (no limit)</div>
                                    <div>+ use <span style={{color: 'aqua'}}>{'{children}'}</span> to represent for place that element children should land on (limit 1)</div>
                                </div>
                            }
                            direction={['left']}
                            allowHover
                            timeout={100}
                        >
                            <Info />
                        </ElementWithDescription>
                    </div>
                </div>
                <CodeEditor
                    value={html}
                    language="html"
                    placeholder="enter your html element..."
                    onChange={(e) => setHtml(e.target.value)}
                    style={{
                        width: 'calc(100% - 20px)',
                        height: 'auto',
                        fontSize: 16
                    }}
                />
                {errors[2] && <div className=" text-xs text-red-500"> children must occur less than 2</div>}

                <div
                    className="relative flex"
                >
                    <div
                        style={{
                            color: errors[2] ? 'red' : 'inherit'
                        }}
                    >Attributes :</div>
                    <div
                        className="relative w-full flex flex-row-reverse mr-5"
                    >
                        <ElementWithDescription
                            description={
                                <div
                                    className="relative bg-indigo-400 flex flex-col"
                                >
                                    <div>HTML Attributes for your element</div>
                                    <div>Write a json object</div>
                                </div>
                            }
                            direction={['left']}
                            allowHover
                            timeout={100}
                        >
                            <Info />
                        </ElementWithDescription>
                    </div>
                </div>
                <CodeEditor
                    value={attributes}
                    language="json"
                    placeholder="enter your attributes..."
                    onChange={(e) => setAttributes(e.target.value)}
                    style={{
                        width: 'calc(100% - 20px)',
                        height: 'auto',
                        fontSize: 16
                    }}
                />
                {errors[3] && <div className=" text-xs text-red-500"> not a valid json object </div>}
                <div>Avatar:</div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputImage}
                />
                <div
                    className="relative mt-5 flex flex-row gap-10"
                >
                    <button onClick={handleCreate} className=" text-white bg-emerald-500 border-2 border-purple-500 rounded-full p-2">Create!</button>
                    <button onClick={handleClear} className=" text-white bg-red-500 border-2 border-amber-500 rounded-full p-2">Clear all?</button>
                    <button onClick={handleCancel} className=" text-black bg-blue-400 border-2 border-white rounded-full p-2">Cancel?</button>
                </div>
            </div>
        </div>
    )
}

//input with error?
function InputWithError({value, setValue, label, error, inputAttribs}: {value: string, setValue: React.Dispatch<React.SetStateAction<string>>, label?: string, error?: string, inputAttribs?: React.InputHTMLAttributes<HTMLInputElement>, }) {
    return (
        <>
            <div
                style={{
                    color: !!error ? 'red' : 'inherit'
                }}
            >{label}</div>
            <input
                className=" ring-1 ring-yellow-300 rounded-2xl pl-2 pr-2"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="enter value..."
                {...inputAttribs}
            />
            <div className=" text-xs text-red-500">
                {error}
            </div>
        </>
    )
}