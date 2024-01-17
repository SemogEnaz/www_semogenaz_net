"use client"

import './waves.css';

import Image from 'next/image';

export default function Waves({ body }) {

    const assetsPath = '/mp3/assets/';

    const Wave = () => {
        return (
            <Image 
                src={`${assetsPath}wave2.svg`}
                alt="wave"
                width={400}
                height={160}
                style={{
                    width: '1920px',
                    height: 'auto',
                }}/>
        );
    }

    const Boat = () => {
        return (
            <Image 
                src={`${assetsPath}boat.svg`}
                alt="wave"
                width={400}
                height={160}
                style={{
                    width: '200px',
                    height: 'auto',
                }}
            />
        );
    }

    return (
        <>
        <div className='wave-container'>

            <div className='boat-container'>
                <Boat /></div>
            <div className='wave ahead'>
                <Wave /></div>
            <div className='wave behind'>
                <Wave /></div>
 
        </div>

        <div className='ocean'>
            {body}
        </div>
        </>
    );
}