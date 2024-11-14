import React from 'react';
import { Session } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const VideoHeader: React.FC<{ session: Session }> = ({ session }) => {

  const [formattedDate, formattedTime] = formatDateTime(session.date, session.time);

  return (
    <div className="video-header flex items-center p-4 rounded-t-xl">
      <Avatar>
        <AvatarFallback>KS</AvatarFallback>
      </Avatar>
      <div className="flex flex-col pl-5 space-y-1">
        <div className="flex space-x-2">
          <div className="font-bold text-base">{session.surfer}</div>
        </div>
        <time className="text-sm">{formattedDate} - {formattedTime}</time>
      </div>
    </div>
  );
};

export default VideoHeader;