import React from 'react';
import BackButton from './BackButton';
import { Session } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'


const SessionHeader: React.FC<{ session: Session }> = ({ session }) => {

  const [formattedDate, formattedTime] = formatDateTime(session.date, session.time);
  
  return (
    <div className="flex items-center justify-between px-2 pb-2 bg-white">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <BackButton />
          <div className="flex flex-col">
            <time className="flex text-sm md:text-lg">{formattedDate}</time>
            <time className="flex text-sm md:text-lg">{formattedTime}</time>
          </div>
        </div>
        <div className="md:grid md:grid-cols-2 md:grid-rows-2">
          <div className="flex text-xs md:text-sm font-bold items-center">Session Info</div>
          <div className="flex text-xs md:text-sm justify-start items-center">{session.wave}</div>
          <div className="flex text-xs md:text-sm font-bold items-center">Location</div>
          <div className="flex text-xs md:text-sm justify-start items-center">{session.location}</div>
        </div>
      </div>

      {/* surf time, wave count, board */}
      <div className="flex flex-col text-xs md:text-sm pr-6">
        <div className="grid grid-cols-2 grid-rows-3 gap-x-2">
          <div className="flex font-bold justify-end items-center">
              <img src="/clock.svg" alt="clock" className="w-6 h-6"/>
          </div>
          <time className="flex justify-start items-center">{session.time_surfed} total</time>
          <div className="flex font-bold justify-end items-center">
              <img src="/wave.svg" alt="wave" className="w-6 h-6"/>
          </div>
          <div className="flex justify-start items-center">{session.wave_count} waves</div>
          <div className="flex font-bold justify-end items-center">
              <img src="/surfboard.svg" alt="surfboard" className="w-6 h-6"/>
          </div>
          <div className="flex justify-start items-center">{session.board}</div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center">
        <img src="/chickenjoe.jpg" alt="Profile Image" className="w-16 h-16 ml-2 rounded-full" />
        <div className="text-lg">{session.surfer}</div>
      </div>

      <div className="hidden md:flex justify-end space-x-8 pr-4">
        <button className="flex flex-col items-center justify-center">
          <img src="/settings.svg" alt="Modify Icon" className="w-8 h-8" />
          <span className="text-sm">modify</span>
        </button>
        <button className="flex flex-col items-center justify-center">
          <img src="/delete.svg" alt="Delete Icon" className="w-8 h-8" />
          <span className="text-sm">delete</span>
        </button>
      </div>
    </div>
  );
};

export default SessionHeader;