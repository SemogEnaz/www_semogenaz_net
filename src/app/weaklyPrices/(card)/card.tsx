import './card.css';
import styles from '../button.module.css';

import { useState, useEffect } from 'react';

type TitleData = {
    titleContent: string,
    titleCss: string
};

type LinkData = {
    handleClick: () => void,
    linkContent: string
}

type CardProps = {
    titleData: TitleData,
    linkData: LinkData,
    apiArg: string
}

export function BrandCard({ titleData, linkData, apiArg }: CardProps) {
    
    // Get brandName instead of catalogue, await for fetch in table?

    return (
        <>
        <div className={`card`}>
            <BrandTitle title={titleData.titleContent} titleCss={titleData.titleCss} />
            <Table apiArg={apiArg} />
            <Button setState={linkData.handleClick} content={linkData.linkContent}/>
        </div>
        </>
    );
}

export function ExpandableCard({ title, catalogue, animationCSS }) {

    return (
        <div className={`expandable-card ${animationCSS}`}>

            <BrandTitle title={title} titleCss='text-7xl font-medium' />
            <Table catalogue={catalogue} />

        </div>
    );
}

function BrandTitle({ title, titleCss }: { title: string, titleCss: string }) {

    const validThru = getValidDates();
    const validThruHTML = <p className='validDates'>{validThru} (Every <span className={''}>Monday</span>)</p>;

    return (
        <div className='title'>

            <h2 className={`${titleCss}`}>
                {title}
            </h2>

            {/* The className can be set to company color from the prop */}
            {validThruHTML}

        </div>
    );
}

function Table({ apiArg }: { apiArg: string }) {

    const [catalogue, setCatalogue] = useState([]);

    useEffect(() => {

        fetch(`/api/weaklyPrices/${apiArg}`)
            .then(res => res.json())
            .then(data => data.catalogue)
            .then(catalogue => setCatalogue(catalogue));

    }, [apiArg]);

    const Heading = () => (
        <div className='w-heading'>
            <p className='name'>Items</p>
            <p className='price'>Prices</p>
        </div>
    );

    const Items = ({ catalogue }: any) => (
        catalogue.map((
            item: {
                link: string, name: string, oldPrice: string, newPrice: string
            }, 
            index: number) => (

        <div key={index} className='item'>

            <a href={item.link} target={'_blank'} className={`
                name p-2
                border-r-4 border-r-[#000080]`}>
                {item.name}
            </a>

            <div className='price'>
                <div className="
                    text-gray-500 font-semibold w-1/2 text-right
                ">${item.oldPrice}</div>
                &nbsp;
                <div className="w-1/2 text-left">${item.newPrice}</div>     
            </div>

        </div>
        ))
    );

    const Loading = () => {

        return (
            <div className="center">
                <div className='font-bold text-3xl'>Retriving Data</div>
            </div>
        );
        
        /*
        return (
            <div className="center">
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        );
        */
    }

    const mockItems = [
        ['This is a mock item index 100', '12', '34'],
        ['Needed for the loading screen of my app', '45', '56.7'],
        ['Just figured out height animation', '78', '89'],
        ['What a pain in the ass XD', '14.4', '4']
    ]

    const makeMockObjs = (mockItems: string[][]) => {
        let objArr = [];
        for (let i = 0; i < mockItems.length; i++) {
            const attrs = mockItems[i];

            objArr.push({
                link: '', 
                name: attrs[0], 
                oldPrice: attrs[1],
                newPrice: attrs[2]
            });
        }
        return objArr;
    }

    return (
        catalogue != undefined && catalogue.length > 0 ?
        <div className='card-content end-height'>
            <Heading />
            <Items catalogue={catalogue} />
        </div> :

        <div className='card-content skeleton'>
            <div className="wave-container">
                <Heading />
                <Items catalogue={makeMockObjs(mockItems)} />
                <Loading />
            </div>
        </div>
    );
}

function Button({ setState, content }: { setState: () => void, content: string}) {
    return (
        <div 
            onClick={setState}
            className={styles.button}>
          {content}
        </div>
    )
}

function getValidDates(): string {

    const currentDate = new Date();

    let priorDate = new Date();
    let henceDate = new Date();

    let dayCount = 0

    while (priorDate.getDay() != 1) {
        priorDate.setDate(currentDate.getDate() + dayCount);
        dayCount--;
    }

    dayCount = 0;

    while (henceDate.getDay() != 1) {
        henceDate.setDate(currentDate.getDate() + dayCount);
        dayCount++;
    }

    const priorDay = getDateStr(priorDate);
    const henceDay = getDateStr(henceDate);

    return priorDay + ' to ' + henceDay;
}

function getDateStr(dateObj: Date): string {
    return `${dateObj.getDate()}/${dateObj.getMonth()+1}`;
}