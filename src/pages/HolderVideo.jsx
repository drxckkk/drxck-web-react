import React from 'react';
import video from '../assets/holdervideo.mp4';
import './HolderVideo.css';

function HolderVideo() {
  return (
    <div className="holder-video-page">
      <video controls autoPlay loop className="fullscreen-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default HolderVideo;
