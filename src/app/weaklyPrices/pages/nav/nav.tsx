import { makeCheckboxsObj, makeCheckboxes, checkboxOptions } from '../../checkbox/checkbox';
import { useCost } from "../../ListContext";
import { useCategoryIndex, usePagerContext, useViewList } from '../NavContext';

import './nav.css';

export default function Navigator({ children }: { children: JSX.Element }): JSX.Element {

    return (
        <div className="nav-panel">
            { children }
            <div className="nav-col">
                <div className="flex flex-row">
                    <PageCountPanel />
                </div>
                <SavingsPanel />
                <MyListPanel />
            </div>
        </div>
    );
}

function SavingsPanel() {

    const { total, last } = useCost();

    const formatLastCost = (lastCost: number): JSX.Element => (
        lastCost > 0 ?
        <span style={{color:"darkgreen"}}>+${lastCost}</span> :
        <span style={{color:"darkred"}}>-${-1*lastCost}</span>
    );

    return (
        <div className="item-count-panel">

            <div className="nav-title saving-cost">
                Price Data:
            </div>

            <div>Saved: ${total.saved} {formatLastCost(last.saved)}</div>
            <div>Spent: ${total.spent} {formatLastCost(last.spent)}</div>

        </div>
    );
}

export function MyListPanel() {
    const { setState: setIsMyList } = useViewList();

    return (
        <div className="nav-title my-list" onClick={() => setIsMyList((prevBool: boolean)  => !prevBool)}>
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
    );

    return (  
        <div className="item-count-panel mb-[8px]">
            <div className="nav-title item-count">
                ltem Count:
            </div>
            {checkboxOptions(itemCountComponent)}
        </div>
    );
};

function PageCountPanel() {

    const { pageCount } = usePagerContext();

    const itemCountObj = makeCheckboxsObj(
        ['1', '2', '3'],
        ['1', '2', '3']
    );

    const itemCountComponent = makeCheckboxes(
        itemCountObj, pageCount
    );

    return (  
        <div className="item-count-panel mb-[8px]">
            <div className="nav-title item-count">
                Page Count:
            </div>
            {checkboxOptions(itemCountComponent)}
        </div>
    );
}

export function CatagoryPanel({ categories }: { categories: string[]}) {

    const { setState: setIndex } = useCategoryIndex();
    const { setState: setViewList } = useViewList();

    const Selector = ({category, index}: 
        { category: string, index: number }): JSX.Element => (
        <div className="catagory" onClick={() => {
            setIndex(index); setViewList(false) }}>
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