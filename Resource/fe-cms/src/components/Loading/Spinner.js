import { BeatLoader, HashLoader, RingLoader } from 'react-spinners';

const Spinner = () => {

    return(
        <div className='spinner'>
            {/* <RingLoader color='#ffffff' size={50} /> */}
            {/* <HashLoader color='#001233'/> */}
            <BeatLoader color='#001233' margin={10}/>
        </div>
    )
}

export default Spinner;
