import './urlInput.css';

export default function UrlInput({ isYt, url, setUrl, setIsYt }: 
    { isYt: boolean, url: string, setUrl, setIsYt }) {

    const placeholder = `Paste ${isYt ? 'YouTube' : 'Instagram'} url...`;

    return (
        <div className="drop-shadow-2xl mb-[30px]">

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

            <div className={`${isYt ? 'yt' : 'ig'} source-tab`} onClick={() => { setIsYt((prev: boolean) => !prev); }}>

                <div className="source-tab-footer">
                    <div className="arrow"></div>
                    <div className="source-text">&nbsp;&nbsp;{!isYt ? 'YouTube': "Instagram"}</div>
                </div>

            </div>

        </div>
    );
}