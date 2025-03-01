
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Mic } from 'lucide-react';
import { buttonFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  className,
  placeholder = "Search for accessible places..."
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps && inputRef.current) {
      console.log('Initializing Places Autocomplete');
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment', 'geocode'],
        fields: ['formatted_address', 'geometry', 'name']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.name) {
          setQuery(place.name);
          onSearch(place.name);
          buttonFeedback();
        }
      });
    } else {
      console.log('Google Maps API not loaded yet');
    }
    
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onSearch]);

  const handleSearch = () => {
    if (query.trim()) {
      buttonFeedback();
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    buttonFeedback();
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleVoiceSearch = () => {
    buttonFeedback();
    // In a real implementation, this would trigger voice recognition
    console.log('Voice search triggered');
  };

  return (
    <div className={cn(
      'search-bar flex items-center p-2 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out max-w-md w-full',
      isFocused ? 'shadow-lg' : '',
      className
    )}>
      <button 
        onClick={handleSearch}
        className="p-2 text-muted-foreground"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-foreground px-2 py-1"
        aria-label="Search input"
      />
      
      {query ? (
        <button 
          onClick={handleClear}
          className="p-2 text-muted-foreground"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      ) : (
        <button 
          onClick={handleVoiceSearch}
          className="p-2 text-accessibility-blue"
          aria-label="Voice search"
        >
          <Mic size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
