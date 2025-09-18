//options api
const options_api_location = 'options api location'

/**return options object */
export const getOptions = () => JSON.parse(localStorage.getItem(options_api_location) || '{}') as Partial<{
    autoSave: boolean,
    scale: number
}>

/**overwrite options in local storage */
export const setOptions = (options: object) => localStorage.setItem(options_api_location, JSON.stringify(options))

/**alter options in local storage */
export const alterOptions = (props: object = {}) => {
    const options = getOptions()
    Object.assign(options, props)
    setOptions(options)
}