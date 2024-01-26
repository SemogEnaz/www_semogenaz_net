import './card.css';
import styles from './button.module.css';

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
    catalogue: any
}

export function Card({ titleData, linkData, catalogue }: CardProps) {
    
    return (

        <>
        <div className={`card`}>

            <BrandTitle title={titleData.titleContent} titleCss={titleData.titleCss} />
            <Table catalogue={catalogue} />
            <Button setState={linkData.handleClick} content={linkData.linkContent}/>

        </div>
        </>
        
    );
}

export function ExpandableCard({ title, catalogue, animationCSS }) {

    return (
        <div className={`expandable-card ${animationCSS}`}>

            {/* Headings */}
            <div>

                <h2 className={'text-center text-6xl p-3'}>
                    {title}
                </h2>

            </div>

            {/* Item tables */}
            <div className="table">

                {/* Heading */}
                <div className='w-heading'>
                    <p className='name'>Items</p>
                    <p className='price'>Prices</p>
                </div>

                {catalogue.map((item, index) => (
                    <div key={index} className='flex'>

                        <div className='name'>
                            <a href={item.link}>
                            {item.name}
                            </a>
                        </div>

                        <div className='price'>
                                <p className='text-gray-400'>${item.oldPrice}</p> 
                                &nbsp;${item.newPrice}
                        </div>

                    </div>
                ))}
            </div>
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

function Table({ catalogue }) {

    return (
        <div className="table">

            {/* Heading */}
            <div className='w-heading'>
                <p className='name'>Items</p>
                <p className='price'>Prices</p>
            </div>

            {/* Items list */}
            {catalogue.map((
                item: {
                    link: string, name: string, oldPrice: string, newPrice: string
                }, 
                index: number) => (

            <div key={index} className='item'>

                <a href={item.link} className={`
                    name p-2
                    border-r-4 border-r-[#000080]`}>
                    {item.name}
                </a>

                <div className='price'>
                    <div className="
                        text-gray-500 font-medium w-1/2 text-right
                    ">${item.oldPrice}</div>
                    &nbsp;
                    <div className="w-1/2 text-left">${item.newPrice}</div>     
                </div>

            </div>
            ))}

        </div>
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