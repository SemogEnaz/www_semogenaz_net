import { Dispatch, SetStateAction, createContext, useContext, useState } from "react"

// Attributes for audio options
export enum AudioAttrubutes {
    FORMAT = 'format',
    EMBED = 'embed',
    DOWNL = 'download'
}

enum FormatOptions {
    FLAC = 'flac',
    MP3 = 'mp3',
    WAV = 'wav',
    OPUS = 'opus'
}

enum ThumbnailOptions {
    EMBED = 'embed',
    WRITE = 'write'
}

// Type defination for the auido options state
type AudioOptions = {
    [AudioAttrubutes.FORMAT]:   FormatOptions | '',
    [AudioAttrubutes.EMBED]:    ThumbnailOptions.EMBED | '',
    [AudioAttrubutes.DOWNL]:    ThumbnailOptions.WRITE | ''
};

const AudioContext = createContext<{
    // If context is provider, returns object with useState returns, else undefined
    audioOptions: AudioOptions, // type defination for audio options state
    // The Setter for autio options, expects AuioOptions type as parameter
    setAudioOptions: Dispatch<SetStateAction<AudioOptions>>} 
    | undefined>(undefined) // undefined for default initial state
const AudioValid = createContext<() => boolean>(() => false);

export const useValidOptions = () => (
    useContext(AudioValid)
)

// Returns state for options and it's setter
export const useAudioState = (): {
    audioOptions: AudioOptions, 
    setAudioOptions: Dispatch<SetStateAction<AudioOptions>>} => {

    const audioContext = useContext(AudioContext);

    // if no provider as patent, context will be undefined
    if (!audioContext)
        throw new Error("hook used outside provider");

    // getting state and dispatch for context
    const { audioOptions, setAudioOptions } = audioContext;

    // State and setter
    return {
        audioOptions: audioOptions,
        setAudioOptions: setAudioOptions
    }
};

export const useAudioOptionValues = (): {
    formatVals: FormatOptions[],
    embedVals: ThumbnailOptions[],
    downloadVals: ThumbnailOptions[] } => {

    const formatValues = Object.values(FormatOptions);
    const [ embedValue, thumbnailValue ] = Object.values(ThumbnailOptions);

    return {
        formatVals: formatValues, 
        embedVals: [embedValue], 
        downloadVals: [thumbnailValue]
    };
}

export const useAudioAttributes = (): {
    formatAttr: AudioAttrubutes,
    embedAttr: AudioAttrubutes,
    downloadAttr: AudioAttrubutes } => {

    const [formatAttr, embedAttr, downloadAttr] = Object.values(AudioAttrubutes);
    return {
        formatAttr: formatAttr,
        embedAttr: embedAttr,
        downloadAttr: downloadAttr
    };
}

// This is the component to wrap the part of the ReactDOM tree we want to have the AudioContext
export default function AudioProvider({ children }: { children: JSX.Element }) {

    const initilizeOptions = () => (
        // Make attributes to object keys
        Object.values(AudioAttrubutes).reduce(
            (acc: AudioOptions, value: AudioAttrubutes) => {
                acc[value] = "";    // new attribute make and initilized to ''
                return acc;         // return the object with new attribute
            }, {} as AudioOptions   // initial value empty object
        )
    );

    const [audioOptions, setAudioOptions] = useState<AudioOptions>(initilizeOptions);

    const isValidOptions = (): boolean => {
        const isFormat = audioOptions.format != '';
        const isDownload = audioOptions.download == ThumbnailOptions.WRITE;

        // reset embed if user wants to download thumbnail only
        if (!isFormat) audioOptions.embed = '';

        // allow user to download thumbnail only
        return (isFormat || isDownload) ? true : false;
    }

    return (
        <AudioContext.Provider value={{ audioOptions, setAudioOptions }}>
            <AudioValid.Provider value={ isValidOptions }>
                { children }
            </AudioValid.Provider>
        </AudioContext.Provider>
    );
}