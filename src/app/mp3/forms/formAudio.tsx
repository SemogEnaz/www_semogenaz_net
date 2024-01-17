"useClient"

import { useEffect, useState } from 'react';

import { 
    formOptions, checkboxOptions,
    makeCheckboxsRaw, makeCheckboxes, makeDependingCheckboxes 
} from "./checkbox";

import { isBadUrl, FormArgs } from './form';

export default function AudioForm({ url, setLoading, setFileName, setTitle }: FormArgs) {

    const [audioOptions, setAudioOptions] = useState(() => {
        return ({
            'format': '',
            'thumbnail': '',
            'embed': '',
            'download': ''
        });
    });
    const states = {
        options: audioOptions,
        setOptions: setAudioOptions
    };

    const [hasFormat, setHasFormat] = useState(false);
    const [isSubmit, setSubmit] = useState(false);

    // Blocking the depending checkboxes & reseting
    // the blocked depending checkbox values
    useEffect(() => {
        const resetOption = (attribute: string) => {
            setAudioOptions(prev => ({
                ...prev,
                [attribute]: ''
            }));
        }
        setHasFormat(audioOptions['format'] != '');
        
        if (audioOptions['format'] == '') resetOption('embed');
    }, [audioOptions['format'], hasFormat]);

    // Submition effect, calling the backend to download content
    useEffect(() => {

        if (!isSubmit) return;

        if (isBadUrl(url)) {
            setTitle('Invalid url (-____- )')
            return;
        }

        const isFormat = audioOptions['format'] != '';
        const isEmbed = audioOptions['thumbnail'] == 'embed';
        //const isDownload = audioOptions['thumbnail'] == 'write';

        if (!isFormat && !isEmbed) {
            setTitle('Invalid options (0____0 )');
            return;
        }

        const getAudioParam = () => {
            const isAudio = '&isAudio=true';

            const paramStr = (attribute: string) => `${attribute}:${audioOptions[attribute]}`
            const format = paramStr('format');
            const embed = paramStr('embed');
            const download = paramStr('download');
    
            return isAudio + '&options=' + encodeURIComponent(`${format};${embed};${download}`);
        }

        let apiUrl = '/api/mp3/downloadVideo?';
        apiUrl += `url=${encodeURIComponent(url)}`;

        let apiParam = getAudioParam();
        apiUrl += apiParam;

        const fetchData = async () => {

            setLoading({
                isLoading: true,
                message: 'Downloading Video'
            });

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                setFileName(data.fileName);
            } catch (error) {
                console.error('Fetch error: ', error);
            }
        };
    
        fetchData();
        setSubmit(false);

    }, [isSubmit]);

    const format = makeCheckboxsRaw(
        ['.flac', '.mp3', '.wav', '.opus'],     // contents
        ['flac', 'mp3', 'wav', 'opus'],         // values
        'format');                              // attribute
    const formatComponent = makeCheckboxes(
        format, states);

    const embed = makeCheckboxsRaw(
        ['Embeded'],
        ['embed'],
        'embed');
    const embedComponent = makeDependingCheckboxes(
        embed, states, hasFormat);

    const download = makeCheckboxsRaw(
        ['Download'],
        ['write'],
        'download');
    const downloadComponent = makeCheckboxes(
        download, states);

    return (
        <>
            {formOptions(
                'File Formats:', checkboxOptions(formatComponent))}

            <div className="form-options">
                <div>Thumbnail:</div>
                <div className="checkbox-options">
                    {embedComponent}
                    {downloadComponent}
                </div>
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