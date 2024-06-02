import React from 'react';

const VidePlayerControls: React.FC = () => {
  
  return (
    <div className="flex flex-col space-y-4 p-4 bg-slate-900 rounded-b-lg">
      
      {/* Play/Pause Button and Progress Bar */}
      <div className='flex items-center space-x-2'>
        <button><img src="/play-button.svg" alt="play" className="w-8 h-8 svg-filter" /></button>
        <button><img src="/pause-button.svg" alt="play" className="w-8 h-8 svg-filter" /></button>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div id="progress-bar" className="bg-white h-4 rounded-full"></div>
        </div>
        <div className="text-sm text-white">0:26</div>
      </div>

      {/* Analysis Tools and Playback Section */}
      <div className="flex items-center justify-between space-x-4">
        <button><img src="/arrow-skip-back.svg" alt="play" className="w-8 h-8 svg-filter" /></button>
        <button><img src="/arrow-skip-forward.svg" alt="skip-back" className="w-8 h-8 svg-filter" /></button>
        <button><img src="/pencil.svg" alt="whiteboard" className="w-8 h-8 svg-filter" /></button>
        <button><img src="/bookmark.svg" alt="whiteboard" className="w-8 h-8 svg-filter" /></button>

        <div className="flex space-x-2 ">
          <input
          type="range"
          id="playbackRate"
          className="slider w-full"
          min="0.1"
          max="100"
          step="0.1"
          defaultValue={100}
          />
          <img src="/timer.svg" alt="whiteboard" className="w-6 h-6 svg-filter" />
        </div>
      </div>
    </div>
  );
};

export default VidePlayerControls;