"use client"

import { useEffect, useState } from "react";
import { 
    formOptions, checkboxOptions,
    makeCheckboxsRaw, makeCheckboxes, makeDependingCheckboxes 
} from "./checkbox";

import { FormArgs } from "./form";

export default function IGForm({ url, setLoading, setFileName, setTitle }: FormArgs) {
    
    const [isSubmit, setSubmit] = useState(false);
    const [source, setSource] = useState({
        'source': '',
        'downloadType': 'direct'
    });

    const states = {
        options: source,
        setOptions: setSource
    }
    
    useEffect(() => {

        if (isSubmit == false) return
        
        const apiURL = 
            `/api/mp3/getPost?url=${encodeURIComponent(url)}&downloadType=` + source.downloadType;

        fetch(apiURL)
            .then(res => res.json())
            .then(data => data.fileNames)
            .then((fileNames: string[]) => {
                fileNames.forEach(file => {
                    const a = document.createElement('a');
                    a.href = '/mp3/downloads/' + file;
                    a.download = file;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
                setSubmit(false);
            });
    }, [isSubmit, url])

    const content = makeCheckboxsRaw(
        ['Post'],
        ['post'],
        'source');
    const contnetComponent = makeCheckboxes(
        content, states);

    const downloadType = makeCheckboxsRaw(
        ['Direct', 'Zip'],
        ['direct', 'zip'],
        'downloadType');
    const downloadComponent = makeCheckboxes(
        downloadType, states
    );

    return (
        <>
        <div className="flex justify-center m-4">Please enter data from a public account...</div>
        <div className="one-line-options">
            {formOptions(
                'Content Types:', checkboxOptions(contnetComponent))}
            {formOptions(
                'Download Types:', checkboxOptions(downloadComponent))}
            </div>
        <div
            className='submition-button' 
            onClick={() => {
                setSubmit(true);
            }}>
            Download
        </div>
        </>
    );
}