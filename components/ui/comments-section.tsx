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

interface CommentsSectionProps {
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  className?: string;
}

export default function CommentsSection({ comments, setComments, className } : CommentsSectionProps) {
  
  const [inputValue, setInputValue] = useState('');

  const handleAddComment = () => {
    console.log('handleAddComment()');
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
        <div className="space-y-2 p-2">
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
                      <span className="text-sm text-gray-500">
                        {comment.timestamp}
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