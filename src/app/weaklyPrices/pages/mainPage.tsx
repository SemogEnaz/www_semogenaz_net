import { BrandCard } from '../card/card';

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

export default function MainPage({ setCatalogueName }: { setCatalogueName: (name: string) => void} ) {

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