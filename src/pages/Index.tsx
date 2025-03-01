
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import SearchBar from '@/components/SearchBar';
import AccessibilityMap from '@/components/AccessibilityMap';
import FilterButton from '@/components/FilterButton';
import SOSButton from '@/components/SOSButton';
import AppNavigation from '@/components/navigation/AppNavigation';
import { AccessibilityFeature } from '@/utils/accessibilityUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState<AccessibilityFeature[]>([]);
  
  const handleSearch = (query: string) => {
    // Navigate to search page with query
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  const handleFilterChange = (newFilters: AccessibilityFeature[]) => {
    setFilters(newFilters);
    
    if (newFilters.length > 0) {
      toast({
        title: "Filters Applied",
        description: `Showing places with ${newFilters.length} accessibility features`,
        duration: 2000,
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Header with logo - fixed position */}
      <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md z-10 px-4 py-3 flex items-center justify-center border-b border-border/50">
        <Logo />
      </header>
      
      {/* Map container - takes full height and width */}
      <AccessibilityMap />
      
      {/* Search bar - fixed position */}
      <SearchBar 
        onSearch={handleSearch} 
        className="top-16 left-1/2 transform -translate-x-1/2"
      />
      
      {/* Filter button - fixed at bottom right */}
      <FilterButton onFilterChange={handleFilterChange} />
      
      {/* SOS button - fixed at bottom right */}
      <SOSButton />
      
      {/* Navigation bar - fixed at bottom */}
      <AppNavigation />
    </div>
  );
};

export default Index;
