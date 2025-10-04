import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BukkaButton } from '@/components/ui/button-variants';
import { Filter, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface FilterDialogProps {
  children?: React.ReactNode;
  onFiltersChange?: (filters: any) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({ children, onFiltersChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    priceRange: [1, 4],
    distance: [5],
    rating: [4],
    openNow: false,
    categories: [] as string[],
    features: [] as string[]
  });

  const cuisineTypes = [
    'Nigerian', 'Italian', 'Chinese', 'Indian', 'Mexican', 
    'Japanese', 'American', 'Mediterranean', 'Thai', 'French'
  ];

  const features = [
    'Delivery', 'Takeout', 'Dine-in', 'Outdoor Seating', 
    'Parking', 'WiFi', 'Kid-friendly', 'Pet-friendly'
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange?.(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: [1, 4],
      distance: [5],
      rating: [1],
      openNow: false,
      categories: [],
      features: []
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <BukkaButton variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </BukkaButton>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Restaurants
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price Range
            </Label>
            <div className="px-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>$</span>
                <span>$$</span>
                <span>$$$</span>
                <span>$$$$</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Distance */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Distance (km)
            </Label>
            <div className="px-3">
              <Slider
                value={filters.distance}
                onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value }))}
                max={25}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground mt-1">
                Within {filters.distance[0]} km
              </div>
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Minimum Rating
            </Label>
            <div className="px-3">
              <Slider
                value={filters.rating}
                onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}
                max={5}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground mt-1">
                {filters.rating[0]}+ stars
              </div>
            </div>
          </div>

          <Separator />

          {/* Open Now */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="openNow"
              checked={filters.openNow}
              onCheckedChange={(checked) => 
                setFilters(prev => ({ ...prev, openNow: checked as boolean }))
              }
            />
            <Label htmlFor="openNow" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Open now
            </Label>
          </div>

          <Separator />

          {/* Cuisine Types */}
          <div className="space-y-3">
            <Label>Cuisine Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {cuisineTypes.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={cuisine}
                    checked={filters.categories.includes(cuisine)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(cuisine, checked as boolean)
                    }
                  />
                  <Label htmlFor={cuisine} className="text-sm">
                    {cuisine}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-3">
            <Label>Features</Label>
            <div className="grid grid-cols-2 gap-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={(checked) => 
                      handleFeatureChange(feature, checked as boolean)
                    }
                  />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <BukkaButton variant="outline" onClick={resetFilters} className="flex-1">
            Reset
          </BukkaButton>
          <BukkaButton variant="hero" onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </BukkaButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};