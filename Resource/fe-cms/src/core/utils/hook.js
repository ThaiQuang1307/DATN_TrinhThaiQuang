import { MobXProviderContext } from 'mobx-react'
import { useMemo, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useStore = () => {
    const { store } = useContext(MobXProviderContext);
    return store;
}

export const useTitle = (titlePage, titleWeb = null) => {
    useEffect(() => {
        titlePage && (document.title = `${titlePage} | ${titleWeb || 'QM-COURSES CMS'}`);
    }, [titlePage, titleWeb])
}

export const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export const useOutsideAlerter = (fb) => {

    const ref = useRef(null);

    /**
         * Alert if clicked on outside of element
         */
    const handleClickOutside = (event) => {
        if (!ref.current?.contains(event.target)) {
            fb && fb()
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener('mouseup', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, []);

    return ref;
}