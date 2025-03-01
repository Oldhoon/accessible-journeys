
/**
 * Utility functions for accessibility features
 */

export type AccessibilityFeature = 
  | 'wheelchair' 
  | 'elevator' 
  | 'ramp' 
  | 'braille' 
  | 'audio' 
  | 'parking'
  | 'toilet'
  | 'noStairs'
  | 'lowCounter'
  | 'wideEntrance';

export type AccessibilityRating = 1 | 2 | 3 | 4 | 5;

export interface AccessibilityReport {
  id: string;
  locationId: string;
  locationName: string;
  features: AccessibilityFeature[];
  rating: AccessibilityRating;
  comments: string;
  images?: string[];
  timestamp: number;
  userId: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  types: string[];
  reports?: AccessibilityReport[];
  averageRating?: number;
  features?: AccessibilityFeature[];
}

/**
 * Get the text description for an accessibility feature
 */
export const getFeatureLabel = (feature: AccessibilityFeature): string => {
  const labels: Record<AccessibilityFeature, string> = {
    wheelchair: 'Wheelchair Access',
    elevator: 'Elevator Available',
    ramp: 'Ramp Access',
    braille: 'Braille Signage',
    audio: 'Audio Guidance',
    parking: 'Accessible Parking',
    toilet: 'Accessible Toilet',
    noStairs: 'No Stairs',
    lowCounter: 'Low Counter',
    wideEntrance: 'Wide Entrance'
  };
  
  return labels[feature] || feature;
};

/**
 * Get the icon name for an accessibility feature
 * These would correspond to actual icon names in a real implementation
 */
export const getFeatureIcon = (feature: AccessibilityFeature): string => {
  const icons: Record<AccessibilityFeature, string> = {
    wheelchair: 'wheelchair',
    elevator: 'arrow-up-down',
    ramp: 'trending-up',
    braille: 'braille',
    audio: 'volume-2',
    parking: 'parking',
    toilet: 'bathroom',
    noStairs: 'stairs-off',
    lowCounter: 'align-end-horizontal',
    wideEntrance: 'door-open'
  };
  
  return icons[feature] || 'help-circle';
};

/**
 * Calculate the average accessibility rating from multiple reports
 */
export const calculateAverageRating = (reports: AccessibilityReport[]): number => {
  if (!reports || reports.length === 0) return 0;
  
  const sum = reports.reduce((total, report) => total + report.rating, 0);
  return Math.round((sum / reports.length) * 10) / 10; // Round to 1 decimal place
};

/**
 * Get the most common accessibility features from multiple reports
 */
export const getMostCommonFeatures = (reports: AccessibilityReport[]): AccessibilityFeature[] => {
  if (!reports || reports.length === 0) return [];
  
  const featureCounts = new Map<AccessibilityFeature, number>();
  
  reports.forEach(report => {
    report.features.forEach(feature => {
      const currentCount = featureCounts.get(feature) || 0;
      featureCounts.set(feature, currentCount + 1);
    });
  });
  
  // Sort features by frequency and return those reported by at least 50% of users
  const threshold = reports.length / 2;
  return Array.from(featureCounts.entries())
    .filter(([_, count]) => count >= threshold)
    .map(([feature, _]) => feature);
};

/**
 * Check if a route is accessible based on criteria
 */
export const isRouteAccessible = (
  route: any, // This would be a route object from a maps API
  criteria: AccessibilityFeature[]
): boolean => {
  // This is a mock implementation
  // In a real app, this would analyze the route for stairs, steep slopes, etc.
  
  // For demo purposes, let's say 70% of routes are accessible
  return Math.random() > 0.3;
};

/**
 * Generate voice guidance text for a direction
 */
export const generateVoiceGuidance = (
  direction: string,
  distance: number,
  unit: 'meters' | 'feet' = 'meters'
): string => {
  // Example implementation for generating spoken directions
  return `In ${distance} ${unit}, ${direction}`;
};
