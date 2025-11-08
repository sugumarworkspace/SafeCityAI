
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import IncidentForm from './components/IncidentForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import { analyzeIncident } from './services/geminiService';
import type { GeolocationCoordinates, ClassificationResult } from './types';

const App: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = useCallback(() => {
    setIsLocationLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocationLoading(false);
      },
      (geoError) => {
        setError(`Error getting location: ${geoError.message}. Please enable location services.`);
        setIsLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    // Automatically try to get location on first load
    handleGetLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!description || !location) {
      setError("Please provide an incident description and allow location access.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeIncident(description, location);
      setResult(analysisResult);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center antialiased">
      <Header />
      <main className="w-full max-w-2xl mx-auto p-4 md:p-6 flex-grow">
        <div className="space-y-6">
          <IncidentForm
            description={description}
            onDescriptionChange={setDescription}
            onSubmit={handleSubmit}
            location={location}
            onGetLocation={handleGetLocation}
            isLocationLoading={isLocationLoading}
            isLoading={isLoading}
          />
          {error && <ErrorAlert message={error} />}
          {isLoading && <LoadingSpinner />}
          {result && <ResultsDisplay result={result} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
