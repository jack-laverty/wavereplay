'use client';
import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal } from "lucide-react";
import { Comment } from "@/lib/types";
import { cn } from "@/lib/utils"
import { formatRelative } from 'date-fns';


// comments are optional because there's
// no guarantee that the video player has a valid video loaded.
// server could fail to fetch session videos etc
interface CommentsSectionProps {
  className?: string;
  comments: Comment[];
  addComment: (commentText: string) => void;
}


export default function CommentSection({
  comments, 
  addComment,
  className,
}: CommentsSectionProps) {
  
  const [inputValue, setInputValue] = useState('');

  const handleAddComment = async () => {
    addComment(inputValue);
    setInputValue('');
  };

  // Sort comments by recency (most recent first)
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className={cn("default-styles min-w-72 bg-background rounded-md", className)}>
 
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
        {sortedComments.length > 0 ? (
          sortedComments.map((comment) => (
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
                      <span className="text-gray-500">
                        {formatRelative(comment.timestamp, new Date())}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
        )}
        </div>
      </ScrollArea>
    </div>
  );
}