import '@/app/weaklyPrices/weaklyPrices.css';

import { Poppins } from 'next/font/google';
import { Open_Sans } from 'next/font/google';

import { Card } from '@/app/weaklyPrices/card'
import { Button } from './button';
import CatalogueReader, { Item } from '@/app/weaklyPrices/catalogueReader';

export default function Page() {

    const colesCatalogue = getCuratedColes(2);
    const wooliesCatalogue = getCuratedWoolies(4);

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

    return (
        <div className='flex flex-col items-center bg-[#FFE99A] text-[#000080] h-[100%]'>

            <div className="page-title">
                <div>Weakly</div>
                <div>Prices</div>
            </div>

            <div className='card-display'>

                <Card 
                    titleData={{
                        titleContent: 'coles',
                        titleCss: `${poppins.className} ${colesColor} ${'brand'}`
                    }}
                    linkData={{
                        link: '/weaklyPrices/details/coles',
                        linkContent: 'Coles Catalogue'
                    }}
                    catalogue={colesCatalogue}/>

            
                <Card
                    titleData={{
                        titleContent: "Woolies",
                        titleCss: `${openSans.className} ${wooliesColor} ${'tracking-[-0.09em]'} ${'brand'}`
                    }}
                    linkData={{
                        link: '/weaklyPrices/details/woolies',
                        linkContent: 'Woolworths Catalogue'
                    }}
                    catalogue={wooliesCatalogue}/>
                
            </div>
        </div>
        
      );
      
}

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
});

const openSans = Open_Sans({
    weight: '300',
    subsets: ['latin'],
});

function getCuratedColes(itemsPerCatagory: number) {

    const catagories = [
        "Frozen",
        'Dairy, Eggs & Fridge',
        'Pantry',
        'Meat & Seafood',
    ];

    const dir = 'src/scripts/weaklyPrices/coles_catalogue/';

    return getCuratedCatalogue(catagories, dir, itemsPerCatagory);
}

function getCuratedWoolies(itemsPerCatagory: number) {

    const catagories = [
        'Half Price',
        'Prices Dropped',
    ];

    const dir = 'src/scripts/weaklyPrices/woolies_catalogue/'

    return getCuratedCatalogue(catagories, dir, itemsPerCatagory)
}

function getCuratedCatalogue(catagories: string[], dir: string, itemsPerCatagory: number) {
    
    let allItems: Item[] = [];

    const reader = new CatalogueReader();

    for (const catagory of catagories) {

        let items = reader.readCsv(dir, catagory);

        items = reader.getTopDrops(items, itemsPerCatagory);

        allItems.push(...items);
    }

    return allItems;
}