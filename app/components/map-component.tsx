'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Home, 
  Building, 
  MapPin, 
  Coffee, 
  Utensils, 
  ShoppingBag,
  Navigation,
  Plus,
  Minus
} from 'lucide-react';

interface Location {
  id: number;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  icon: string;
  delivery: boolean;
}

interface MapComponentProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
  activeTracking?: any;
}

export default function MapComponent({ 
  locations, 
  onSelectLocation,
  activeTracking
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 50, y: 50 }); // Center position in percentage
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Simulate getting user location
  useEffect(() => {
    // Mock user location (Paris)
    setUserLocation({ lat: 48.8584, lng: 2.2945 });
  }, []);

  // Handle map zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  // Handle map dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = (e.clientX - dragStart.x) / (mapContainerRef.current?.clientWidth || 1) * 100 / zoom;
    const dy = (e.clientY - dragStart.y) / (mapContainerRef.current?.clientHeight || 1) * 100 / zoom;
    
    setCenter(prev => ({
      x: Math.max(0, Math.min(100, prev.x - dx)),
      y: Math.max(0, Math.min(100, prev.y - dy))
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const dx = (e.touches[0].clientX - dragStart.x) / (mapContainerRef.current?.clientWidth || 1) * 100 / zoom;
    const dy = (e.touches[0].clientY - dragStart.y) / (mapContainerRef.current?.clientHeight || 1) * 100 / zoom;
    
    setCenter(prev => ({
      x: Math.max(0, Math.min(100, prev.x - dx)),
      y: Math.max(0, Math.min(100, prev.y - dy))
    }));
    
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Convert lat/lng to x/y coordinates for our simplified map
  const getPositionFromLatLng = (lat: number, lng: number) => {
    // Simple conversion for demonstration
    // In a real app, you'd use proper map projection
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  // Get icon component based on icon type
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'home':
        return <Home size={16} />;
      case 'building':
        return <Building size={16} />;
      case 'coffee':
        return <Coffee size={16} />;
      case 'utensils':
        return <Utensils size={16} />;
      case 'shopping-bag':
        return <ShoppingBag size={16} />;
      default:
        return <MapPin size={16} />;
    }
  };

  // Get background color based on icon type
  const getIconBackground = (iconType: string) => {
    switch (iconType) {
      case 'home':
        return 'bg-blue-600';
      case 'building':
        return 'bg-purple-600';
      case 'coffee':
        return 'bg-yellow-600';
      case 'utensils':
        return 'bg-red-600';
      case 'shopping-bag':
        return 'bg-green-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainerRef}
        className="w-full h-[50vh] bg-blue-100 dark:bg-blue-800/30 rounded-xl overflow-hidden relative cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Map background with grid */}
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzgwODA4MCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"
          style={{
            transform: `scale(${zoom}) translate(${-center.x}%, ${-center.y}%)`,
            transformOrigin: 'top left'
          }}
        />

        {/* Map markers */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom}) translate(${-center.x}%, ${-center.y}%)`,
            transformOrigin: 'top left'
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <div 
              className="absolute"
              style={{
                left: `${getPositionFromLatLng(userLocation.lat, userLocation.lng).x}%`,
                top: `${getPositionFromLatLng(userLocation.lat, userLocation.lng).y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-md animate-pulse">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          )}

          {/* Location markers */}
          {locations.map(location => {
            const position = getPositionFromLatLng(location.lat, location.lng);
            return (
              <div 
                key={location.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => onSelectLocation(location)}
              >
                <div className={`w-8 h-8 rounded-full ${getIconBackground(location.icon)} text-white flex items-center justify-center shadow-md`}>
                  {getIconComponent(location.icon)}
                </div>
              </div>
            );
          })}

          {/* Active tracking */}
          {activeTracking && (
            <>
              {/* Tracking user marker */}
              <div 
                className="absolute"
                style={{
                  left: `${getPositionFromLatLng(activeTracking.currentLocation.lat, activeTracking.currentLocation.lng).x}%`,
                  top: `${getPositionFromLatLng(activeTracking.currentLocation.lat, activeTracking.currentLocation.lng).y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-md">
                  <Navigation size={16} className="text-white" />
                </div>
              </div>

              {/* Destination marker */}
              <div 
                className="absolute"
                style={{
                  left: `${getPositionFromLatLng(activeTracking.destination.lat, activeTracking.destination.lng).x}%`,
                  top: `${getPositionFromLatLng(activeTracking.destination.lat, activeTracking.destination.lng).y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-md">
                  <MapPin size={16} className="text-white" />
                </div>
              </div>

              {/* Line connecting them */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                <line 
                  x1={`${getPositionFromLatLng(activeTracking.currentLocation.lat, activeTracking.currentLocation.lng).x}%`}
                  y1={`${getPositionFromLatLng(activeTracking.currentLocation.lat, activeTracking.currentLocation.lng).y}%`}
                  x2={`${getPositionFromLatLng(activeTracking.destination.lat, activeTracking.destination.lng).x}%`}
                  y2={`${getPositionFromLatLng(activeTracking.destination.lat, activeTracking.destination.lng).y}%`}
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
              </svg>
            </>
          )}
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white dark:bg-blue-800 rounded-full shadow-md flex items-center justify-center text-blue-600 dark:text-blue-300"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white dark:bg-blue-800 rounded-full shadow-md flex items-center justify-center text-blue-600 dark:text-blue-300"
        >
          <Minus size={20} />
        </button>
      </div>

      {/* Map attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-blue-600 dark:text-blue-300 bg-white/70 dark:bg-blue-900/70 px-2 py-1 rounded">
        PHI Map φ | Drag to move, use buttons to zoom
      </div>
    </div>
  );
}