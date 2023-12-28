import { useNavigate } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import classNames from 'classnames';

const CategoryCardList = (props) => {

    // props
    const { data, active } = props;

    return (
        <div className='category-list w-100 d-flex flex-wrap align-items-center'>
            {
                data?.length > 0 &&
                data.map(e => 
                    <CategoryCard 
                        key={e.id} 
                        theme={{
                            id: e.id,
                            name: e.name,
                            image: e.image,
                            numberCourses: e.numberCourses
                        }}
                        active={active}
                    />
                )
            }
        </div>
    )

}

const CategoryCard = (props) => {

    // props
    const { theme: { id, name, image, numberCourses = 0 }, active } = props;

    // other
    const navigate = useNavigate();

    return (
        <div className={classNames('category-item col-md-4 col-sm-6 col-xs-12 py-2', active == id && 'active')} 
            role='button' onClick={() => navigate(`${SYSTEM_PATH.COURSE}?categoryId=${id}`)}>
            <span className='font-weight-medium mg-0'>{name}</span>
            <span className='total-courses'>({numberCourses ?? 0})</span>
        </div>

    // <div className='col-lg-3 col-md-6 mb-4' role='button' onClick={() => navigate(`${SYSTEM_PATH.COURSE}?categoryId=${id}`)}>
    //     <div className='cat-item position-relative overflow-hidden rounded mb-2 text-center'>
    //         {/* <img className='img-fluid' src={image} alt='' />
    //         <a className='cat-overlay text-white text-decoration-none' href>
    //             <h4 className='text-white font-weight-medium'>{name}</h4>
    //             <span>{numberCourses ?? 0} Courses</span>
    //         </a> */}
    //         {/* <h4 className='font-weight-medium'>{name}</h4>
    //         <span>{numberCourses ?? 0} Courses</span> */}
    //     </div>
    // </div>

    )
}

export { CategoryCardList, CategoryCard };