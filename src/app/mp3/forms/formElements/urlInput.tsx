import { useSource, useTitle, useUrl } from '../contexts/FormContext';
import './urlInput.css';

export default function UrlInput() {

    const { isYt, toggleState } = useSource()!;
    const placeholder = `Paste ${isYt ? 'YouTube' : 'Instagram'} url...`;
    const { url, setUrl } = useUrl()!;
    const { title } = useTitle()!;

    return (
        <>
        {title == '' ?
        <div className='form-title'></div> :
        <div className={`form-title show`}>
            {title}
        </div>}

        <div className="drop-shadow-2xl mb-[40px]">

            <div className="url-input-box">
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

            <div className={`${isYt ? 'yt' : 'ig'} source-tab`} onClick={toggleState}>
                <div className="source-tab-footer">
                    <div className="arrow"></div>
                    <div className="source-text">&nbsp;&nbsp;{!isYt ? 'YouTube': "Instagram"}</div>
                </div>
            </div>

        </div>
        </>
    );
}