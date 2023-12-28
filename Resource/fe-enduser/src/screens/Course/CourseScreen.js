import { useLocation, useSearchParams } from 'react-router-dom';
import { CourseCard, FullPagination, SortCourseSelect, CategoryCard, TopContent, CategoryCardList } from '../../components';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { isNumeric } from '../../core/utils/common';
import { useState } from 'react';
import { SORT_COURSE_OPTIONS } from '../../components/Filter/SortCourseSelect';
import { toJS } from 'mobx';
import { formatHeightElements } from '../../core/utils/browser';

const CourseScreen = observer((props) => {

    // other
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    // store
    const {
        categoryStore: { categoryList, category, getCategory },
        courseStore: { courseList, getAllCourse, clean, paging, searchCourse, setSearchCourse }
    } = useStore();

    // state
    const [filterParams, setFilterParams] = useState({
        size: 6,
        page: 1,
        sortby: SORT_COURSE_OPTIONS[0].keyValue
    })

    // lifecycle
    useEffect(() => {
        const getData = () => {
            if (categoryId && isNumeric(categoryId)) {
                getCategory(categoryId);
            }
        }

        clean();
        getData();
        return () => {
            clean();
        }
    }, [categoryId])

    useEffect(() => {
        onSearch();
    }, [filterParams, categoryId])

    useEffect(() => {
        if (courseList?.length > 0) {
            formatHeightElements('.course-card-content');
        }
    }, [courseList])

    // function
    const onPageChange = (page) => {
        setFilterParams({
            ...filterParams,
            page
        });
    }

    const onChangeSort = async (value) => {
        setFilterParams({
            ...filterParams,
            sortby: value
        });
    }

    const onSearch = () => {
        getAllCourse({
            ...filterParams,
            ...(categoryId ? { categoryId } : {}),
            name: searchCourse
        });
    }

    const onChangeSearchCourse = (e) => {
        setSearchCourse(e.target.value);
    }

    return (
        <>
            <TopContent namePage={'Khóa học'} breadcrumb={'Khóa học'} />

            {/* Search course */}
            <div className='container-fluid'>
                <div className='container d-flex justify-content-end'>
                    <div className='input-group max-width-500'>
                        <input
                            type='text'
                            className={'form-control p-4 rounded-0 rounded-left'}
                            placeholder='Tìm kiếm'
                            value={searchCourse}
                            onChange={onChangeSearchCourse} />
                        <button type='button'
                            className="btn btn-primary height-50 width-50 rounded-0 rounded-right"
                            onClick={onSearch}>
                            <i className='fas fa-search'></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Start */}
            {
                <div className='container-fluid py-5 pd-b-0'>
                    <div className='container pt-5 pb-3'>
                        <div className='text-center mb-5'>
                            {/* <h5 className='text-primary text-uppercase mb-3' style={{letterSpacing: '5px'}}>Categories</h5> */}
                            <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Danh mục</h5>
                            {/* <h1>Explore Top Categories</h1> */}
                            <h1>Các danh mục hàng đầu</h1>
                        </div>
                        <div className='row'>
                            <CategoryCardList data={categoryList.slice(0, 8)} active={categoryId} />
                            {/* {
                                categoryList.slice(0, 8).map(e => 
                                    <CategoryCard key={e.id} theme={{
                                        id: e.id,
                                        name: e.name,
                                        image: e.image,
                                        numberCourses: e.numberCourses
                                    }}/>
                                )
                            } */}
                        </div>
                    </div>
                </div>
            }

            {/* Courses Start */}
            <div className='container-fluid py-5 pd-b-0'>
                <div className='container py-5'>
                    <div className='text-center mb-5'>
                        {
                            categoryId &&
                            <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>{category?.name}</h5>
                        }
                        {/* <h1>All Courses</h1> */}
                        <h1>Tất cả khóa học</h1>
                    </div>
                    <div className='mb-5 d-flex justify-content-end'>
                        <SortCourseSelect
                            className='pd-0 col-12 col-sm-12 col-md-6 col-lg-4'
                            onChange={onChangeSort}
                        />
                    </div>
                    <div className='row'>
                        {
                            courseList.map(e => (
                                <CourseCard key={e.id} course={{
                                    id: e.id,
                                    name: e.name,
                                    image: e.image,
                                    numberStudents: e.numberStudents,
                                    teacherName: e.teacher?.name,
                                    time: e.videoLength,
                                    rate: e.rate,
                                    numberVotes: e.numberVotes
                                }} />
                            ))
                        }
                    </div>
                    <div className='col-12'>
                        <FullPagination
                            siblingCount={0}
                            totalRecords={paging.totalRecord}
                            currentPage={paging.page}
                            pageSize={paging.size}
                            onPageChange={onPageChange}
                            previousLabel="«"
                            nextLabel="»"
                        />
                    </div>
                </div>
            </div>
            {/* Courses End */}

            {/* Category Start */}
            {/* {
                categoryId &&
                <div className='container-fluid py-5'>
                    <div className='container pt-5 pb-3'>
                        <div className='text-center mb-5'>
                            <h5 className='text-primary text-uppercase mb-3' style={{letterSpacing: '5px'}}>Categorys</h5>
                            <h1>Other Top Categories</h1>
                        </div>
                        <div className='row'>
                            {
                                categoryList?.length > 0 &&
                                categoryList.filter(e => e.id != categoryId).map(e => 
                                    <CategoryCard key={e.id} theme={{
                                        id: e.id,
                                        name: e.name,
                                        image: e.image,
                                        numberCourses: e.numberCourses
                                    }}/>
                                )
                            }
                        </div>
                    </div>
                </div>
            } */}
            {/* Category Start */}
        </>
    )
})

export default CourseScreen;