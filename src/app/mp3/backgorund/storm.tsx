"use client"

import './storm.css'

import Image from 'next/image';

export default function Storm({ isRain, isThunder }) {

    const LightningImg = ({ link, className }) => {
        return (
            <div className={`lightning-strike ${className}`}>
                <Image 
                    src={link}
                    alt="lightning"
                    width={400}
                    height={160}
                    style={{
                        width: 'auto',
                        height: '100%',
                    }}
                />
            </div>
            
        );
    }

    const Thunder = () => {

        const assetsPath = '/mp3/assets/';

        return (
            <div className='storm'>
                <LightningImg 
                    link={`${assetsPath}lightning-strike-r.svg`}
                    className='right'/>
                <LightningImg 
                    link={`${assetsPath}lightning-strike-m.svg`}
                    className='middle'/>
                <LightningImg 
                    link={`${assetsPath}lightning-strike-l.svg`}
                    className='left'/>
            </div>
        );
    }
    
    const Rain = () => {
    
        const numberOfDrops = 100;
        const rainDrops = [];
    
        for (let i = 0; i < numberOfDrops; i++) {
            const delay = Math.random() * 2; // Random delay between 0 and 2 seconds
            const duration = 2.5 + Math.random(); // Duration between 0.5 and 1.5 seconds
            const leftPosition = Math.random() * 100; // Random position from 0% to 100%
    
            rainDrops.push(
                <div 
                    className="rain-drop" 
                    key={i} 
                    style={{ 
                        animationDelay: `${delay}s`, 
                        animationDuration: `${duration}s`, 
                        left: `${leftPosition}%`
                    }}
                />
            );
        }
    
        return <div className='rain'>{rainDrops}</div>;
    }

    let rainComponent = null;
    let thunderComponent = null;

    if (isRain)
        rainComponent = <Rain />

    if (isThunder)
        thunderComponent = <Thunder />


    return (
        <div className={`${isThunder ? 'storm' : 'sky'}`}>

            {thunderComponent}

            {rainComponent}

        </div>
    );
}