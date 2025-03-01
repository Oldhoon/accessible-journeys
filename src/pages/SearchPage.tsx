import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Star } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import AppNavigation from '@/components/navigation/AppNavigation';
import axios from 'axios';

// Define a type for the place results
interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating: number | 'N/A';
  distance: string; // Placeholder for distance
  features: string[];
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
          params: {
            query: query,
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Use environment variable
          }
        });

        // Check if results are available
        if (response.data.results) {
          const formattedResults = response.data.results.map((place: any) => ({
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating || 'N/A',
            distance: 'Unknown', // Placeholder for distance
            features: place.types, // You can map types to your features
          }));
          setResults(formattedResults);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Failed to fetch results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleResultClick = (id: string) => {
    console.log('Navigating to details for:', id);
  };
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/50">
        <div className="flex items-center px-4 h-14">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 text-foreground"
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
            className="w-full"
          />
        </div>
      </header>
      
      {/* Search results */}
      <main className="px-4 pt-4">
        {loading ? (
          <div className="py-8 text-center">
            <p>Finding accessible places...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p>{results.length} accessible places found for "{query}"</p>
            </div>
            
            <div className="space-y-3">
              {results.map((result) => (
                <div 
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="p-4 bg-card rounded-lg border border-border shadow-subtle transition-all hover:shadow-medium cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{result.name}</h3>
                    <div className="flex items-center gap-1 text-accessibility-yellow">
                      <Star size={14} />
                      <span>{result.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin size={14} className="mr-1" />
                    <span>{result.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Clock size={14} className="mr-1" />
                    <span>{result.distance}</span>
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
