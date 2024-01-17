import '@/app/weaklyPrices/weaklyPrices.css'

export function Card({ title, catalogue, titleClasses, addValidDates }) {

    let validThruHTML = <div></div>;
    let titleCSS = '';

    if (addValidDates) {
        const validThru = getValidDates();
        validThruHTML = <p className='validDates'>{validThru} (Every <span className={''}>Monday</span>)</p>;
        titleCSS = 'title'
    }

    return (
        <div className={`card`}>

            {/* Headings */}
            <div className={titleCSS}>

                <h2 className={`${titleClasses}`}>
                    {title}
                </h2>

                {/* The className can be set to company color from the prop */}
                {validThruHTML}
            </div>

            {/* Item tables */}
            <div className="table">

                {/* Heading */}
                <div className='heading'>
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
                <div className='heading'>
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