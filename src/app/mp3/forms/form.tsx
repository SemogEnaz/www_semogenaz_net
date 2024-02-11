"use client"

import { useEffect, useState } from "react";

// subforms
import YtForm from "./formTypes/yt/formYt";
import IGForm from "./formTypes/formIG";
import LoadingForm from "./formTypes/formLoading";

// elements
import './form.css';
import './formElements/checkbox.css';
import UrlInput from "./formElements/urlInput";

import { MediaProvider, SourceUrlProvider, TitleProvider, useSource } from "./contexts/FormContext";

export const apiUrl = (genUrlOpt: () => string, url: string): string => {
    const api = '/api/mp3/downloadVideo';
    const urlQuery = `?url=${encodeURIComponent(url)}`;
    const optionsQuery = genUrlOpt();

    return api + urlQuery + optionsQuery;
}

export default function SubmissionForm() {

    const [loadingData, setLoading] = useState(() => ({
        isLoading: false,
        message: ''
    }));
    const [fileNames, setFileNames] = useState<string[]>([]);

    useEffect(() => {

        if (fileNames.length == 0) return;

        const deleteContent = (fileName: string) => {
            fetch(`api/mp3/deleteVideo?fileName=${fileName}`);
        };
        
        fileNames.forEach((fileName: string) => {
            const a = document.createElement('a');
            a.href = `/mp3/downloads/${fileName}`;
            a.download = "download" + '.' + fileName.split('.').pop();

            document.body.appendChild(a);
            a.click();
            a.remove();
        
            setTimeout(() => {
                deleteContent(fileName);
            }, 10 * 60000);
        });

        setFileNames([]);

    }, [fileNames]);

    const Form = () => {
        const { isYt } = useSource()!;

        return (
            <div className="form">

                <UrlInput />

                {isYt ?

                    <MediaProvider>
                        <YtForm setLoading={setLoading} setFileNames={setFileNames} /> 
                    </MediaProvider> :

                    <IGForm setLoading={setLoading} setFileNames={setFileNames} />}
                
                {/* Easter egg to be reinstated once online store mock is made :(
                <div className="absolute left-1/2 transform -translate-x-1/2 top-[1000px] cursor-not-allowed">
                    <Image
                        src="https://jipel.law.nyu.edu/wp-content/uploads/2023/03/image-768x386.png"
                        alt="YOU WOULDN'T DOWNLOAD A CAR!!!"
                        width={400}
                        height={200} />
                </div>
                */}
                
            </div>
        );
    };

    return  (
        loadingData.isLoading ?

        <LoadingForm message={loadingData.message} /> :

        <SourceUrlProvider>
            <TitleProvider>
                <Form />
            </TitleProvider>
        </SourceUrlProvider>
    );
}