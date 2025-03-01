
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Camera, Upload, Check } from 'lucide-react';
import AppNavigation from '@/components/navigation/AppNavigation';
import AccessibilityRating from '@/components/AccessibilityRating';
import { 
  AccessibilityFeature, 
  AccessibilityRating as RatingType,
  getFeatureLabel
} from '@/utils/accessibilityUtils';
import { buttonFeedback, successFeedback } from '@/utils/hapticFeedback';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [locationName, setLocationName] = useState('');
  const [rating, setRating] = useState<RatingType>(3);
  const [comments, setComments] = useState('');
  const [features, setFeatures] = useState<AccessibilityFeature[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const accessibilityFeatures: AccessibilityFeature[] = [
    'wheelchair', 'elevator', 'ramp', 'braille', 'audio',
    'parking', 'toilet', 'noStairs', 'lowCounter', 'wideEntrance'
  ];
  
  const handleBack = () => {
    buttonFeedback();
    navigate(-1);
  };
  
  const toggleFeature = (feature: AccessibilityFeature) => {
    buttonFeedback();
    
    setFeatures(prev => {
      if (prev.includes(feature)) {
        return prev.filter(f => f !== feature);
      } else {
        return [...prev, feature];
      }
    });
  };
  
  const handleImageUpload = () => {
    buttonFeedback();
    
    // Simulate image upload with placeholder images
    // In a real app, this would use a file picker and real image upload
    const newImage = `/placeholder.svg`;
    setImages(prev => [...prev, newImage]);
    
    toast({
      title: "Image Added",
      description: "Your accessibility photo has been added to the report",
      duration: 2000,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationName) {
      toast({
        title: "Error",
        description: "Please enter a location name",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      successFeedback();
      
      toast({
        title: "Report Submitted",
        description: "Thank you for contributing to accessibility data!",
        duration: 3000,
      });
      
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 text-foreground button-animation"
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-lg font-medium ml-2">Accessibility Report</h1>
          </div>
        </div>
      </header>
      
      {/* Report form */}
      <main className="px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location name */}
          <div className="space-y-2">
            <label htmlFor="locationName" className="block text-sm font-medium">
              Location Name*
            </label>
            <div className="relative">
              <MapPin 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                id="locationName"
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter location name"
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-accessibility-blue"
                required
              />
            </div>
          </div>
          
          {/* Accessibility rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Accessibility Rating
            </label>
            <div className="flex justify-center py-2">
              <AccessibilityRating 
                value={rating} 
                onChange={setRating}
                size="lg"
              />
            </div>
          </div>
          
          {/* Accessibility features */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Accessibility Features
            </label>
            <div className="grid grid-cols-2 gap-2">
              {accessibilityFeatures.map(feature => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border transition-colors text-left',
                    features.includes(feature)
                      ? 'bg-accessibility-blue text-white border-accessibility-blue'
                      : 'bg-background border-border'
                  )}
                  aria-pressed={features.includes(feature)}
                >
                  {features.includes(feature) && (
                    <Check size={16} className="flex-shrink-0" />
                  )}
                  <span className="text-sm">{getFeatureLabel(feature)}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Comments */}
          <div className="space-y-2">
            <label htmlFor="comments" className="block text-sm font-medium">
              Comments
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share details about the accessibility of this location..."
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-accessibility-blue min-h-[100px]"
            />
          </div>
          
          {/* Image uploads */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Upload Photos
            </label>
            
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div 
                  key={index}
                  className="w-20 h-20 rounded-md bg-muted overflow-hidden border border-border"
                >
                  <img 
                    src={img} 
                    alt={`Accessibility photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleImageUpload}
                className="w-20 h-20 rounded-md border border-dashed border-input flex flex-col items-center justify-center text-muted-foreground"
              >
                <Camera size={18} />
                <span className="text-xs mt-1">Add</span>
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Add photos showing accessibility features or barriers
            </p>
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3 rounded-lg font-medium button-animation',
              isSubmitting
                ? 'bg-muted text-muted-foreground'
                : 'bg-accessibility-blue text-white'
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Upload size={18} className="animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Accessibility Report'
            )}
          </button>
        </form>
      </main>
      
      <AppNavigation />
    </div>
  );
};

export default ReportPage;
