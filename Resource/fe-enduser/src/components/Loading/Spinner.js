import { BeatLoader, RingLoader } from 'react-spinners';

const Spinner = () => {

    return(
        <div className='spinner'>
            {/* <RingLoader color='#ffffff' size={50} /> */}
            <BeatLoader color='#FF6600' margin={10}/>
        </div>
    )
}

export default Spinner;
