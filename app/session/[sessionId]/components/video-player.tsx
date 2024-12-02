'use client';

import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Play, Pause, Pencil, MessageSquarePlus } from "lucide-react";

interface VideoPlayerProps {
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number[]>([0]);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number[]>([1]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const encodedTitle = encodeURIComponent(title);
    const videoUrl = `/api/videos/${encodedTitle}`;
    
    setIsLoading(true);
    setError('');

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setError('Error loading video');
      setIsLoading(false);
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    
    videoElement.src = videoUrl;
    videoElement.load();

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      videoElement.src = '';
    };
  }, [title]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
  
    const updateCurrentTime = () => {
      setCurrentTime([videoElement.currentTime]);
      requestAnimationFrame(updateCurrentTime);
    };
  
    requestAnimationFrame(updateCurrentTime);
  
    return () => cancelAnimationFrame(updateCurrentTime as any);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime([videoRef.current.currentTime, 0]);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (newValue: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue[0];
    }
    setCurrentTime(newValue);
  };
  
  const handlePlaybackRateChange = (newValue: number[]) => {
    setPlaybackRate(newValue);
    console.error("test")
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col gap-y-2">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          {isLoading && (
            <Spinner>Loading...</Spinner>
          )}
          <video
            ref={videoRef}
            width="1280"
            height="720"
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            className={isLoading ? 'opacity-0' : 'opacity-100'}
          >
            Your browser does not support the video tag.
          </video>
        </>
      )}

      <div className="flex flex-col p-4 rounded-b-lg">
        <div className="flex items-center space-x-2">
        <Button onClick={togglePlay} variant="ghost" size="icon">
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </Button>
          <Slider
            value={currentTime}
            max={duration}
            step={0.001}
            onValueChange={handleSeek}
            onValueCommit={handleSeek}
            className="w-full"
          />
          <div className="text-sm">{formatTime(currentTime[0])}</div>
        </div>

        {/* analysis tools */}
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <Button variant="ghost" size="icon">
              <Pencil />
            </Button>

            <Button variant="ghost" size="icon">
              <MessageSquarePlus />
            </Button>
          </div>

          {/* playback rate */}
          <div className="flex-shrink-0 w-32">
            <div className="flex items-center space-x-2">
              <Slider 
                defaultValue={playbackRate}
                max={1} 
                step={0.01}
                onValueChange={handlePlaybackRateChange}
              />
              <div className="text-sm w-6 text-right">{playbackRate[0].toFixed(1)}x</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
