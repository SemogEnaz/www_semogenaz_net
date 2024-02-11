import { 
    Dispatch, SetStateAction,
    useState,
    createContext, useContext } from "react";

type setBoolState = Dispatch<SetStateAction<boolean>>;
type setStringState = Dispatch<SetStateAction<string>>;

const TitleContext = createContext<{
    title: string, setTitle: setStringState } | undefined>(undefined);
const UrlContext = createContext<{
    url: string, setUrl: setStringState, isSafeUrl: (url: string) => boolean} | undefined>(undefined);
const SourceContext = createContext<{
    isYt: boolean, toggleState: () => void } | undefined>(undefined);
const MediaContext = createContext<{
    isAudio: boolean, setIsAudio: setBoolState } | undefined>(undefined);

export const useTitle = () => (
    useContext(TitleContext)
)

export const useUrl = () => (
    useContext(UrlContext)
)

export const useSource = () => (
    useContext(SourceContext)
)

export const useMediaContext = () => (
    useContext(MediaContext)
)

export function TitleProvider({ children }: { children: JSX.Element}) {
    const [title, setTitle] = useState('');

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            { children }
        </TitleContext.Provider>
    )
}

const isYtUrl = (url: string): boolean => {

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

const isIgUrl = (url: string): boolean => {

    if (!url || !url.split('/')[5]) return false;

    const isDomain = url.includes('https://www.instagram.com');
    const isPost = url.includes('/p/');
    const isPublic = url.split('/')[5].length < 13;

    return isDomain && isPost && isPublic;
}

function UrlProvider({ children }: { children: JSX.Element}) {
    const [url, setUrl] = useState('');
    const { isYt } = useContext(SourceContext)!;

    const setUrlSafe = 
        isYt ? 
            (url: string) => {if(isYtUrl(url)) setUrl(url)} :
            (url: string) => setUrl(url);

    const isSafeUrl = 
        isYt ?
            (url: string) => isYtUrl(url) :
            (url: string) => isIgUrl(url);

    return (
        <UrlContext.Provider value={{ url, setUrl, isSafeUrl }}>
            { children }
        </UrlContext.Provider>
    )
}

export function SourceUrlProvider({ children }: { children: JSX.Element}) {
    const [isYt, setIsYt] = useState(true);
    const toggleState = () => setIsYt(prevState => !prevState);

    return (
        <SourceContext.Provider value={{ isYt, toggleState }}>
            <UrlProvider>
                { children }
            </UrlProvider>
        </SourceContext.Provider>
    );
}

export function MediaProvider({ children }: { children: JSX.Element}) {
    const [isAudio, setIsAudio] = useState(true);

    return (
        <MediaContext.Provider value={{ isAudio, setIsAudio }}>
            { children }
        </MediaContext.Provider>
    );
}