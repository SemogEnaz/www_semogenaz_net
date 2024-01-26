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

import { Card } from '@/app/weaklyPrices/card'
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
                    catalogueName == '' ? 
                    <MainPage setCatalogueName={setCatalogueName} /> :

                    catalogueName == 'coles' ?
                    <DetailsPage states={states} /> :
                    <DetailsPage states={states} />
                }
                
            </div>
        </div>
        </>
    );
      
}

function MainPage({ setCatalogueName }: { setCatalogueName: (name: string) => void} ) {

    const [summaries, setSummaries] = useState({});
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {

        const getSummaries = async () => {
            const response = await fetch('/api/weaklyPrices/summary');
            const data = await response.json();
            setSummaries(data.summaries);
            setLoading(false);
        }

        getSummaries();
    }, []);

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

    if (isLoading) return <LoadingPage />;

    return (
        <>
        <Card 
            titleData={{
                titleContent: 'coles',
                titleCss: `${poppins.className} ${colesColor} ${'brand'}`
            }}
            linkData={{
                handleClick: moreColes,
                linkContent: 'Coles Catalogue'
            }}
            catalogue={summaries.coles}/>

    
        <Card
            titleData={{
                titleContent: "Woolies",
                titleCss: `${openSans.className} ${wooliesColor} ${'tracking-[-0.09em]'} ${'brand'}`
            }}
            linkData={{
                handleClick: moreWoolworths,
                linkContent: 'Woolworths Catalogue'
            }}
            catalogue={summaries.woolworths}/>
        </>
      );
}

function DetailsPage({ states }: { states: any }) {

    const [isLoading, setLoading] = useState(true);
    const [catalogue, setCatalogue] = useState([]);
    const { catalogueName, setCatalogueName } = states;

    useEffect(() => {

        const getCatalogue = async () => {
            const response = await fetch(`/api/weaklyPrices/catalogue?brand=${catalogueName}`);
            const data = await response.json();
            setCatalogue(data.catalogue);
            setLoading(false);
        }

        getCatalogue();
    }, [catalogueName])

    const toMain = () => {
        setCatalogueName('');
    }

    if (isLoading) return <LoadingPage />;

    return (
        <div>
            <Button setState={toMain} content={'Back'}/>
            <Card
                titleData={{
                    titleContent: '',
                    titleCss: ''
                }}
                linkData={{
                    handleClick: toMain,
                    linkContent: 'Back'
                }}
                catalogue={catalogue[0].items}/>
        </div>
    );
}

function LoadingPage() {
    return <div className="">Loading</div>
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