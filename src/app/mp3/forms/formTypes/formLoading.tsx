import Image from "next/image";

export default function LoadingForm({ message }) {
    return (
        <div className="form loading">
            <div className="captains-wheel min-width-[70px]">
                <Image
                    src={'/mp3/assets/captainsWheel.svg'}
                    alt="Captains Wheel"
                    width={100}
                    height={100}
                    style={{
                        width: '200px',
                        height: 'auto',
                    }}
                />
            </div>
            <div className="loading-text">
                {message}
            </div>
        </div>
    );
}