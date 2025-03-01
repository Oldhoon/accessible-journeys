
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Star } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import AppNavigation from '@/components/navigation/AppNavigation';
import { buttonFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';

// Mock search results
const mockResults = [
  {
    id: '1',
    name: 'Central Park',
    address: '59th to 110th Street, New York, NY',
    rating: 4.5,
    distance: '0.5 miles',
    features: ['wheelchair', 'parking', 'toilet'],
    type: 'park'
  },
  {
    id: '2',
    name: 'Accessible Café',
    address: '123 Main Street, New York, NY',
    rating: 4.8,
    distance: '0.7 miles',
    features: ['wheelchair', 'ramp', 'toilet', 'lowCounter'],
    type: 'cafe'
  },
  {
    id: '3',
    name: 'Community Library',
    address: '456 Book Avenue, New York, NY',
    rating: 4.2,
    distance: '1.2 miles',
    features: ['wheelchair', 'elevator', 'braille', 'audio'],
    type: 'library'
  },
  {
    id: '4',
    name: 'Public Transit Hub',
    address: '789 Transit Road, New York, NY',
    rating: 3.9,
    distance: '0.8 miles',
    features: ['wheelchair', 'elevator', 'audio'],
    type: 'transit'
  },
  {
    id: '5',
    name: 'Shopping Center',
    address: '101 Retail Lane, New York, NY',
    rating: 4.0,
    distance: '1.5 miles',
    features: ['wheelchair', 'elevator', 'parking', 'toilet'],
    type: 'shopping'
  }
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    // Simulate loading search results
    setLoading(true);
    
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [query]);
  
  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };
  
  const handleBack = () => {
    buttonFeedback();
    navigate(-1);
  };
  
  const handleResultClick = (id: string) => {
    buttonFeedback();
    // In a real app, this would navigate to a details page
    console.log('Navigating to details for:', id);
  };
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/50">
        <div className="flex items-center px-4 h-14">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 text-foreground button-animation"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-medium ml-2">Search Results</h1>
        </div>
        
        <div className="px-4 pb-4">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Change location or search again..."
            className="static transform-none w-full shadow-none"
          />
        </div>
      </header>
      
      {/* Search results */}
      <main className="px-4 pt-4">
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-slate-200 h-10 w-10 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-48 mb-1"></div>
              <div className="h-3 bg-slate-200 rounded w-32"></div>
            </div>
            <p className="text-muted-foreground mt-3">Finding accessible places...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                {results.length} accessible places found for "{query}"
              </p>
            </div>
            
            <div className="space-y-3">
              {results.map((result) => (
                <div 
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="p-4 bg-card rounded-lg border border-border shadow-subtle transition-all hover:shadow-medium active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{result.name}</h3>
                    <div className="flex items-center gap-1 text-accessibility-yellow">
                      <Star size={14} className="fill-current" />
                      <span className="text-sm">{result.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{result.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Clock size={14} className="mr-1 flex-shrink-0" />
                    <span>{result.distance} away</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {result.features.map((feature: string) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 bg-secondary text-xs rounded-full"
                      >
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      
      <AppNavigation />
    </div>
  );
};

export default SearchPage;
