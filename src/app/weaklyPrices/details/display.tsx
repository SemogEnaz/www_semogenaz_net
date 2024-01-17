"use client"

import { HomeButton } from "@/ui/button";
import { ExpandableCard } from "@/app/weaklyPrices/card";

import '@/ui/arrow.css'
import '@/app/global.css';
import './details.css'

import { useState } from "react";

export default function Display({ catalogue }) {

    //const [visibleElements, setVisibleElements] = useState({});
    const [visibleElements, setVisibleElements] = useState(() => {
        let initialVisibility: any = {}

        for (let card of catalogue)
            if (card.items.length > 0)
                initialVisibility[card.id] = false;

        return initialVisibility;
    });

    let cardCSS = 'text-center text-6xl p-3';

    const toggleVisibility = (id: number) => {
        setVisibleElements(prevState => ({
            ...prevState, 
            [id]: !prevState[id]
        }));
    };

    const cards = catalogue.map(card => {

        const noItems = card.items.length == 0;
        const invisible = visibleElements[card.id] == false;

        if (noItems) return null;

        if (invisible)
            return (
                <div 
                key={card.id}
                className="relative col-center justify-center md:min-w-[600px] ml-1 mr-1"
                >
                    <ExpandableCard 
                    title={card.name} 
                    catalogue={card.items} 
                    animationCSS={'hide'}
                    />

                    <div className="cursor-pointer relative flex items-center">
                        <div 
                            className='expandable'
                            onClick={() => toggleVisibility(card.id)}
                        >
                        View {card.name}</div>

                        <div className="arrow down"></div>
                    </div>
                    
                </div>
            );

        return (
            <div
            key={card.id}
            className="col-center md:max-w-[600px] ml-1 mr-1"
            >
                <ExpandableCard 
                    title={card.name} 
                    catalogue={card.items}
                    animationCSS={'show'}
                />

                <div className="cursor-pointer relative flex items-center">
                    <div
                        className='expandable'
                        onClick={() => toggleVisibility(card.id)}
                    >View {card.name}</div>

                    <div className='arrow up'></div>
                </div>

            </div>
        );
    });

    // Main component
    return (
        <div className='col-center mb-10'>
            <HomeButton />
            <div className="card-display">
                {cards}
            </div>
        </div>
    );
}