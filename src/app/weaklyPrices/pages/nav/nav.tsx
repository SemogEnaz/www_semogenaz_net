import { makeCheckboxsObj, makeCheckboxes, checkboxOptions } from '../../checkbox/checkbox';
import { useCost } from "../../MyListContext";

import './nav.css';

export default function Navigator({ categoryPanel, itemPanel, myListPanel }): JSX.Element {

    return (
        <div className="nav-panel">
            {categoryPanel}
            <div className="nav-col">
                {itemPanel}
                <SavingsPanel />
                {myListPanel}
            </div>
        </div>
    );
}

function SavingsPanel() {

    const { savingCost, spendingCost } = useCost();

    return (
        <div className="item-count-panel">
            <div className="nav-title saving-cost">
                Bill:
            </div>
            Saved: ${savingCost}<br></br>
            Spent: ${spendingCost}
        </div>
        
    );
}

export function MyListPanel({ setIsMyList }: { setIsMyList: any}) {
    return (
        <div className="" onClick={() => setIsMyList((prevBool: boolean)  => !prevBool)}>
            View Selected Items
        </div>
    )
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
            <div className="nav-title item-count">
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
            <div className="nav-title">Catagories</div>
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