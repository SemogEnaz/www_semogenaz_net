"use client"

import '@/app/weaklyPrices/weaklyPrices.css';
import styles from './button.module.css'

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

import { BrandCard, DetailsCard } from './(card)/card'
import { useEffect, useState } from 'react';
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
    const [cardIndex, setIndex] = useState(6);  // Move this down with the DisplayOne component
    
    useEffect(() => {
        fetch(`/api/weaklyPrices/detailed?brand=${catalogueName}`)
            .then(res => res.json())
            .then(data => setCatagories(data.catagories))
    }, [catalogueName]);

    const toMain = () => {
        setCatalogueName('');
    }

    if (catagories.length == 0) return <div>Loading catagory names...</div>;

    const DisplayOne = () => {
        const title = catagories[cardIndex];
        const apiArg = `detailed?brand=${catalogueName}&category=${encodeURIComponent(title)}`;
        const cardCSS = `details show`;

        return <DetailsCard title={title} apiArg={apiArg} cardCSS={cardCSS}/>
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

    const Navigator = () => {

        const Selector = ({category, index}: { category: string, index: number }): JSX.Element => (
            <div className="catagory" onClick={() => setIndex(index)}>
                {category}
            </div>
        )

        const CatagoryPanel = () => (
            <div className='flex flex-col'>
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
            return <div>Item Count</div>
        }

        const SelectedItems = () => {
            return <div>Selected Items</div>
        }

        const OtherSettings = () => {
            <div className="flex flex-col ml-[8px]">
                <ItemCountPanel />
                <SelectedItems />
            </div>
        }

        return (
            <div className="nav-panel">
                <CatagoryPanel />
                {/*<OtherSettings />*/}
            </div>
        );
    };

    return (
        <>
            <Button setState={toMain} content={'Back'}/>
            <div className="display-panel">
                <Navigator />
                <DisplayOne />
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