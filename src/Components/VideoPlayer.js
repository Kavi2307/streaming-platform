import React, { useRef } from 'react';
import videojs from 'video.js';

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);

  React.useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
    });

    return () => {
      player.dispose();
    };
  }, []);

//   return <video ref={videoRef} className="video-js vjs-default-skin" />;
};

export default VideoPlayer;
