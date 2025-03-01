
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import { successFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';

interface AccessibilityMapProps {
  className?: string;
  onLocationSelect?: (location: any) => void;
}

const AccessibilityMap: React.FC<AccessibilityMapProps> = ({ 
  className,
  onLocationSelect
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Simulated map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            successFeedback();
          },
          (error) => {
            console.error('Error getting location:', error);
            // Set default location
            setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // San Francisco
          }
        );
      } else {
        // Set default location if geolocation not available
        setCurrentLocation({ lat: 37.7749, lng: -122.4194 });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // This is a placeholder for the actual map implementation
  // In a real app, this would use the Google Maps API or another mapping library
  
  return (
    <div className={cn('map-container relative', className)}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin text-accessibility-blue mb-3" size={32} />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          {/* This would be replaced with an actual map implementation */}
          <div className="absolute inset-0 bg-slate-200">
            {/* Map placeholder with grid lines to simulate a map */}
            <div className="w-full h-full grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-slate-300" />
              ))}
            </div>
            
            {/* Simulated map markers */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="accessibility-marker bg-accessibility-blue animate-pulse-subtle">
                <MapPin className="text-white" size={20} />
              </div>
            </div>
            
            <div className="absolute top-1/4 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="accessibility-marker bg-accessibility-green">
                <MapPin className="text-white" size={20} />
              </div>
            </div>
            
            <div className="absolute top-3/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="accessibility-marker bg-accessibility-yellow">
                <MapPin className="text-white" size={20} />
              </div>
            </div>
          </div>
          
          {/* Map controls */}
          <div className="absolute bottom-28 left-4 flex flex-col gap-2">
            <button 
              className="fab bg-white text-foreground p-2 rounded-full shadow-medium"
              aria-label="Zoom in"
            >
              <span className="text-xl font-bold">+</span>
            </button>
            
            <button 
              className="fab bg-white text-foreground p-2 rounded-full shadow-medium"
              aria-label="Zoom out"
            >
              <span className="text-xl font-bold">−</span>
            </button>
          </div>
          
          <button 
            className="fab bottom-28 left-1/2 transform -translate-x-1/2 bg-white text-foreground p-3 rounded-full shadow-medium"
            aria-label="Center on current location"
          >
            <Navigation size={20} className="text-accessibility-blue" />
          </button>
        </>
      )}
    </div>
  );
};

export default AccessibilityMap;
