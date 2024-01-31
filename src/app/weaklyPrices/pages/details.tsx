import styles from '../button.module.css'
import '../nav.css'

import { useEffect, useMemo, useState } from 'react';

import { DetailsCard } from '../card/card';
import Navigator, { CatagoryPanel, ItemCountPanel } from './nav/nav';
import { MyListProvider } from '../MyListContext';

export default function DetailsPage({ states }: { states: any }) {

    const { catalogueName, setCatalogueName } = states;
    const [catagories, setCatagories] = useState([]);

    // States for the Nav panel
    const [cardIndex, setIndex] = useState(6);
    const [itemCount, setItemCount] = useState('10');
    
    useEffect(() => {
        fetch(`/api/weaklyPrices/detailed?brand=${catalogueName}`)
            .then(res => res.json())
            .then(data => setCatagories(data.catagories))
    }, [catalogueName]);

    const toMain = () => {
        setCatalogueName('');
    }

    const DisplayOne = () => {
        const title = catagories [
            cardIndex > catagories.length ? 
            0 : cardIndex
        ];

        const apiArg =  `detailed?brand=${catalogueName}&` +
                        `category=${encodeURIComponent(title)}&` +
                        `count=${itemCount}`;

        const cardCSS = `details show`;

        return (
            <DetailsCard
                title={title} apiArg={apiArg} cardCSS={cardCSS}/>
        )
    };

    const categoryPanel = useMemo(() => {
        return <CatagoryPanel
            categories={catagories} setIndex={setIndex} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catagories])

    const itemPanel = 
        <ItemCountPanel
            itemCount={itemCount}
            setItemCount={setItemCount} />

    return (
        catagories.length == 0 ?
        <div className='text-2xl flex justify-center items-center text-justify'>
            Loading catagory names...
        </div>
        :
        <>
            <Button setState={toMain} content={'Back'}/>
            <div className="display-panel">
                <MyListProvider>
                    <>
                    <Navigator 
                        categoryPanel={categoryPanel} 
                        itemPanel={itemPanel} />
                    <DisplayOne />  
                    </>   
                </MyListProvider>       
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