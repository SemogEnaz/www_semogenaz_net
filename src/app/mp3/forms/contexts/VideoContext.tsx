import { Dispatch, SetStateAction, createContext, useState, useContext } from 'react';

export enum VideoAttributes {
    FORMAT = 'format',
    SUB = 'subtitles',
    CHAP = 'chapters',
    SPON = 'sponsor'
}

enum FormatOptions {
    MKV = 'mkv',
    MP4 = 'mp4'
}

type EMBED = 'embed';

enum SponsorOptions {
    MARK = 'mark',
    REM = 'remove'
}

type VideoOptions = {
    [VideoAttributes.FORMAT]:   FormatOptions | '',
    [VideoAttributes.SUB]:      EMBED | '',
    [VideoAttributes.CHAP]:     EMBED | '',
    [VideoAttributes.SPON]:     SponsorOptions | ''    
} 

const VideoContext = createContext
    <{videoOptions: VideoOptions, 
    setVideoOptions: Dispatch<SetStateAction<VideoOptions>>} | 
    undefined>(undefined);
const VideoValid = createContext<() => boolean>(() => false);

export const useValidOptions = () => (
    useContext(VideoValid)
);

export const useVideoState = (): {
    videoOptions: VideoOptions,
    setVideoOptions: Dispatch<SetStateAction<VideoOptions>> } => {
    
    const videoContext = useContext(VideoContext);

    if (!videoContext)
        throw new Error('Video Options hook used outside context');

    const { videoOptions, setVideoOptions } = videoContext;

    return {
        videoOptions: videoOptions,
        setVideoOptions: setVideoOptions
    }
}

export const useVideoOptionValues = (): {
    formatVals: FormatOptions[],
    subtitleVals: EMBED[],
    chapterVals: EMBED[],
    sponsorVals: string[] } => {

    const formatVals = Object.values(FormatOptions);
    const subVals: EMBED[] = ['embed'];
    const chapVals: EMBED[] = ['embed'];
    const sponVals = Object.values(SponsorOptions);

    return {
        formatVals: formatVals,
        subtitleVals: subVals,
        chapterVals: chapVals,
        sponsorVals: sponVals
    }
}

export const useVideoAttributes = ():{
    formatAttr: VideoAttributes,
    subtitleAttr: VideoAttributes,
    chapterAttr: VideoAttributes,
    sponsorAttr: VideoAttributes} => {

    const [
        formatAttr, subtitleAttr, chapterAttr, 
        sponsorAttr ] = Object.values(VideoAttributes);

    return {
        formatAttr: formatAttr, subtitleAttr: subtitleAttr,
        chapterAttr: chapterAttr, sponsorAttr: sponsorAttr
    }
}

export default function VideoProvider({ children }: { children: JSX.Element }) {

    const initilizeOptions = () => (
        Object.values(VideoAttributes).reduce(
            (acc: VideoOptions, value: VideoAttributes) => {
                acc[value] = '';
                return acc;
        }, {} as VideoOptions)
    )

    const [videoOptions, setVideoOptions] = useState<VideoOptions>(initilizeOptions);

    const isValidOptions = (): boolean => {
        return videoOptions.format != '';
    }

    return (
        <VideoContext.Provider value={{ videoOptions, setVideoOptions }}>
            <VideoValid.Provider value={ isValidOptions }>
                { children }
            </VideoValid.Provider>
        </VideoContext.Provider>
    );
}