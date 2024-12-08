import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { Comment } from "@/lib/types";
import { getSession } from '@/lib/supabase/user';


export function useComments(
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  videoId?: number
) {
  
  const { toast } = useToast();

  // fetch the existing comments from the database
  const fetchComments = async () => {
    
    if (!videoId) return; // Avoid making the request if the ID is missing

    try {
      const response = await fetch(`/api/comments?videoId=${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json(); // this is a JSON object
      const comments = data?.data || []; // extract the comments array from it
      setComments(comments);  // update the comments
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]); // Clear comments on error
    }
  };

  // add a new comment
  const addComment = async (commentContent: string,) => {
    
    // can't add comments to a video without a video id
    if (!videoId || !commentContent.trim()) return null;

    const session = await getSession();
    if(!session) {
      throw new Error('custom comments hook failed to fetch current session');
    }


    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
          timestamp: new Date().toISOString(),
          author: session.user.user_metadata.user_name,
          video: videoId,
          avatar_url: session.user.user_metadata.avatar_url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit comment');
      }

      const newComment = await response.json();
      
      setComments(prevComments => [newComment, ...prevComments]);
      return newComment;

    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Submission Error",
        description: "Failed to write comment to database",
        variant: "destructive",
      });
      return null;
    }
  };

  return { addComment, fetchComments };
}