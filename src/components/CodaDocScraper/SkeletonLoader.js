import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-8 rounded"></div>
    </div>
  );
};

export default SkeletonLoader;