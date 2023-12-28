import { DEFAULT_PAGE_SIZE } from '../../core/configs/constants';
import './style.scss';

const SelectPageSize = (props) => {

    const { value, onChange, values, disabled } = props;

    return (
        <select value={value || DEFAULT_PAGE_SIZE} onChange={onChange} className='select' style={{ display: disabled ? 'none' : '' }}>
            {values.map(val => (
                <option key={val} value={val}>
                    {/* Display {val} */}
                    Hiển thị {val}
                </option>
            ))}
        </select>
    );
}

export default SelectPageSize;
