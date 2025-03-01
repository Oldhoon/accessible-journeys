
import React, { useState, useCallback, useEffect } from 'react';
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);
  
  // Add debug logs
  useEffect(() => {
    console.log('Checking Google Maps availability:', window.google?.maps);
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) {
      console.log('Map or Google Maps API not available yet');
      return;
    }

    try {
      console.log('Initializing Google Map');
      const newMap = new google.maps.Map(mapRef.current, {
        center: currentLocation,
        zoom: GOOGLE_MAPS_CONFIG.defaultZoom,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });
      
      setMap(newMap);
      setMapLoaded(true);
      
      // Add current location marker
      new google.maps.Marker({
        position: currentLocation,
        map: newMap,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(30, 30)
        }
      });
      
      // Add map click listener
      newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng && onLocationSelect) {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          onLocationSelect(clickedLocation);
        }
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapLoadError(error instanceof Error ? error.message : 'Failed to load map');
    }
  }, [currentLocation, onLocationSelect]);

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
          
          // Center map on user location if map exists
          if (map) {
            map.setCenter(userLocation);
          }
          
          successFeedback();
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { timeout: 10000 }
      );
    }
  }, [map]);

  // Update markers on the map when markers state changes
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers (if any implementation needed)
    
    // Add new markers
    markers.forEach(marker => {
      const mapMarker = new google.maps.Marker({
        position: marker.position,
        map: map,
        title: marker.title,
        icon: {
          url: `https://maps.google.com/mapfiles/ms/icons/${getMarkerColor(marker.type)}-dot.png`,
          scaledSize: new google.maps.Size(25, 25)
        }
      });
      
      // Add click listener for marker
      mapMarker.addListener('click', () => {
        setSelectedMarker(marker);
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3 style="font-weight: 500;">${marker.title}</h3>
              <p style="color: #666;">${marker.type}</p>
            </div>
          `
        });
        
        infoWindow.open(map, mapMarker);
      });
    });
  }, [markers, map]);

  // Center on user location
  const handleCenterOnUser = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          
          if (map) {
            map.setCenter(newLocation);
          }
          
          successFeedback();
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [map]);

  // Handle zoom in
  const handleZoomIn = useCallback(() => {
    if (map) {
      const currentZoom = map.getZoom() || GOOGLE_MAPS_CONFIG.defaultZoom;
      map.setZoom(currentZoom + 1);
    }
  }, [map]);

  // Handle zoom out
  const handleZoomOut = useCallback(() => {
    if (map) {
      const currentZoom = map.getZoom() || GOOGLE_MAPS_CONFIG.defaultZoom;
      map.setZoom(currentZoom - 1);
    }
  }, [map]);

  if (mapLoadError) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        Error loading maps: {mapLoadError}
      </div>
    );
  }

  if (!mapLoaded) {
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
      <div ref={mapRef} className="w-full h-full"></div>

      {/* Map controls */}
      <div className="absolute bottom-28 left-4 flex flex-col gap-2">
        <button 
          className="fab bg-white text-foreground p-2 rounded-full shadow-medium"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <span className="text-xl font-bold">+</span>
        </button>
        
        <button 
          className="fab bg-white text-foreground p-2 rounded-full shadow-medium"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <span className="text-xl font-bold">−</span>
        </button>
      </div>
      
      <button 
        className="fab absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-white text-foreground p-3 rounded-full shadow-medium"
        onClick={handleCenterOnUser}
        aria-label="Center on current location"
      >
        <Navigation size={20} className="text-accessibility-blue" />
      </button>
    </div>
  );
};

// Helper function to get marker color based on type
const getMarkerColor = (type: string): string => {
  switch (type) {
    case 'wheelchair':
      return 'green';
    case 'elevator':
      return 'yellow';
    case 'ramp':
      return 'blue';
    default:
      return 'red';
  }
};

export default AccessibilityMap;
