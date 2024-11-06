'use client';

import React, { useRef, useState, useEffect, ChangeEvent, useCallback } from 'react';

interface VideoPlayerProps {
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [frameRate, setFrameRate] = useState<number>(30); // Assume 30fps by default

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = `/api/videos/${title}`;
      videoRef.current.preload = 'auto'; // Preload the entire video
    }
  }, [title]);

  // Memoize togglePlay function to avoid re-renders unless needed
  const togglePlay = useCallback((): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]); // Add isPlaying as a dependency to toggle correctly

  // Memoize moveFrame function to avoid re-renders unless needed
  const moveFrame = useCallback((frames: number): void => {
    if (videoRef.current) {
      const frameTime = 1 / frameRate;
      videoRef.current.currentTime += frames * frameTime;
      setCurrentTime(videoRef.current.currentTime);
    }
  }, [frameRate]); // Add frameRate as a dependency for frame calculation

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveFrame(-1);
      if (e.key === 'ArrowRight') moveFrame(1);
      if (e.key === ' ') togglePlay();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveFrame, togglePlay]); // Add moveFrame and togglePlay to the dependency array

  const handleTimeUpdate = (): void => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = (): void => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Attempt to get the actual frame rate
      if ('getVideoPlaybackQuality' in videoRef.current) {
        const quality = (videoRef.current as any).getVideoPlaybackQuality();
        if (quality.totalVideoFrames && videoRef.current.duration) {
          setFrameRate(quality.totalVideoFrames / videoRef.current.duration);
        }
      }
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>): void => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handlePlaybackRateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const rate = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      <video
        ref={videoRef}
        width="1280"
        height="720"
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
      >
        Your browser does not support the video tag.
      </video>
      
      <div className="flex flex-col space-y-4 p-4 bg-slate-900 rounded-b-lg">
        <div className='flex items-center space-x-2'>
          <button onClick={togglePlay}>
            <img 
              src={isPlaying ? "/pause-button.svg" : "/play-button.svg"} 
              alt={isPlaying ? "pause" : "play"} 
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
          <button onClick={() => moveFrame(-1)}><img src="/arrow-skip-back.svg" alt="previous-frame" className="w-8 h-8 svg-filter" /></button>
          <button onClick={() => moveFrame(1)}><img src="/arrow-skip-forward.svg" alt="next-frame" className="w-8 h-8 svg-filter" /></button>
          <button><img src="/pencil.svg" alt="whiteboard" className="w-8 h-8 svg-filter" /></button>
          <button><img src="/bookmark.svg" alt="bookmark" className="w-8 h-8 svg-filter" /></button>
          <div className="flex-shrink-0 w-64">
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="playbackRate"
                className="slider w-32"
                min="0.1"
                max="1.0"
                step="0.1"
                value={playbackRate}
                onChange={handlePlaybackRateChange}
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
