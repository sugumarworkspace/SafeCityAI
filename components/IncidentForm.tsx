
import React from 'react';
import type { GeolocationCoordinates } from '../types';

interface IncidentFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  location: GeolocationCoordinates | null;
  onGetLocation: () => void;
  isLocationLoading: boolean;
  isLoading: boolean;
}

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const IncidentForm: React.FC<IncidentFormProps> = ({
  description,
  onDescriptionChange,
  onSubmit,
  location,
  onGetLocation,
  isLocationLoading,
  isLoading,
}) => {
  const isSubmitDisabled = !description || !location || isLoading;

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full">
      <h2 className="text-xl font-semibold text-white mb-4">Report an Incident</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Describe the situation
          </label>
          <textarea
            id="description"
            rows={5}
            className="w-full bg-slate-900 text-white rounded-md border border-slate-700 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition p-2"
            placeholder="e.g., 'There's a car accident on the corner of Main St and 1st Ave. It looks like someone might be hurt.'"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
           {location ? (
             <div className="flex items-center bg-green-900/50 text-green-200 p-3 rounded-md border border-green-700">
               <LocationIcon />
               <span className="text-sm font-medium">Location Acquired: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
             </div>
           ) : (
            <button
              onClick={onGetLocation}
              disabled={isLocationLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-secondary hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-brand-secondary disabled:bg-slate-600 disabled:cursor-not-allowed transition"
            >
              {isLocationLoading ? (
                  <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Location...
                  </>
              ) : (
                <>
                  <LocationIcon />
                  Get My Location
                </>
              )}
            </button>
           )}
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-accent hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-brand-accent disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          Analyze & Find Help
        </button>
         {isSubmitDisabled && !isLoading && (
            <p className="text-xs text-center text-gray-400 mt-2">
                Please provide a description and get your location to proceed.
            </p>
         )}
      </div>
    </div>
  );
};

export default IncidentForm;
