import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Navigation, Loader } from 'lucide-react';
import { successFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';
import { GOOGLE_MAPS_CONFIG } from '@/config/maps';

interface AccessibilityMapProps {
  className?: string;
  onLocationSelect?: (location: google.maps.LatLngLiteral) => void;
}

interface AccessibilityMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  type: 'wheelchair' | 'elevator' | 'ramp' | 'other';
}

const AccessibilityMap: React.FC<AccessibilityMapProps> = ({ 
  className,
  onLocationSelect
}) => {
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<AccessibilityMarker | null>(null);
  const [markers, setMarkers] = useState<AccessibilityMarker[]>([]);
  
  // Add debug logs
  useEffect(() => {
    console.log('Checking Google Maps availability:', window.google?.maps);
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });

  // Add debug logs
  useEffect(() => {
    console.log('Map load status:', { isLoaded, loadError });
  }, [isLoaded, loadError]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Optionally set a default location or notify the user
        }
      );
    }
  }, []);

  // Map click handler
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng && onLocationSelect) {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      onLocationSelect(clickedLocation);
    }
  }, [onLocationSelect]);

  // Center on user location
  const handleCenterOnUser = useCallback(() => {
    if (currentLocation) {
      setCurrentLocation(currentLocation);
      successFeedback();
    }
  }, [currentLocation]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <Loader className="animate-spin text-accessibility-blue mb-3" size={32} />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={cn('map-container relative h-full w-full', className)}>
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={currentLocation || { lat: 37.7749, lng: -122.4194 }} // Default to San Francisco if no location
        zoom={12}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Current location marker */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: '/current-location.svg', // Ensure this icon exists
              scaledSize: new google.maps.Size(30, 30)
            }}
          />
        )}

        {/* Accessibility markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {/* Info window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3 className="font-medium">{selectedMarker.title}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMarker.type}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map controls */}
      <div className="absolute bottom-28 left-4 flex flex-col gap-2">
        <button 
          className="fab bg-white text-foreground p-2 rounded-full shadow-medium"
          onClick={handleCenterOnUser}
          aria-label="Center on current location"
        >
          <Navigation size={20} className="text-accessibility-blue" />
        </button>
      </div>
    </div>
  );
};

export default AccessibilityMap;
