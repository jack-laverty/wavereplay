import React from 'react';

const Annotations: React.FC = () => {
  
  return (
    <div className="comments-section w-[600px] min-w-[300px] p-4 bg-white rounded-bl-lg">
      <h3 className="text-xl font-bold mb-4 text-black">Notes</h3>
      <div className="comments-list space-y-4">
      <div className="comment bg-gray-400 text-white p-3 rounded">
          <p className="text-sm">Nice one</p>
          <span className="text-sm text-gray-600">0:18</span>
      </div>
      <div className="comment bg-gray-400 text-white p-3 rounded">
          <p className="text-sm">Get out there!</p>
          <span className="text-sm text-gray-600">0:14</span>
      </div>
      <div className="comment bg-green-400 text-white p-3 rounded">
          <p className="text-sm">Get out there!</p>
          <span className="text-sm text-gray-600">0:14</span>
      </div>
      {/* Add more comment components as needed */}
      </div>
    </div>
  );
};

export default Annotations;