import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import videojs from 'video.js';

const VideoJS = (props) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const {
        options, 
        onReady, 
        lastTimeViewed = 0,
        isTimeUpdate = false,
        afterTime = 0,
        onUpdateTime,
        disableForward = false
    } = props;

    useEffect(() => {
        if(disableForward) {
            videojs.use('*', (player) => {
                return {
                    // +++ Implement setSource() +++
                    setSource: function setSource(srcObj, next) {
                        next(null, srcObj);
                    },
                    // +++ Alter the setCurrentTime method +++
                    setCurrentTime: function setCurrentTime(time) {
                        const currentTime = player.currentTime();
                        
                        if (time < currentTime || time < lastTimeViewed) {
                            return time;
                        }
    
                        return currentTime;
                    }
                }
            })
        }
    }, [])

    useEffect(() => {

        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement('video-js');

            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');

                player.on('waiting', () => {
                    console.log('player is waiting');
                });

                if(isTimeUpdate) {
                    player.on('timeupdate', () => {
                        const currentTime = player.currentTime();
                        const duration = player.duration();

                        if(afterTime && Math.floor(currentTime) % afterTime === 0 && 
                            Math.abs(currentTime - duration) > afterTime) {
                            onUpdateTimeView(currentTime);
                        }

                        if(Math.abs(currentTime - duration) < 1) {
                            onUpdateTimeView(duration);
                        }
                    })
                }
            
                player.on('dispose', () => {
                    console.log('player will dispose');
                });

                onReady && onReady(player);
            });

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;

            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    const onUpdateTimeView = debounce((time) => {
        if(time - lastTimeViewed > afterTime) {
            onUpdateTime && onUpdateTime(time);
        }
    }, 1000)

    return (
        <div data-vjs-player>
            <div ref={videoRef} />
        </div>
    );
}

export default VideoJS;