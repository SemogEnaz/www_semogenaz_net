import { makeCheckboxsObj, makeCheckboxes, checkboxOptions } from '../../checkbox/checkbox';
import { useSavingsCost } from "../../MyListContext";

export default function Navigator({ categoryPanel, itemPanel }): JSX.Element {

    return (
        <div className="nav-panel">
            {categoryPanel}
            <div className="nav-col">
                {itemPanel}
                <SavingsPanel />
            </div>
        </div>
    );
}

function SavingsPanel() {

    const savingsCost = useSavingsCost();

    return <div className="">
        {savingsCost}
    </div>
}

export function ItemCountPanel({ itemCount, setItemCount }:
    { itemCount: string, setItemCount: any }) {

    const itemCountObj = makeCheckboxsObj(
        ['10', '15'],
        ['10', '15']
    );

    const itemCountComponent = makeCheckboxes(
        itemCountObj,
        { state: itemCount, setState: setItemCount }
    )

    return (  
        <div className="item-count-panel mb-[8px]">
            <div className="catagory-title" style={{fontSize:`20px`}}>
                Item Count:
            </div>
            {checkboxOptions(itemCountComponent)}
        </div>
    );
};

export function CatagoryPanel({ categories, setIndex }: { categories: any, setIndex: any }) {

    const Selector = ({category, index}: 
        { category: string, index: number }): JSX.Element => (
        <div className="catagory" onClick={() => setIndex(index)}>
            {category}
        </div>
    );

    return (
        <div className='nav-col'>
            <div className="catagory-title">Catagories</div>
            <div className="catagory-panel">
                {categories.map((category, index) => (
                    <Selector
                        key={index}
                        category={category}
                        index={index} />
                ))}
            </div>
        </div>
    )
};