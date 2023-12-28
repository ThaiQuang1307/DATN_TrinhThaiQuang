/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { TopContent } from '../../components';

const AboutScreen = observer((props) => {

    return (
        <>
            <TopContent namePage={'Giới thiệu'} breadcrumb={'Giới thiệu'} />

            {/* About Start */}
            <div className='container-fluid py-5'>
                <div className='container py-5'>
                    <div className='row align-items-center'>
                        <div className='col-lg-5'>
                            <img className='img-fluid rounded mb-4 mb-lg-0' src='/images/about.jpg' alt='' />
                        </div>
                        <div className='col-lg-7'>
                            <div className='text-left mb-4'>
                                <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>About Us</h5>
                                <h1>Innovative Way To Learn</h1>
                            </div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. Ornare lectus sit amet est placerat in egestas erat imperdiet. Viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas. Faucibus et molestie ac feugiat. In eu mi bibendum neque egestas congue. Sit amet est placerat in egestas erat imperdiet. Vestibulum lorem sed risus ultricies. In nibh mauris cursus mattis molestie a iaculis at erat. </p>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <p>Mauris ultrices eros in cursus turpis massa tincidunt dui. Nibh cras pulvinar mattis nunc. Enim nulla aliquet porttitor lacus luctus accumsan tortor. Eget magna fermentum iaculis eu non diam phasellus. Aliquet bibendum enim facilisis gravida neque. Ligula ullamcorper malesuada proin libero nunc. Condimentum mattis pellentesque id nibh tortor id aliquet lectus proin. Est ullamcorper eget nulla facilisi etiam. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras. Eu feugiat pretium nibh ipsum. Tincidunt eget nullam non nisi est sit amet facilisis. Adipiscing elit pellentesque habitant morbi tristique senectus et netus et. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Porta non pulvinar neque laoreet suspendisse. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Et malesuada fames ac turpis egestas integer eget aliquet.</p>
                        <p>Sed viverra tellus in hac habitasse platea dictumst. Mauris nunc congue nisi vitae suscipit. Placerat vestibulum lectus mauris ultrices eros in cursus turpis massa. Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum. Tristique et egestas quis ipsum suspendisse. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Turpis egestas maecenas pharetra convallis. Pharetra massa massa ultricies mi quis hendrerit. At risus viverra adipiscing at in tellus. Ac turpis egestas maecenas pharetra. Fames ac turpis egestas integer eget.</p>
                        <p>Libero volutpat sed cras ornare arcu. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Justo laoreet sit amet cursus sit amet. Est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Auctor elit sed vulputate mi. Egestas integer eget aliquet nibh praesent tristique. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus. Enim praesent elementum facilisis leo vel. Felis imperdiet proin fermentum leo vel orci porta non pulvinar. Vivamus at augue eget arcu dictum varius. Cras adipiscing enim eu turpis egestas pretium aenean pharetra magna. Id leo in vitae turpis massa. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Massa enim nec dui nunc mattis enim ut tellus elementum. Ut porttitor leo a diam sollicitudin tempor id.</p>
                        <p>Venenatis urna cursus eget nunc scelerisque viverra mauris in. Turpis egestas pretium aenean pharetra magna ac placerat. Consectetur adipiscing elit pellentesque habitant morbi tristique. Ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin. Vitae justo eget magna fermentum iaculis eu non diam. Amet purus gravida quis blandit turpis cursus in. Ultricies lacus sed turpis tincidunt id aliquet. Gravida arcu ac tortor dignissim convallis aenean et. Posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Feugiat in fermentum posuere urna. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus.</p>
                    </div>
                </div>
            </div>
            {/* About End */}

        </>
    )
})

export default AboutScreen;