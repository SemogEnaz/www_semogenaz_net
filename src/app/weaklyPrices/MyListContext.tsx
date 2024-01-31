import React, { createContext, useContext, useState } from 'react';

import Item from './item';

const MyListContext = createContext<Item[] | undefined>(undefined);

// Methods related to list
const AddItemContext = createContext<(itemToAdd: Item) => void>(() => {});
const RemoveItemContext = createContext<(itemToRemove: string) => void>(() => {});
const CheckListContext = createContext<(itemLink: string) => boolean>(() => true);
const CostContext = createContext<{savingCost: number, spendingCost: number}>({savingCost: 0, spendingCost: 0});

export function useList() {
    return useContext(MyListContext);
}

export function useListOperations() {
    return {
        addItem: useContext(AddItemContext),
        removeItem: useContext(RemoveItemContext),
        checkList: useContext(CheckListContext)
    };
}

export function useCost() {
    return useContext(CostContext);
}

/*
    - MyListContext returns the list
    - Add & Remove ItemContext returns the respective function.

    All the above are bundled in the Provider, so all the children
    can access the 3 values, make sure to call it where you want to
    START using it.
*/
export function MyListProvider({ children }: { children: JSX.Element}) {

    const [myList, setMyList] = useState<Item[]>([]);

    const addItem = (itemToAdd: Item): void => {
        setMyList((prevList: Item[]) => [...prevList, itemToAdd]);
    }

    const removeItem = (itemLink: string): void => {
        setMyList((prevList: Item[]) => (
            prevList.filter((currItem: Item) => 
                currItem.link != itemLink
        )));
    };

    const getSavingsCost = (): number => {
        return (
            myList.reduce(
                (acc: number, item: Item) => (
                    Math.round(acc + (Number(item.oldPrice) - Number(item.newPrice)))
                ), 0)
        );
    }

    const getSpendingCost = (): number => {
        return (
            myList.reduce(
                (acc: number, item: Item) => (
                    Math.round(acc + Number(item.newPrice))
                ), 0)
        );
    }

    // This is working backwards for some reason??? 
    const checkList = (itemLink: string): boolean => (
        myList.some((currItem: Item) => currItem.link == itemLink)
    );

    return (
        <MyListContext.Provider value={myList}>
            <AddItemContext.Provider value={addItem}>
            <RemoveItemContext.Provider value={removeItem}>
            <CheckListContext.Provider value={checkList}>
            <CostContext.Provider value={{
                savingCost: getSavingsCost(),
                spendingCost: getSpendingCost()}}>

                {children}
                
            </CostContext.Provider>
            </CheckListContext.Provider>
            </RemoveItemContext.Provider> 
            </AddItemContext.Provider> 
        </MyListContext.Provider>
    );
}