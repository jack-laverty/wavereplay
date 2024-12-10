'use client';

import { useState, useEffect } from 'react';
import VideoHeader from './video-header';
import VideoPlayer from './video-player';
import VideoList from './video-list';
import { Comment, Session, VideoMetadata } from '@/lib/types';
import CommentsSection from '@/components/ui/comments-section';
import { useComments } from '@/hooks/use-comments';

interface VideoContainerProps {
  clips: VideoMetadata[];
  session: Session;
}

export default function VideoContainer({ clips, session }: VideoContainerProps) {
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);
  const { fetchComments, addComment } = useComments(
    setComments,
    selectedVideo?.id);

  // Fetch comments when the selected video changes
  useEffect(() => {
    if (selectedVideo?.id) {
      fetchComments();
    }
  }, [selectedVideo, fetchComments]);

  // Select the first video in the list on initial render
  useEffect(() => {
    if (clips.length > 0 && !selectedVideo) {
      setSelectedVideo(clips[0]);
    }
  }, [clips, selectedVideo]);

  const handleSelectVideo = (video: VideoMetadata) => {
    setSelectedVideo(video);
  };

  return (
    <div className="flex flex-col justify-between md:mx-auto md:p-6 rounded-xl">
      <div className="flex gap-4 flex-1 overflow-hidden">

        {/* video section */}
        <div className="flex flex-col rounded-xl max-w-screen-lg">
          <VideoHeader session={session} />
          <VideoPlayer title={selectedVideo ? selectedVideo.title : ''} />
          <VideoList
            videos={clips}
            selectedVideo={selectedVideo}
            onSelectVideo={handleSelectVideo}
          />
        </div>

        {/* comments section */}
        <CommentsSection 
          className="rounded-xl"
          comments={comments}
          addComment={addComment}
        />
      </div>
      
    </div>
  );
}
