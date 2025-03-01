import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Star } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import AppNavigation from '@/components/navigation/AppNavigation';
import { buttonFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';


// Define a type for the place results
interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating: number | 'N/A';
  distance: string; // Placeholder for distance
  features: string[];
  type: string;
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
        const response: AxiosResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
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
            type: place.types[0] // Get the primary type
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
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <p>{error}</p>
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
