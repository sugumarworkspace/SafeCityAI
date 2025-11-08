
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-lg shadow-md">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary"></div>
      <p className="mt-4 text-lg text-brand-light">Analyzing incident...</p>
    </div>
  );
};

export default LoadingSpinner;
