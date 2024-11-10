'use client';

import React, { useRef, useState, useEffect, ChangeEvent } from 'react';

interface VideoPlayerProps {
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
  
    const encodedTitle = encodeURIComponent(title);
    const videoUrl = `/api/videos/${encodedTitle}`;
  
    // Preload video and handle errors
    videoElement.src = videoUrl;
    videoElement.preload = 'auto';
  
    fetch(videoUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Video not found');
      })
      .catch(() => setError('404 dude, sorry'));
  
    // Cleanup
    return () => {
      if (videoElement) videoElement.src = '';
    };
  }, [title]);

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleDurationChange = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handlePlaybackRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col">
      {error ? (
        <span>{error}</span>
      ) : (
        <video
          ref={videoRef}
          width="1280"
          height="720"
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
        >
          Your browser does not support the video tag.
        </video>
      )}

      <div className="flex flex-col space-y-4 p-4 bg-slate-900 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <button onClick={togglePlay}>
            <img
              src={isPlaying ? '/pause-button.svg' : '/play-button.svg'}
              alt={isPlaying ? 'pause' : 'play'}
              className="w-8 h-8 svg-filter"
            />
          </button>
          <input
            type="range"
            value={currentTime}
            max={duration}
            step="0.001"
            onChange={handleSeek}
            className="w-full"
          />
          <div className="text-sm text-white w-32">{formatTime(currentTime)}</div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <button>
            <img src="/pencil.svg" alt="whiteboard" className="w-8 h-8 svg-filter" />
          </button>
          <button>
            <img src="/bookmark.svg" alt="bookmark" className="w-8 h-8 svg-filter" />
          </button>
          <div className="flex-shrink-0 w-64">
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                className="slider w-32"
              />
              <div className="text-sm text-white w-6 text-right">{playbackRate.toFixed(1)}x</div>
              <img src="/timer.svg" alt="playback-rate" className="w-6 h-6 svg-filter" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
