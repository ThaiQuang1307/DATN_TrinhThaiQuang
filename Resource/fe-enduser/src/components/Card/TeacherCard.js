import classNames from 'classnames';

const TeacherCard = (props) => {

    const { teacher: { name, image, subject, link: { facebook, linkedin, twitter } }, className } = props;

    return (
        <div className={classNames(className ?? 'col-md-6 col-lg-3 text-center team mb-4')}>
            <div className='team-item rounded overflow-hidden mb-2'>
                <div className='team-img position-relative'>
                    <img className='img-fluid' src={image} alt='' />
                    <div className='team-social'>
                        {
                            twitter &&
                            <a className='btn btn-outline-light btn-square mx-1' 
                                target={'_blank'}
                                href={twitter}>
                                <i className='fab fa-twitter' />
                            </a>
                        }
                        {
                            facebook &&
                            <a className='btn btn-outline-light btn-square mx-1' 
                                target={'_blank'}
                                href={facebook}>
                                <i className='fab fa-facebook-f' />
                            </a>
                        }
                        {
                            linkedin &&
                            <a className='btn btn-outline-light btn-square mx-1' 
                                target={'_blank'}
                                href={linkedin}>
                                <i className='fas fa-at' />
                            </a>
                        }
                    </div>
                </div>
                <div className='bg-secondary p-2'>
                    <h6>{name}</h6>
                    <p className='m-0'>{subject}</p>
                </div>
            </div>
        </div>

    )
}

export default TeacherCard;