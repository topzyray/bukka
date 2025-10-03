import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

// For now using a demo token - user should replace with their own
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface MapWrapperProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    name: string;
    address: string;
  }>;
  onLocationSelect?: (coordinates: [number, number]) => void;
  className?: string;
}

const MapWrapper: React.FC<MapWrapperProps> = ({
  center = [-3.435973, 55.378051], // Default to Edinburgh
  zoom = 12,
  markers = [],
  onLocationSelect,
  className = "w-full h-full"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler for location selection
    if (onLocationSelect) {
      map.current.on('click', (e) => {
        onLocationSelect([e.lngLat.lng, e.lngLat.lat]);
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [center, zoom, onLocationSelect]);

  // Update markers when they change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    markers.forEach(marker => {
      if (map.current) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div>
            <h3 class="font-semibold">${marker.name}</h3>
            <p class="text-sm text-gray-600">${marker.address}</p>
          </div>`
        );

        new mapboxgl.Marker()
          .setLngLat(marker.coordinates)
          .setPopup(popup)
          .addTo(map.current);
      }
    });
  }, [markers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement geocoding search
    console.log('Searching for:', searchValue);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search overlay */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search places..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-background/95 backdrop-blur-sm"
          />
        </form>
      </div>

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Location notice */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Click on the map to select a location</span>
        </div>
      </div>
    </div>
  );
};

export default MapWrapper;