'use client';
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal } from "lucide-react";

export default function CommentsSection() {
  
  const [inputValue, setInputValue] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      content: 'This is a post!',
      author: 'Some Guy',
      timestamp: '1:26',
      avatarUrl: '/api/placeholder/32/32'
    }
  ]);

  function handlePost() {
    if (!inputValue.trim()) return;
    
    const newComment = {
      id: comments.length + 1,
      content: inputValue,
      author: 'Current User',
      timestamp: 'min:sec',
      avatarUrl: ''
    };
    setComments([newComment, ...comments]);
    setInputValue('');
  }

  return (
    <div className="flex flex-col w-96 bg-white rounded-lg text-sm">
      
      {/* add a comment */}
      <div className="flex items-center p-2 space-x-2">
        <Textarea 
          placeholder="Add a comment..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePost}
          disabled={!inputValue.trim()}
        >
          <SendHorizontal />
        </Button>
      </div>
      
      {/* comment section */}
      <ScrollArea className='flex-1'>
        <div className="space-y-4 p-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={comment.avatarUrl} alt={comment.author} />
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