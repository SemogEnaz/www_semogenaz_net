import styles from '../button.module.css'
import './nav/nav.css'

import { useContext, useEffect, useMemo, useState } from 'react';

import { DetailsCard, MyList } from '../card/card';
import Navigator, { CatagoryPanel } from './nav/nav';

import { ListProvider } from '../ListContext';
import { CategoryIndexProvider, PagerProvider, ViewListProvider, useCategoryIndex, usePagerContext, useViewList } from './NavContext';

export default function DetailsPage({ states }: { states: any }) {

    const { catalogueName, setCatalogueName } = states;
    const [categories, setCatagories] = useState([]);

    // States for the Nav panel
    /*
    const [cardIndex, setIndex] = useState(6);
    const [itemCount, setItemCount] = useState('10');
    const [pageCount, setPageCount] = useState('1');
    */
    const isPage = true;
    const { state: isMyList } = useViewList();

    useEffect(() => {
        fetch(`/api/weaklyPrices/detailed?brand=${catalogueName}`)
            .then(res => res.json())
            .then(data => setCatagories(data.catagories))
    }, [catalogueName]);

    const toMain = () => {
        setCatalogueName('');
    }

    const DisplayCategory = () => {
        const { state: isMyList } = useViewList();
        const { state: cardIndex } = useCategoryIndex();
        const { itemCount: { state: itemCount }} = usePagerContext();
        const { pageCount: { state: pageCount }} = usePagerContext();

        if (isMyList) return null;

        const title = categories [
            cardIndex > categories.length ? 
            0 : cardIndex
        ];

        let apiArg =  
            `detailed?brand=${catalogueName}&` +
            `category=${encodeURIComponent(title)}&`;

        apiArg += isPage ? `pageCount=${pageCount}` : `itemCount=${itemCount}`;

        const cardCSS = `details show`;

        return (
            <DetailsCard
                title={title} apiArg={apiArg} cardCSS={cardCSS}/>
        )
    };

    const categoryPanel = useMemo(() => {
        return  <CatagoryPanel categories={categories}/>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    return (
        categories.length == 0 ?
        <div className='text-2xl flex justify-center items-center text-justify'>
            Loading catagory names...
        </div>
        :
        <>
            <Button setState={toMain} content={'Back'}/>
            <div className="display-panel">
                <ListProvider>
                <PagerProvider>
                <CategoryIndexProvider>
                <ViewListProvider>
                    <>
                    <Navigator>
                        {categoryPanel}
                    </Navigator>

                    <MyList />
                    <DisplayCategory />
                    </>   
                </ViewListProvider>
                </CategoryIndexProvider>
                </PagerProvider>
                </ListProvider>       
            </div>
        </>
        
    );
}

export function Button({ setState, content }: { setState: () => void, content: string}) {
    return (
        <div 
            onClick={setState}
            className={styles.button}>
          {content}
        </div>
    )
}