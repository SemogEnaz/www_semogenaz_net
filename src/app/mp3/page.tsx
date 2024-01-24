import Waves from './backgorund/waves';
import SubmissionForm from './forms/form';
import Storm from './backgorund/storm';

import '@/app/mp3/backgorund/storm.css';

export default function Page() {

    const isRain = false;
    const isThunder = true;
    
    return (
        <div className='flex flex-col items-center'>

            <Storm 
                isRain={isRain}
                isThunder={isThunder}/>

            <div
            className='
                absolute
                top-10
                md:top-20

                text-6xl
                md:text-7xl
            '>
                .mp3
            </div>

            <Waves body={<SubmissionForm/>} />
            
        </div>
    );
}