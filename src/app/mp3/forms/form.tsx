"use client"

import { useEffect, useState } from "react";
import AudioForm from './formAudio';
import VideoForm from "./formVideo";
import LoadingForm from "./formLoading";

import './form.css'
import './checkbox.css'
import Image from 'next/image';

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

export default function SubmissionForm() {

    const [title, setTitle] = useState('');
    const [isAudio, setAudio] = useState(true);
    const [isRevealed, setRevealed] = useState(false);
    const [url, setUrl] = useState('');
    const [loadingData, setLoading] = useState(() => ({
        isLoading: false,
        message: ''
    }));
    const [fileName, setFileName] = useState('');

    useEffect(() => {

        if (isBadUrl(url)) {
            setTitle('');
            return;
        }

        fetch(`/api/mp3/getVideoTitle?url=${url}`)
            .then(response => {
                if (response.ok)
                    return response.json();
            }).then(data => {
                setTitle(data.title);
            })
            .catch(error => {
                console.error('error fetching data: ', error);
            })

        setRevealed(true);

    }, [url]);

    useEffect(() => {

        if (fileName == '' || title == '') return;

        const deleteContent = () => {
            fetch(`api/mp3/deleteVideo?fileName=${fileName}`);
        };
    
        const downloadContent = () => {

            const fileLink = `/mp3/downloads/${fileName}`;
        
            const a = document.createElement('a');
            a.href = fileLink;
            a.download = title + '.' + fileName.split('.').pop();
    
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

    const Title = ({ title }: {title: string}) => {

        if (title == '')
            return (
                <div className='form-title'></div>
            );
    
        return (
            <div className={`form-title ${isRevealed ? '' : 'show'}`}>
                {title}
            </div>
        );
    }

    const Form = () => {

        const placeholder = 'Paste url here...'; //'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        return (

            <div className="form">

                <Title title={title} />

                <div className="flex items-center bg-blue-900 rounded-md p-3 drop-shadow-2xl mb-[30px]">
                    <div className="text-xl text-white">url:</div>
                    <input
                        type="text"
                        value={url}
                        placeholder={placeholder}
                        onChange={(inputEvent) => {
                            setUrl(inputEvent.target.value);
                        }}
                        className="url-input drop-shadow-md" />
                </div>

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
                <AudioForm url={url} setLoading={setLoading} setFileName={setFileName} setTitle={setTitle} /> :
                <VideoForm url={url} setLoading={setLoading} setFileName={setFileName} setTitle={setTitle} />}

                <div className="flex justify-center mt-[150px] cursor-crosshair">
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