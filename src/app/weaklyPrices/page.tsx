"use client"

import '@/app/weaklyPrices/weaklyPrices.css';
import styles from './button.module.css'
import './nav.css'

import { Poppins } from 'next/font/google';
import { Open_Sans } from 'next/font/google';

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
});

const openSans = Open_Sans({
    weight: '300',
    subsets: ['latin'],
});

import { BrandCard, DetailsCard } from './card/card'
import { makeCheckboxsObj, makeCheckboxes, checkboxOptions } from './checkbox/checkbox';
import { useEffect, useMemo, useState } from 'react';
import MyListContext from './ListContext';
import Head from 'next/head';

export default function Page() {

    const [catalogueName, setCatalogueName] = useState('');
    const states = {
        catalogueName: catalogueName,
        setCatalogueName: setCatalogueName
    };

    return (
        <>
        {/* Add changing meta data later
            <Head>
                <title>Weakly Prices</title>
                <meta name="description" content="" />
                <meta name="keywords" content="keyword1, keyword2" />
            </Head>
        */}
        

        <div className='weaklyPrices-page'>

            <div className="page-title">
                <div>Weakly</div>
                <div>Prices</div>
            </div>

            <div className="card-display">
                {
                    catalogueName ? 
                    <DetailsPage states={states} /> :
                    <MainPage setCatalogueName={setCatalogueName} />
                }
                
            </div>
        </div>
        </>
    );
      
}

function MainPage({ setCatalogueName }: { setCatalogueName: (name: string) => void} ) {

    const colesColor = 'text-[#ed1c22]';
    const wooliesColor = 'text-[#60AB31]';
    // Another green is #099950

    /**
     * background colors:
     *  #FFFDD0 cream
     *  #FDFD96 pastal yellow
     *  #FFE99A Something else, more peach
     */

    /**
     * Text colors:
     * darkblue: #003366
     * navyblue: #000080
     */

    const moreColes = () => {
        setCatalogueName('coles');
    }

    const moreWoolworths = () => {
        setCatalogueName('woolworths');
    }

    return (
        <>
        <BrandCard 
            titleData={{
                titleContent: 'coles',
                titleCss: `${poppins.className} ${colesColor} ${'brand'}`
            }}
            linkData={{
                handleClick: moreColes,
                linkContent: 'Coles Catalogue'
            }}
            apiArg={'summary?brand=coles'}/>

    
        <BrandCard
            titleData={{
                titleContent: "Woolies",
                titleCss: `${openSans.className} ${wooliesColor} ${'tracking-[-0.09em]'} ${'brand'}`
            }}
            linkData={{
                handleClick: moreWoolworths,
                linkContent: 'Woolworths Catalogue'
            }}
            apiArg={`summary?brand=woolworths`}/>
        </>
      );
}

function DetailsPage({ states }: { states: any }) {

    const { catalogueName, setCatalogueName } = states;
    const [catagories, setCatagories] = useState([]);
    const [myList, setMyList] = useState<any[]>([]);

    // States for the Nav panel
    const [cardIndex, setIndex] = useState(6);  // Move this down with the DisplayOne component?
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

    const DisplayAll = () => (

        /* Rendering all the cards */
        <div className="details-cards">
            {catagories.map((catagory, index) => (
                <DetailsCard
                    key={index}
                    title={`${catagory}`}
                    apiArg={`detailed?brand=${catalogueName}&category=${encodeURIComponent(catagory)}`}
                    cardCSS={`details ${index == cardIndex ? 'show' : ''}`} />
            ))}
        </div>
    );

    const Selector = ({category, index}: { category: string, index: number }): JSX.Element => (
        <div className="catagory" onClick={() => setIndex(index)}>
            {category}
        </div>
    )

    const CatagoryPanel = () => (
        <div className='nav-col'>
            <div className="catagory-title">Catagories</div>
            <div className="catagory-panel">
                {catagories.map((category, index) => (
                    <Selector
                        key={index}
                        category={category}
                        index={index} />
                ))}
            </div>
        </div>
    );

    const ItemCountPanel = () => {
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

    const ScrollSave = useMemo(() => {
        return <CatagoryPanel />;
    }, [catagories]);

    return (
        catagories.length == 0 ?
        <div className='text-2xl flex justify-center items-center text-justify'>
            Loading catagory names...
        </div>
        :
        <>
            <Button setState={toMain} content={'Back'}/>
            <div className="display-panel">
                <div className="nav-panel">
                    {ScrollSave}
                    <div className="nav-col">
                        <ItemCountPanel />
                    </div>
                </div>
                <MyListContext.Provider value={{ myList, setMyList }}>
                    <DisplayOne />
                </MyListContext.Provider>
                
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