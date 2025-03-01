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
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(GOOGLE_MAPS_CONFIG.defaultCenter);
  const [selectedMarker, setSelectedMarker] = useState<AccessibilityMarker | null>(null);
  const [markers, setMarkers] = useState<AccessibilityMarker[]>([]);
  
  // Add debug logs
  useEffect(() => {
    console.log('Checking Google Maps availability:', window.google?.maps);
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY",
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
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(userLocation);
          successFeedback();
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { timeout: 10000 }
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
        }
      );
    }
  }, []);

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
        <div className="flex flex-col items-center">
          <Loader className="animate-spin text-accessibility-blue mb-3" size={32} />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('map-container relative h-full w-full', className)}>
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={currentLocation}
        zoom={GOOGLE_MAPS_CONFIG.defaultZoom}
        onClick={handleMapClick}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Current location marker */}
        <Marker
          position={currentLocation}
          icon={{
            url: '/current-location.svg', // Create this icon
            scaledSize: new google.maps.Size(30, 30)
          }}
        />

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
          onClick={() => {
            const map = document.querySelector('div[aria-label="Map"]');
            if (map) {
              const zoom = (map as any).__gm?.getZoom() || GOOGLE_MAPS_CONFIG.defaultZoom;
              (map as any).__gm?.setZoom(zoom + 1);
            }
          }}
          aria-label="Zoom in"
        >
          <span className="text-xl font-bold">+</span>
        </button>
        
        <button 
          className="fab bg-white text-foreground p-2 rounded-full shadow-medium"
          onClick={() => {
            const map = document.querySelector('div[aria-label="Map"]');
            if (map) {
              const zoom = (map as any).__gm?.getZoom() || GOOGLE_MAPS_CONFIG.defaultZoom;
              (map as any).__gm?.setZoom(zoom - 1);
            }
          }}
          aria-label="Zoom out"
        >
          <span className="text-xl font-bold">−</span>
        </button>
      </div>
      
      <button 
        className="fab bottom-28 left-1/2 transform -translate-x-1/2 bg-white text-foreground p-3 rounded-full shadow-medium"
        onClick={handleCenterOnUser}
        aria-label="Center on current location"
      >
        <Navigation size={20} className="text-accessibility-blue" />
      </button>
    </div>
  );
};

export default AccessibilityMap;
