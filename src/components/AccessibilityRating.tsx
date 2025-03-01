
import React from 'react';
import { Star } from 'lucide-react';
import { AccessibilityRating as RatingType } from '@/utils/accessibilityUtils';
import { buttonFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';

interface AccessibilityRatingProps {
  value: number;
  onChange?: (rating: RatingType) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const AccessibilityRating: React.FC<AccessibilityRatingProps> = ({
  value,
  onChange,
  size = 'md',
  readOnly = false,
  className,
}) => {
  const sizeMap = {
    sm: { starSize: 16, gap: 'gap-0.5' },
    md: { starSize: 20, gap: 'gap-1' },
    lg: { starSize: 24, gap: 'gap-1.5' },
  };
  
  const { starSize, gap } = sizeMap[size];
  
  const handleRatingChange = (rating: RatingType) => {
    if (readOnly) return;
    
    buttonFeedback();
    onChange?.(rating);
  };
  
  return (
    <div className={cn('rating-stars', gap, className)}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          onClick={() => handleRatingChange(rating as RatingType)}
          disabled={readOnly}
          className={cn(
            'focus:outline-none transition-transform',
            !readOnly && 'hover:scale-110 active:scale-90',
          )}
          aria-label={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
        >
          <Star
            size={starSize}
            className={cn(
              'transition-colors',
              rating <= value
                ? 'fill-accessibility-yellow text-accessibility-yellow'
                : 'fill-none text-accessibility-gray/40',
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default AccessibilityRating;
