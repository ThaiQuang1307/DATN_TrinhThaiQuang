import classnames from 'classnames';
import { useState } from 'react';
import { Calendar, DateRange, DateRangePicker } from 'react-date-range';
import * as localDefault from 'date-fns/locale/en-US/index';

import './style.scss';
import { useOutsideAlerter } from '../../core/utils/hook';
import moment from 'moment';

const CalendarCustom = (props) => {

    // props
    const {
        ariaLabels = {},
        calendarFocus = 'forwards',
        className,
        color = '#0077B6',
        date,
        dateDisplayFormat = 'yyyy/MM/DD',
        dayDisplayFormat = 'dd',
        direction = 'vertical',
        disabledDates = [],
        disabledDay,
        displayMode = 'date',
        dragSelectionEnabled = true,
        editableDateInputs = false,
        endDatePlaceholder = 'Continuous',
        fixedHeight = false,
        focusedRange = [0, 0],
        initialFocusedRange,
        locale,
        maxDate,
        minDate,
        monthDisplayFormat = 'yyyy/MM',
        months = 1,
        navigatorRenderer,
        onChange,
        onPreviewChange,
        onRangeFocusChange,
        onShownDateChange,
        preventSnapRefocus = false,
        preview,
        rangeColors = ['#0077B6', '#3ecf8e', '#fed14c'],
        ranges = [{
            startDate: null,
            endDate: new Date(''),
            key: 'selection'
        }],
        scroll,
        showDateDisplay = false,
        showMonthAndYearPickers = true,
        showMonthArrow = true,
        showPreview = true,
        shownDate,
        startDatePlaceholder = 'Early',
        updateRange,
        weekStartsOn,
        weekdayDisplayFormat = 'E',
        isRenderInput = true,
        isEditInput = false,
        iconInput,
        // date range
        moveRangeOnFirstSelection = false,
        showSelectionPreview = true,
        // date range picker
        monthsPicker = 2,
        directionPicker = 'horizontal',
        disabled
    } = props;

    // state
    const [ showCalendar, setShowCalendar ] = useState(false);
    const [ countSelectRange, setCountSelectRange ] = useState(0);

    // ref
    const calendarRef = useOutsideAlerter(() => setShowCalendar(false));

    // function
    const onToggleShowCalendar = () => {
        setShowCalendar(!showCalendar);
    }

    const onChangeSelectDate = (date) => {
        onChange && onChange(date);
        setShowCalendar(false);
    }
    const onChangeSelectDateRange = (date) => {
        if (date?.selection?.startDate && date?.selection?.endDate) {
            onChange && onChange(date);
        }

        if(countSelectRange === 1) {
            setShowCalendar(false);
            setCountSelectRange(0);
        } else setCountSelectRange(countSelectRange + 1);
    }

    const onClearCalendar = () => {
        if(displayMode === 'date') {
            onChange && onChange(null);
        } else {
            onChange && onChange([{
                startDate: null,
                endDate: new Date(''),
                key: 'selection'
            }]);
        }
    }

    return(
        <div className={classnames('calendar-custom pd-0', className, disabled && 'disabled-date-picker')} ref={isRenderInput ? calendarRef : null}>
            {
                isRenderInput &&
                <div className='container-input pd-0'>
                    <input className='w-100' 
                        value={
                            displayMode === 'date' ? 
                                date ? moment(new Date(date)).format(dateDisplayFormat) : ''
                                :
                                // eslint-disable-next-line max-len
                                `${ranges?.[0]?.startDate && !isNaN(ranges?.[0]?.startDate) ? `${moment(new Date(ranges[0].startDate)).format(dateDisplayFormat)} ~`: '' } ${ranges?.[0]?.endDate && !isNaN(ranges?.[0]?.endDate) ? moment(new Date(ranges[0].endDate)).format(dateDisplayFormat): ''}`
                        } 
                        readOnly={!isEditInput}
                        onClick={onToggleShowCalendar}
                    />
                    <div className='btn-icon-input'>
                        {iconInput || <i className='fa-solid fa-calendar-days' onClick={onToggleShowCalendar}></i> }
                    </div>
                    {
                        (date || (ranges?.[0]?.startDate && !isNaN(ranges?.[0]?.startDate))) &&
                        <div className='btn-icon-input btn-clear-input' onClick={onClearCalendar}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    }
                </div>
            }
            {
                ((isRenderInput && showCalendar) || !isRenderInput) && 
                <div className='container-calender'>
                    { 
                        displayMode === 'date' &&
                        <Calendar
                            ariaLabels={ariaLabels}
                            calendarFocus={calendarFocus}
                            className={'calendar'}
                            color={color}
                            date={date ? new Date(date) : new Date()}
                            dateDisplayFormat={dateDisplayFormat}
                            dayDisplayFormat={dayDisplayFormat}
                            direction = {direction}
                            disabledDates = {disabledDates}
                            disabledDay = {disabledDay}
                            displayMode = {'date'}
                            dragSelectionEnabled = {dragSelectionEnabled}
                            fixedHeight = {fixedHeight}
                            focusedRange = {focusedRange}
                            locale = {locale || localDefault}
                            maxDate = {maxDate}
                            minDate = {minDate}
                            monthDisplayFormat = {monthDisplayFormat}
                            months = {months}
                            navigatorRenderer = {navigatorRenderer}
                            onChange = {onChangeSelectDate}
                            onPreviewChange = {onPreviewChange}
                            onShownDateChange = {onShownDateChange}
                            preventSnapRefocus = {preventSnapRefocus}
                            preview = {preview}
                            scroll = {scroll}
                            showDateDisplay = {showDateDisplay}
                            showMonthAndYearPickers = {showMonthAndYearPickers}
                            showMonthArrow = {showMonthArrow}
                            showPreview = {showPreview}
                            shownDate = {shownDate}
                            weekStartsOn = {weekStartsOn}
                            weekdayDisplayFormat = {weekdayDisplayFormat}
                        />
                    }
                    {
                        displayMode === 'dateRange' &&
                        <DateRange
                            ariaLabels={ariaLabels}
                            calendarFocus={calendarFocus}
                            className={'calendar'}
                            color={color}
                            direction = {direction}
                            disabledDates = {disabledDates}
                            disabledDay = {disabledDay}
                            dragSelectionEnabled = {dragSelectionEnabled}
                            editableDateInputs = {editableDateInputs}
                            endDatePlaceholder = {endDatePlaceholder}
                            fixedHeight = {fixedHeight}
                            initialFocusedRange = {initialFocusedRange}
                            locale = {locale || localDefault}
                            maxDate = {maxDate}
                            minDate = {minDate}
                            monthDisplayFormat = {monthDisplayFormat}
                            months = {months}
                            navigatorRenderer = {navigatorRenderer}
                            onChange = {onChangeSelectDateRange}
                            rangeColors = {rangeColors}
                            ranges = {ranges}
                            scroll = {scroll}
                            showDateDisplay = {showDateDisplay}
                            showMonthAndYearPickers = {showMonthAndYearPickers}
                            showMonthArrow = {showMonthArrow}
                            showPreview = {showPreview}
                            startDatePlaceholder = {startDatePlaceholder}
                            updateRange = {updateRange}
                            weekStartsOn = {weekStartsOn}
                            weekdayDisplayFormat = {weekdayDisplayFormat}
                            moveRangeOnFirstSelection={moveRangeOnFirstSelection}
                            showSelectionPreview={showSelectionPreview}
                        />
                    }
                    {
                        displayMode === 'dateRangePicker' &&
                        <DateRangePicker
                            ariaLabels={ariaLabels}
                            calendarFocus={calendarFocus}
                            className={'calendar-picker'}
                            color={color}
                            locale = {locale || localDefault}
                            ranges={ranges}
                            months={monthsPicker}
                            onChange={onChangeSelectDateRange}
                            direction={directionPicker}
                            showSelectionPreview={showSelectionPreview}
                            moveRangeOnFirstSelection={moveRangeOnFirstSelection}
                            showDateDisplay={showDateDisplay}
                            monthDisplayFormat = {monthDisplayFormat}
                        />
                    }
                </div>
            }
        </div>
    )
}

export default CalendarCustom;