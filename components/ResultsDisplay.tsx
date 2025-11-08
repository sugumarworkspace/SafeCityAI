
import React from 'react';
import type { ClassificationResult } from '../types';

interface ResultsDisplayProps {
  result: ClassificationResult;
}

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full animate-fade-in">
      <h2 className="text-xl font-semibold text-white mb-4">Incident Analysis</h2>
      
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <p className="text-sm text-gray-400">Incident Category</p>
        <p className="text-2xl font-bold text-brand-secondary">{result.category}</p>
      </div>

      <h3 className="text-lg font-semibold text-white mb-3">Nearby Emergency Services</h3>
      {result.services.length > 0 ? (
        <ul className="space-y-3">
          {result.services.map((service, index) => (
            <li key={index} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-brand-secondary transition duration-200">
              <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-brand-light">{service.name}</h4>
                    <div className="flex items-center mt-1">
                        <MapPinIcon />
                        <p className="text-sm text-gray-300">{service.address}</p>
                    </div>
                  </div>
                  {service.uri && (
                     <a
                        href={service.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-brand-secondary bg-blue-900/50 hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-secondary transition"
                     >
                        View on Map <ExternalLinkIcon />
                     </a>
                  )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No nearby services were found based on the report.</p>
      )}
    </div>
  );
};

export default ResultsDisplay;
