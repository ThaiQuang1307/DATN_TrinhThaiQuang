import classNames from 'classnames';
import { useEffect } from 'react';
import { useState } from 'react';

export const SORT_COURSE_OPTIONS = [
    {
        keyValue: 'participation',
        // label: 'Number of participations'
        label: 'Số lượng tham gia'
    },
    {
        keyValue: 'rating',
        // label: 'Rating'
        label: 'Đánh giá'
    },
    {
        keyValue: 'ascending_name',
        // label: 'Ascending name'
        label: 'Tên A - Z'
    },
    {
        keyValue: 'descending_name',
        // label: 'Descending name'
        label: 'Tên Z - A'
    }
]

const SortCourseSelect = (props => {

    const { defaultValue, onChange, className, hideLabel, onReady } = props;

    // state
    const [selected, setSelected] = useState(defaultValue ?? SORT_COURSE_OPTIONS[0].keyValue);

    // function
    const onChangeOption = (e) => {
        const value = e?.target?.value;
        setSelected(value);
        onChange && onChange(value);
    }

    // lifecycle
    useEffect(() => {
        onReady && onReady(selected);
    }, [])

    return (
        <div className={classNames('sort-course-select', className)}>
            <div className='d-flex align-items-center justify-content-between flex-gap-10 flex-wrap'>
                {
                    !hideLabel &&
                    // <span>Sort by</span>
                    <span>Sắp xếp</span>
                }
                <select value={selected} onChange={onChangeOption} className='form-control w-auto flex-fill min-width-250'>
                    {
                        SORT_COURSE_OPTIONS.map(e => <option key={e.keyValue} value={e.keyValue}>{e.label}</option>)
                    }
                </select>
            </div>
        </div>
    )
})

export default SortCourseSelect;