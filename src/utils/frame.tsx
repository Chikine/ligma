import { defaultFrameAttribs } from "@/frames";
import { FrameElement } from "@/frames/FrameElement";
import { FrameProps } from "@/types";

/**
 * a class that render element base on props, and has methods to modify props
 */
export class Frame{
    constructor(
        props: FrameProps
    ){
        this.props = props

        this.props.attribs = props.attribs ?? defaultFrameAttribs[props.type]
    }

    props: FrameProps

    get element() {
        return <FrameElement key={'component-' + this.props.id} props={this.props}/>
    }

    toJSON() {
        return this.props
    }

    /**
     * get frame from json string
     * @param json frame props as json string
     * @returns 
     */
    static fromJSON(json: string) {
        const props = JSON.parse(json) as FrameProps || null
        if(props) {
            return new Frame(props)
        } else {
            return null
        }
    }
}