import '@/app/weaklyPrices/weaklyPrices.css';

import { Poppins } from 'next/font/google';
import { Open_Sans } from 'next/font/google';

import { Card } from '@/app/weaklyPrices/card'
import { Button, TopButton } from '@/ui/button';
import CatalogueReader, { Item } from '@/app/weaklyPrices/catalogueReader';

export default function Page() {

    const colesCatalogue = getCuratedColes(2);
    const wooliesCatalogue = getCuratedWoolies(4);

    const colesColor = 'text-[#ed1c22]';
    const wooliesColor = 'text-[#60AB31]';
    // Another green is #099950

    return (
        <div className='col-center'>

            <TopButton link={"/"} text={'Home'}/>

            <div className='cardDisplay'>

                <div className='col-center'>
                    <Card 
                        title={"coles"} 
                        catalogue={colesCatalogue}
                        titleClasses={`
                            ${poppins.className} 
                            ${colesColor}
                            ${'brand'}
                        `}
                        addValidDates={true}
                    />
                    <Button link={'/weaklyPrices/details/coles'} text={'View More'}/>
                </div>

                <div className='col-center'>
                    <Card
                        title={"Woolies"}
                        catalogue={wooliesCatalogue}
                        titleClasses={`
                            ${openSans.className}
                            ${wooliesColor}
                            ${'tracking-[-0.09em]'}
                            ${'brand'}
                        `}
                        addValidDates={true}
                    />
                    <Button link={'/weaklyPrices/details/woolies'} text={'View More'}/>
                </div>
                
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