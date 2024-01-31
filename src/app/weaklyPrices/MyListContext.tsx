import React, { createContext, useContext, useState } from 'react';

import { Item, Costs } from './types';

const MyListContext = createContext<Item[] | undefined>(undefined);

const defaultCost = {savedCost: 0, itemCost: 0};

// Methods related to list
const AddItemContext = createContext<(itemToAdd: Item) => void>(() => {});
const RemoveItemContext = createContext<(itemLink: string) => void>(() => {});
const CheckListContext = createContext<(itemLink: string) => boolean>(() => true);
const TotalCostContext = createContext<Costs>(defaultCost);
const LastCostContext = createContext<Costs>(defaultCost);

export function useList(): Item[] | undefined {
    return useContext(MyListContext);
}

export function useListOperations() {
    return {
        addItem: useContext(AddItemContext),
        removeItem: useContext(RemoveItemContext),
        checkList: useContext(CheckListContext)
    };
}

export function useTotalCost(): Costs {
    return useContext(TotalCostContext);
}

export function useLastCost(): Costs {
    return useContext(LastCostContext);
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
    const [lastSavedCost, setLastSavedCost] = useState(0);
    const [lastItemCost, setLastItemCost] = useState(0);

    const lastCostUpdate = (savedCost: number, itemCost: number) => {
        setLastSavedCost(savedCost);
        setLastItemCost(itemCost);
    }

    const lastCost = (): Costs => {
        return ({
            savedCost: lastSavedCost, itemCost: lastItemCost
        });
    }

    const addItem = (itemToAdd: Item): void => {
        setMyList((prevList: Item[]) => [...prevList, itemToAdd]);
        lastCostUpdate(
            calcDrop(itemToAdd), Number(itemToAdd.newPrice)
        );
    }

    const removeItem = (itemLink: string): void => {
        setMyList((prevList: Item[]) => (
            prevList.filter((currItem: Item) => {
                if (currItem.link == itemLink) {
                    lastCostUpdate(
                        -1*calcDrop(currItem), -1*Number(currItem.newPrice)
                    );
                    return false;
                }
                return true;
        })));
    };

    const calcDrop = (item: Item): number => (
        Math.round(Number(item.oldPrice) - Number(item.newPrice))
    )

    const totalCost = (): Costs => {

        const totalSavingsCost = (): number => {
            return (myList.reduce(
                (acc: number, item: Item) => (
                    Math.round(acc + calcDrop(item))
                ), 0)
            );
        }
    
        const totalSpendingCost = (): number => {
            return (myList.reduce(
                (acc: number, item: Item) => (
                    Math.round(acc + Number(item.newPrice))
                ), 0)
            );
        }

        return {savedCost: totalSavingsCost(), itemCost: totalSpendingCost()}
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
            <TotalCostContext.Provider value={totalCost()}>
            <LastCostContext.Provider value={lastCost()}>
                {children}
            </LastCostContext.Provider>
            </TotalCostContext.Provider>
            </CheckListContext.Provider>
            </RemoveItemContext.Provider> 
            </AddItemContext.Provider> 
        </MyListContext.Provider>
    );
}