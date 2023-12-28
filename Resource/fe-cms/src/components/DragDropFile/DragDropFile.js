import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MSG } from '../../core/configs/constants';
import { useStore } from '../../core/utils/hook';
import { getStringAfterLastSlash } from '../../core/utils/common';
import VideoPlayer from './VideoPlayer';

function DragDropFile({ dragText, onChange, className, maxSize, errorMaxSize, accept, errorAccept, initVideoPath }) {
    const [videoUri, setVideoUri] = useState(initVideoPath);
    const [changed, setChanged] = useState(false);
    // drag state
    const [dragActive, setDragActive] = useState(false);
    // ref
    const inputRef = useRef(null);

    const isM3u8 = useMemo(() => {
        if (!videoUri) return false;
        const ext = getStringAfterLastSlash(videoUri);

        return ext === 'm3u8';
    }, [videoUri])

    // store
    const { 
        modalStore: { openWarningModal }
    } = useStore();

    useEffect(() => {
        if (!videoUri && !changed && initVideoPath) {
            setVideoUri(initVideoPath);
        }
    }, [initVideoPath, videoUri, changed])

    // handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // validate file
    const handleValidateFile = (file) => {
        if (maxSize) { // Mb
            const isValidSize = file.size / 1024 / 1024 <= maxSize;
            if (!isValidSize) {
                openWarningModal(MSG[errorMaxSize]);
                return;
            }
        }

        if (accept) {
            const ext = getStringAfterLastSlash(file.name);
    
            if (!ext || !accept.includes(ext)) {
                openWarningModal(MSG[errorAccept]);
                return;
            }

            if (accept.includes('mp4')) {
                const src = URL.createObjectURL(file);
                setVideoUri(src);
            }
        }

        onChange && onChange(file);
    }

    const handleRemoveFile = () => {
        setChanged(true);
        setVideoUri(undefined);
        onChange && onChange(undefined);
    }

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleValidateFile(e.dataTransfer.files[0]);
        }
    };

    // triggers when file is selected with click
    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleValidateFile(e.target.files[0]);
        }
    };

    // const handleTimeUpdate = (time) => {
    //     console.log('time: ', time);

    // }

    return (
        <form className={classNames('form-file-upload', className)} onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input accept={accept} ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
            
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <p className="btn-drag-file">
                    { dragText || '動画アップロード又はドラッグ＆ドロップ' }
                </p>
            </label>
            {dragActive && <div
                id="drag-file-element"
                onDragEnter={handleDrag} onDragLeave={handleDrag}
                onDragOver={handleDrag} onDrop={handleDrop}></div>
            }
            {
                videoUri && (
                    <VideoPlayer
                        options={{
                            sources: [{
                                src: videoUri,
                                type: isM3u8 ? 'application/x-mpegURL' : 'video/mp4'
                            }]
                        }}
                        // onTimeUpdate={handleTimeUpdate}
                        // disableSeekBar
                    />
                )
            }
            {
                videoUri && <i onClick={handleRemoveFile} className="fa fa-light fa-circle-xmark close-file"></i>
            }
        </form>
    );
}

DragDropFile.propTypes = {
    dragText: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    maxSize: PropTypes.number,
    errorMaxSize: PropTypes.string,
    accept: PropTypes.string,
    errorAccept: PropTypes.string,
    initVideoPath: PropTypes.string
}

export default DragDropFile;