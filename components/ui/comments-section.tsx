'use client';
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal } from "lucide-react";
import { Comment } from "@/lib/types";
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { formatRelative } from 'date-fns';
import { getUsername, getSession } from '@/lib/supabase/user';


interface CommentsSectionProps {
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  className?: string;
}


export default function CommentsSection({ comments, setComments, className } : CommentsSectionProps) {
  
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();
  
  const handleAddComment = async () => {
    
    if (!inputValue.trim()) return;
    
    const session = await getSession();

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputValue,
          timestamp: new Date().toISOString(),
          author: session.user.user_metadata.user_name,
          video: 12,
          avatar_url: session.user.user_metadata.avatar_url,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit comment');
      }
  
      const newComment = await response.json();
  
      // optimistic update
      setComments(prevComments => [newComment, ...prevComments]);
      
      setInputValue('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Submission Error",
        description: "Failed to write comment to database",
        variant: "destructive",
      })
    }
  };

  return (
    <div className={cn("default-styles min-w-72 bg-white rounded-md", className)}>
 
      {/* add a comment */}
      <div className="flex items-center p-2 space-x-2">
        <Textarea
          placeholder="Add a comment..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={3}
          className="md:border-none md:bg-slate-200 md:text-xs resize-none"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddComment}
          disabled={!inputValue.trim()}
        >
          <SendHorizontal />
        </Button>
      </div>

      {/* comment section */}
      <ScrollArea>
        <div className="md:text-xs space-y-2 p-2">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-2">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={comment.avatar_url} alt={comment.author} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.author}</span>
                      <span className=" text-gray-500">
                        {formatRelative(comment.timestamp, new Date())}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}