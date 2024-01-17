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

    const handleClick = (element: any) => {
        state.setOptions((option: any) => ({
            ...option,
            [element.attribute]: 
            option[element.attribute] == element.value ? 
            '' : element.value
        }));
    }

    return (
        <>
            {checkboxes.map((element) => (
                    <Checkbox
                        key={element.value}
                        content={element.content}
                        isChecked={state.options[element.attribute] == element.value}
                        hasFormat={true}
                        handleClick={() => handleClick(element)} />
                )
            )}
        </>
    );
};

export function makeDependingCheckboxes(
    checkboxes: {content: string, value: string, attribute: string}[],
    state: {options: any, setOptions: (options: any) => void},
    trigger: boolean) {

    const handleClick = (element: any) => {
        
        // Set value on trigger
        if (trigger)
            state.setOptions((option: any) => ({
                ...option,
                [element.attribute]: 
                option[element.attribute] == element.value ? '' : element.value
            }));
    }

    /*
    // Set empty values/reset on false trigger
    if (!trigger)
        console.log(`Reseting attribute`)
        state.setOptions((option: any) => ({
            ...option,
            [option.attribute]: '',
        }));
    */

    /* Implementation from chatGPT to implement a state reset
    
        To set the attribute to an empty string (`''`) when the `trigger` is false, you need to modify the logic within your function. The challenge here is to reset the values without causing an infinite loop or excessive re-renders. 

        It's important to note that directly modifying the state in the function body can lead to unintended side effects and re-renders. A good approach is to handle this reset logic in a `useEffect` in the component that uses `makeDependingCheckboxes`, which watches the `trigger` value and resets the state accordingly.

        However, if you must do it within `makeDependingCheckboxes`, you'll need to be careful. Here’s a suggested way to approach this:

        1. **Pass a Reset Function:** Instead of directly setting the state inside `makeDependingCheckboxes`, pass a function that will reset the state from the parent component. This function will be called when `trigger` is false.

        2. **Use Effect in Parent Component:** In the parent component, use an effect that calls this reset function whenever `trigger` changes to false.

        Here's how you could modify `makeDependingCheckboxes`:

        ```javascript
        export function makeDependingCheckboxes(
            checkboxes: { content: string, value: string, attribute: string }[],
            state: { options: any, setOptions: (options: any) => void },
            trigger: boolean,
            resetState: () => void) {  // <-- New reset function passed as a prop

            const handleClick = (element: any) => {
                if (trigger) {
                    state.setOptions((option: any) => ({
                        ...option,
                        [element.attribute]: 
                        option[element.attribute] === element.value ? '' : element.value
                    }));
                } else {
                    resetState();  // <-- Call reset function when trigger is false
                }
            }

            return (
                <>
                    {checkboxes.map((element) => (
                        <Checkbox
                            key={element.content}
                            content={element.content}
                            isChecked={state.options[element.attribute] === element.value}
                            hasFormat={trigger}
                            handleClick={() => handleClick(element)} />
                    ))}
                </>
            );
        };
        ```

        And in your parent component, define the `resetState` function:

        ```javascript
        const resetState = () => {
            setOptions(options => {
                // Logic to reset your options
                return // new options;
            });
        };
        ```

        Then use `useEffect` to call this reset when `trigger` changes to false:

        ```javascript
        useEffect(() => {
            if (!trigger) {
                resetState();
            }
        }, [trigger]);
        ```

        This approach ensures that your state is reset only when `trigger` changes to false, and it avoids the complications of trying to manage side effects directly within `makeDependingCheckboxes`.
    */

    return (
        <>
            {checkboxes.map((element) => (
                <Checkbox
                    key={element.content}
                    content={element.content}
                    isChecked={state.options[element.attribute] == element.value}
                    hasFormat={trigger}
                    handleClick={() => handleClick(element)} />
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