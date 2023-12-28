import React from 'react';
import videojs from 'video.js';
import PropTypes from 'prop-types';

class VideoPlayer extends React.Component {
    // Instantiate a Video.js player when the component mounts
    componentDidMount() {
        const { options, disableSeekBar, onTimeUpdate, timeUpdateStep } = this.props;
        this.player = videojs(this.videoNode, { controls: true, ...options }, () => {
            videojs.log('onPlayerReady', this);
        });

        const player = this.player;

        if (disableSeekBar) {
            player.controlBar.progressControl.disable();
        }

        if (onTimeUpdate) {
            player.on('timeupdate', function() {
                const currentTime = player.currentTime();
                const duration = player.duration();
                
                // const minutes = Math.floor((currentTime % 3600) / 60);
                const seconds = Math.floor((currentTime % 3600) % 60);


                if (seconds % timeUpdateStep === 0 || duration === currentTime) {
                    onTimeUpdate(currentTime);
                }
            });
        }
    }

    // Dispose the player when the component will unmount
    componentWillUnmount() {
        if (this.player) {
            // this.player.dispose();
        }
    }

    // Wrap the player in a `div` with a `data-vjs-player` attribute, so Video.js
    // won't create additional wrapper in the DOM.
    //
    // See: https://github.com/videojs/video.js/pull/3856
    render() {
        return (
            <div className='video-preview' data-vjs-player>
                <video ref={node => this.videoNode = node} className="video-js"></video>
            </div>
        );
    }
}

VideoPlayer.propTypes = {
    options: PropTypes.object, // https://videojs.com/guides/options
    disableSeekBar: PropTypes.bool,
    onTimeUpdate: PropTypes.func,
    timeUpdateStep: PropTypes.number // seconds
}

VideoPlayer.defaultProps = {
    timeUpdateStep: 15,
    disableSeekBar: false,
    options: {}
}

export default VideoPlayer;