"use client"

import { useEffect, useState } from "react";
import UrlInput from "./formElements/urlInput";
import AudioForm from './formTypes/yt/formAudio';
import VideoForm from "./formTypes/yt/formVideo";
import LoadingForm from "./formTypes/formLoading";

import './form.css';
import './formElements/checkbox.css';
import Image from 'next/image';
import IGForm from "./formTypes/formIG";
import AudioProvider from "./contexts/AudioContext";

export type FormArgs = {
    url: string, 
    setLoading: (options: any) => (void), 
    setFileName: (option: string) => (void), 
    setTitle: (option: string) => (void)
}

export function isBadUrl(url: string): boolean {

    const isYtVideo = (url: string) => {
        const urlStartDesktop = 'https://www.youtube.com/watch?v=';
        const urlStartMoble = 'https://youtu.be/'
        const isDomain = url.includes(urlStartDesktop) || url.includes(urlStartMoble);

        const videoId = url.split('=').pop()!;
        const isIdLen = videoId.length == 11;
        const isIdLenMobile = videoId.length == 16;

        return isDomain && (isIdLen || isIdLenMobile);
    }

    const isYtPlaylist = (url: string) => {
        const urlStart = 'https://youtube.com/playlist?list=';
        const urlStartwww = 'https://www.youtube.com/playlist?list=';
        return url.includes(urlStart) || url.includes(urlStartwww);
    }

    // Currently, playlists are not supported.
    const isYtUrl = (url: string) => {
        return isYtVideo(url) && !isYtPlaylist(url);
    }

    const clean = (url: string) => {
        return !url.includes(';') && !url.includes(' ') && !url.includes(';');
    }

    return !isYtUrl(url) || !clean(url);
}

export const apiUrl = (genUrlOpt: () => string, url: string): string => {
    const api = '/api/mp3/downloadVideo';
    const urlQuery = `?url=${encodeURIComponent(url)}`;
    const optionsQuery = genUrlOpt();

    return api + urlQuery + optionsQuery;
}

export default function SubmissionForm() {

    const [title, setTitle] = useState('');
    const [isAudio, setAudio] = useState(true);
    const [isYt, setIsYt] = useState(true);
    const [url, setUrl] = useState('');
    const [loadingData, setLoading] = useState(() => ({
        isLoading: false,
        message: ''
    }));
    const [fileName, setFileName] = useState('');

    useEffect(() => {

        if (fileName == '') return;

        const deleteContent = () => {
            fetch(`api/mp3/deleteVideo?fileName=${fileName}`);
        };
    
        const downloadContent = () => {

            const fileLink = `/mp3/downloads/${fileName}`;
        
            const a = document.createElement('a');
            a.href = fileLink;
            a.download = "download" + '.' + fileName.split('.').pop();
    
            document.body.appendChild(a);
            a.click();
            a.remove();
        
            setTimeout(() => {
                deleteContent();
            }, 10 * 60000);
        };

        downloadContent();

        setLoading({
            isLoading: false,
            message: ''
        });

        setFileName('');

    }, [fileName, title]);

    // Needed for giving error messages to the user
    const Title = ({ title }: {title: string}) => (

        title == '' ?
        <div className='form-title'></div> :
        <div className={`form-title show`}>
            {title}
        </div>
)

    const Form = () => {

        return (

            <div className="form">

                <Title title={title} />

                <UrlInput isYt={isYt} url={url} setUrl={setUrl} setIsYt={setIsYt}/>

                {isYt ?
                <>
                <div className="content-types">

                    <div 
                        className={`content-type-button ${isAudio ? 'show-button' : ''}`}
                        onClick={() => {
                            setAudio(true);
                        }}>Audio</div>

                    <div
                        className={`content-type-button ${isAudio ? '' : 'show-button'}`}
                        onClick={() => {
                            setAudio(false);
                        }}>Video</div>

                </div>

                {isAudio ? 
                <AudioProvider>
                    <AudioForm url={url} setLoading={setLoading} setFileName={setFileName} setTitle={setTitle} />
                </AudioProvider>
                :
                <VideoForm url={url} setLoading={setLoading} setFileName={setFileName} setTitle={setTitle} />}
                </> :
                <IGForm url={url} setLoading={setLoading} setFileName={setFileName} setTitle={setTitle} />}
                
                <div className="absolute left-1/2 transform -translate-x-1/2 top-[1000px] cursor-not-allowed">
                    <Image
                        src="https://jipel.law.nyu.edu/wp-content/uploads/2023/03/image-768x386.png"
                        alt="YOU WOULDN'T DOWNLOAD A CAR!!!"
                        width={400}
                        height={200} />
                </div>
            </div>
        );
    };

    if (loadingData.isLoading)
        return <LoadingForm message={loadingData.message}/>

    return  <Form /> ;
}