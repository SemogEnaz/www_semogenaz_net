export function makeCheckboxsRaw(contents: string[], values: string[], attribute: string) {
    const checkboxes = [];

    if (contents.length != values.length) throw new Error("ERROR contents != values");

    for (let i = 0; i < contents.length; i++) {
        checkboxes.push({ 
            content: contents[i],
            value: values[i],
            attribute: attribute
        });
    }

    return checkboxes;
};

export function makeCheckboxes(
    checkboxes: {content: string, value: string, attribute: string}[],
    state: {options: any, setOptions: (options: any) => void}) {

    const toggleCheckbox = (element: any) => {
        state.setOptions((option: any) => ({
            ...option,
            [element.attribute]: 
            option[element.attribute] == element.value ? 
            '' : element.value
        }));
    }

    return (
        <>
        {checkboxes.map((element, index: number) => (
            <Checkbox
                key={index}
                content={element.content}
                isChecked={state.options[element.attribute] == element.value}
                hasFormat={true}
                handleClick={() => toggleCheckbox(element)} />
        ))}
        </>
    );
};

export function makeDependingCheckboxes(
    checkboxes: {content: string, value: string | boolean, attribute: string}[],
    state: {options: any, setOptions: (options: any) => void},
    trigger: boolean) {

    const toggleCheckbox = (element: any) => {
        
        // Set value on trigger
        if (trigger)
            state.setOptions((option: any) => ({
                ...option,
                [element.attribute]: 
                option[element.attribute] == element.value ? '' : element.value
            }));
    }

    return (
        <>
        {checkboxes.map((element, index) => (
            <Checkbox
                key={index}
                content={element.content}
                isChecked={state.options[element.attribute] == element.value}
                hasFormat={trigger}
                handleClick={() => toggleCheckbox(element)} />
        ))}
        </>
    );
};

export const formOptions = (title: string, component: any): any => {
    return (
        <div className="form-options">
            <div>{title}</div>
            {component}
        </div>
    );
};

export const checkboxOptions = (elements: any): any => {
    return (
        <div className="checkbox-options">
            {elements}
        </div>
    );
}

type CheckboxProps = {
    content: string,
    isChecked: boolean, 
    hasFormat: boolean,
    handleClick : (options: any) => void
};

export function Checkbox({ content, isChecked, hasFormat, handleClick }: CheckboxProps) {

    const colorClass = hasFormat ? (isChecked ? 'checked' : '') : 'blocked';

    return (
        <div className="checkbox">

            <div
                className={`box ${colorClass}`}
                onClick={handleClick}></div>

            <div className="label">{content}</div>

        </div>
    );
};