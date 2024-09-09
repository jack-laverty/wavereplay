'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@/lib/types'
import { formatTime, formatDate } from '@/lib/utils'

interface SessionsListProps {
  sessions: Session[];
}

const SessionsList: React.FC<SessionsListProps> = ({ sessions }) => {
  const router = useRouter();

  const handleRowClick = (sessionId: number) => {
    router.push(`/session/${sessionId}`);
  };

  return (
      <div className="overflow-x-auto rounded-lg border border-gray-300 text-xs md:text-sm">
        
        {/* desktop */}
        <table className="hidden md:table min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Wave</th>
              <th className="px-4 py-2 text-left">Surfer</th>
              <th className="px-4 py-2 text-left">Board</th>
              <th className="px-4 py-2 text-left">Wave Count</th>
              <th className="px-4 py-2 text-left">Time Surfed</th>
              <th className="px-4 py-2 text-left">Session ID</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr 
              key={session.session_id} 
                className="border-t border-gray-300 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(session.session_id)}
                >
                <td className="px-4 py-2">{formatDate(session.date)}</td>
                <td className="px-4 py-2">{formatTime(session.time)}</td>
                <td className="px-4 py-2">{session.location}</td>
                <td className="px-4 py-2">{session.wave}</td>
                <td className="px-4 py-2">{session.surfer}</td>
                <td className="px-4 py-2">{session.board}</td>
                <td className="px-4 py-2">{session.wave_count}</td>
                <td className="px-4 py-2">{session.time_surfed}</td>
                <td className="px-4 py-2">{session.session_id}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* mobile */}
        <table className="table md:hidden min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 text-left">Time</th>
              <th className="p-1 text-left">Location</th>
              <th className="p-1 text-left">Wave</th>
              <th className="p-1 text-left">Surfer</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr 
                key={session.session_id} 
                className="border-t border-gray-300 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(session.session_id)}
              >
                <td className="flex flex-col p-1">
                  <time>{session.date}</time>
                  <time>{session.time}</time>
                </td>
                <td className="p-1">{session.location}</td>
                <td className="p-1">{session.wave}</td>
                <td className="p-1">{session.surfer}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
  );
};

export default SessionsList;