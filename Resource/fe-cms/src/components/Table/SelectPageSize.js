import { useTranslation } from 'react-i18next';
import { DEFAULT_PAGE_SIZE } from '../../core/configs/constants';
import './style.scss';

const SelectPageSize = (props) => {

    // translation
    const { t } = useTranslation();

    const { value, onChange, values, disabled } = props;

    return (
        <select value={value || DEFAULT_PAGE_SIZE} onChange={onChange} className='select' style={{ display: disabled ? 'none' : '' }}>
            {values.map(val => (
                <option key={val} value={val}>
                    {t('table.display')} {val}
                </option>
            ))}
        </select>
    );
}

export default SelectPageSize;
