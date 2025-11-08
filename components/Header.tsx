
import React from 'react';

const SirenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm shadow-lg w-full sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <SirenIcon />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Incident Reporter
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
