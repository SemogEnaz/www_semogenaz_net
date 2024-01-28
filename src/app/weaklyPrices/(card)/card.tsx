import './card.css';
import './lds-ring.css';
import './lds-wave.css';
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

type BrandCardProps = {
    titleData: TitleData,
    linkData: LinkData,
    apiArg: string
}

export function BrandCard({ titleData, linkData, apiArg }: BrandCardProps) {
    
    // Get brandName instead of catalogue, await for fetch in table?

    const validThru = getValidDates();
    const validThruHTML = <p className='validDates'>{validThru} (Every <span className={''}>Monday</span>)</p>;

    return (
        <>
        <div className={`card`}>
            <Title title={titleData.titleContent} titleCSS={titleData.titleCss} validDates={validThruHTML}/>
            <Table apiArg={apiArg} />
            <Button setState={linkData.handleClick} content={linkData.linkContent}/>
        </div>
        </>
    );
}

export function DetailsCard({ title, apiArg, cardCSS }: { title: string, apiArg: string, cardCSS: string}) {

    return (
        <div className={`card ${cardCSS}`}>
            <Title title={title} titleCSS='text-5xl font-medium' validDates={null} />
            <Table apiArg={apiArg} />
        </div>
    );
}

const Title = ({ title, titleCSS, validDates }: 
    {title: string, titleCSS: string, validDates: null | JSX.Element}) => (

        <div className="title">
            <h2 className={titleCSS}>
                {title}
            </h2>
            {validDates}
        </div>
)

function Table({ apiArg }: { apiArg: string }) {

    const [catalogue, setCatalogue] = useState([]);
    const [isError, setError] = useState(false);

    useEffect(() => {

        fetch(`/api/weaklyPrices/${apiArg}`)
            .then(res => {
                if (!res.ok) res.json()
                    .then((data) => {
                        setError(true);
                        return {summary: []};
                    });
                else
                    return res.json();
            })
            .then(data => data.summary)
            .then(summary => setCatalogue(summary));

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

    const Loading = ({ message }: { message: string }) => {

        return (
            <div className="center">
                <div className='font-bold text-3xl drop-shadow-md'>{`${message}`}</div>
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
                <Loading message={isError ? `API Error` : `Retriving Data`} />
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