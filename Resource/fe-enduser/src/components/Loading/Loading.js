import classnames from 'classnames';
import { observer } from 'mobx-react';
import { useStore } from '../../core/utils/hook';
import Spinner from './Spinner';
import './style.scss';

const Loading = observer(() => {

    const { apiStore: { loading } } = useStore();

    return(
        <div className={classnames('loading', !loading && 'd-none')}>
            <Spinner/>
        </div>
    )
})

export default Loading;