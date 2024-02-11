import { useMediaContext } from "../../contexts/FormContext";
import AudioProvider from "../../contexts/AudioContext";
import AudioForm from "./formAudio";
import VideoProvider from "../../contexts/VideoContext";
import VideoForm from "./formVideo";

export default function YtForm({setLoading, setFileNames}): JSX.Element {

    const { isAudio, setIsAudio } = useMediaContext()!;

    return (
        <>
        <div className="content-types">

            <div
                className={`content-type-button ${isAudio ? 'show-button' : ''}`}
                onClick={() => {
                    setIsAudio(true);
                }}>Audio</div>

            <div
                className={`content-type-button ${isAudio ? '' : 'show-button'}`}
                onClick={() => {
                    setIsAudio(false);
                }}>Video</div>

        </div>

        {isAudio ?
        <AudioProvider>
            <AudioForm setLoading={setLoading} setFileNames={setFileNames} />
        </AudioProvider>
        :
        <VideoProvider>                    
            <VideoForm setLoading={setLoading} setFileNames={setFileNames} />
        </VideoProvider>}
        </> 
    )
}