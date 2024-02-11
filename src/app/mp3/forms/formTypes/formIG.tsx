"use client"

import { useEffect, useState } from "react";
import { 
    formOptions, checkboxOptions,
    makeCheckboxsRaw, makeCheckboxes, makeDependingCheckboxes 
} from "../formElements/checkbox";
import { useTitle, useUrl } from "../contexts/FormContext";

export default function IGForm({ setLoading, setFileName }) {
    
    const { url, isSafeUrl } = useUrl()!;
    const { setTitle } = useTitle()!;
    const [source, setSource] = useState({
        'source': '',
        'downloadType': 'direct'
    });

    const states = {
        options: source,
        setOptions: setSource
    }
    
    const submit = () => {
        
        if (!isSafeUrl(url)) {
            setTitle('Invalid url');
            return;
        }

        const apiURL = 
            `/api/mp3/getPost?url=${encodeURIComponent(url)}&downloadType=` + source.downloadType;

        setLoading({
            isLoading: true,
            message: 'Downloading Post'
        });

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
                setLoading({
                    isLoading: false,
                    message: ''
                });
            });
    };

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
            onClick={submit}>
            Download
        </div>
        </>
    );
}