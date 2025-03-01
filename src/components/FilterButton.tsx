
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { buttonFeedback } from '@/utils/hapticFeedback';
import { AccessibilityFeature, getFeatureLabel } from '@/utils/accessibilityUtils';
import { cn } from '@/lib/utils';

interface FilterButtonProps {
  onFilterChange: (filters: AccessibilityFeature[]) => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onFilterChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<AccessibilityFeature[]>([]);

  const features: AccessibilityFeature[] = [
    'wheelchair', 'elevator', 'ramp', 'braille', 'audio',
    'parking', 'toilet', 'noStairs', 'lowCounter', 'wideEntrance'
  ];

  const toggleFilter = () => {
    buttonFeedback();
    setIsOpen(!isOpen);
  };

  const handleFeatureToggle = (feature: AccessibilityFeature) => {
    buttonFeedback();
    
    setSelectedFilters(prev => {
      const newFilters = prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature];
        
      // Notify parent component of filter changes
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <>
      <button 
        onClick={toggleFilter}
        className={cn(
          'fab bottom-28 right-4 bg-accessibility-blue text-white p-3 rounded-full z-10 flex items-center justify-center',
          selectedFilters.length > 0 ? 'bg-accessibility-blue' : 'bg-muted-foreground',
          className
        )}
        aria-label="Accessibility filters"
      >
        <Filter size={22} />
        {selectedFilters.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-accessibility-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {selectedFilters.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center animate-fade-in">
          <div className="glass-card w-full max-w-md mx-4 mb-24 p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Accessibility Filters</h3>
              <button 
                onClick={toggleFilter}
                className="p-2 text-muted-foreground rounded-full hover:bg-muted"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {features.map(feature => (
                <button
                  key={feature}
                  onClick={() => handleFeatureToggle(feature)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border transition-colors',
                    selectedFilters.includes(feature)
                      ? 'bg-accessibility-blue text-white border-accessibility-blue'
                      : 'bg-background border-border'
                  )}
                  aria-pressed={selectedFilters.includes(feature)}
                >
                  <span className="text-sm">{getFeatureLabel(feature)}</span>
                </button>
              ))}
            </div>
            
            {selectedFilters.length > 0 && (
              <button 
                onClick={() => {
                  buttonFeedback();
                  setSelectedFilters([]);
                  onFilterChange([]);
                }}
                className="w-full mt-4 p-2 text-sm text-accessibility-blue bg-transparent border border-accessibility-blue rounded-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterButton;
