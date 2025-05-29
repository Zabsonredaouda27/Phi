'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, 
  Map as MapIcon, 
  Plus, 
  Search, 
  MapPin, 
  Building, 
  Home, 
  Briefcase, 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Truck, 
  Share2, 
  Navigation, 
  X,
  Check,
  User,
  Clock
} from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[50vh] bg-blue-100 dark:bg-blue-800/30 rounded-xl flex items-center justify-center">
      <div className="text-blue-600 dark:text-blue-300 animate-pulse">Loading Map...</div>
    </div>
  ),
});

// Mock data for locations
const mockLocations = [
  {
    id: 1,
    name: "My Home",
    description: "My personal residence",
    address: "123 Main Street, Anytown",
    lat: 48.8584,
    lng: 2.2945,
    type: "personal",
    icon: "home",
    delivery: false,
    createdAt: "2023-05-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Café Quantum",
    description: "Best coffee in the multiverse",
    address: "456 Quantum Avenue, Anytown",
    lat: 48.8634,
    lng: 2.3325,
    type: "business",
    icon: "coffee",
    delivery: true,
    createdAt: "2023-05-10T14:20:00Z"
  },
  {
    id: 3,
    name: "PHI Headquarters",
    description: "Main office of PHI Technologies",
    address: "789 Innovation Boulevard, Techville",
    lat: 48.8674,
    lng: 2.3095,
    type: "business",
    icon: "building",
    delivery: false,
    createdAt: "2023-04-28T09:15:00Z"
  },
  {
    id: 4,
    name: "Multiverse Restaurant",
    description: "Cuisine from across the multiverse",
    address: "101 Parallel Street, Dimensionville",
    lat: 48.8605,
    lng: 2.3376,
    type: "business",
    icon: "utensils",
    delivery: true,
    createdAt: "2023-05-05T18:45:00Z"
  },
  {
    id: 5,
    name: "Quantum Market",
    description: "Grocery store with products from multiple realities",
    address: "202 Reality Lane, Quantumville",
    lat: 48.8744,
    lng: 2.3235,
    type: "business",
    icon: "shopping-bag",
    delivery: true,
    createdAt: "2023-05-12T11:10:00Z"
  }
];

// Mock data for tracking requests
const mockTrackingRequests = [
  {
    id: 1,
    from: "quantum_traveler",
    status: "pending",
    timestamp: "2 minutes ago"
  },
  {
    id: 2,
    from: "reality_shifter",
    status: "active",
    timestamp: "15 minutes ago",
    expiresIn: "45 minutes"
  }
];

// Mock data for active tracking
const mockActiveTracking = {
  id: 2,
  user: "reality_shifter",
  startTime: "15 minutes ago",
  expiresIn: "45 minutes",
  currentLocation: {
    lat: 48.8584,
    lng: 2.3089
  },
  destination: {
    name: "My Home",
    lat: 48.8584,
    lng: 2.2945
  },
  eta: "10 minutes"
};

export default function MapPhiPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'add', 'track'
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [locations, setLocations] = useState(mockLocations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    description: '',
    address: '',
    type: 'personal',
    delivery: false
  });
  const [trackingRequests, setTrackingRequests] = useState(mockTrackingRequests);
  const [activeTracking, setActiveTracking] = useState<any>(null);
  const [showTrackingDetails, setShowTrackingDetails] = useState(false);

  // Filter locations based on search query
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new location
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLocationObj = {
      id: locations.length + 1,
      ...newLocation,
      lat: 48.8584 + (Math.random() * 0.02 - 0.01), // Random location near Paris
      lng: 2.2945 + (Math.random() * 0.02 - 0.01),
      icon: newLocation.type === 'personal' ? 'home' : 
            newLocation.type === 'business' ? 'building' : 'map-pin',
      createdAt: new Date().toISOString()
    };
    
    setLocations([...locations, newLocationObj]);
    setNewLocation({
      name: '',
      description: '',
      address: '',
      type: 'personal',
      delivery: false
    });
    setIsAddingLocation(false);
    setActiveTab('map');
  };

  // Handle tracking request response
  const handleTrackingResponse = (requestId: number, accept: boolean) => {
    if (accept) {
      // Accept the request and start tracking
      setActiveTracking(mockActiveTracking);
      setShowTrackingDetails(true);
    }
    
    // Remove the request from the list
    setTrackingRequests(trackingRequests.filter(req => req.id !== requestId));
  };

  // Stop active tracking
  const stopTracking = () => {
    setActiveTracking(null);
    setShowTrackingDetails(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-blue-900/80 backdrop-blur-md shadow-sm p-4">
        <div className="max-w-1200 mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center justify-center p-2 rounded-full bg-blue-100 dark:bg-blue-800"
            >
              <ArrowLeft className="text-blue-600 dark:text-blue-300" size={20} />
            </button>
            <h1 className="ml-3 text-xl font-bold text-blue-700 dark:text-blue-200">Map φ</h1>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('map')}
              className={`p-2 rounded-full ${
                activeTab === 'map' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
              }`}
            >
              <MapIcon size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`p-2 rounded-full ${
                activeTab === 'add' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
              }`}
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('track')}
              className={`p-2 rounded-full ${
                activeTab === 'track' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
              } relative`}
            >
              <Navigation size={20} />
              {trackingRequests.some(req => req.status === 'pending') && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-1200 mx-auto p-4">
        {/* Map Tab */}
        {activeTab === 'map' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-300" size={18} />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-300"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
              <MapComponent 
                locations={filteredLocations} 
                onSelectLocation={setSelectedLocation}
                activeTracking={activeTracking}
              />
            </div>

            {/* Location List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                {searchQuery ? 'Search Results' : 'Saved Locations'}
              </h2>
              
              {filteredLocations.length === 0 ? (
                <div className="bg-white dark:bg-blue-800/50 rounded-xl p-4 text-center text-blue-600 dark:text-blue-300">
                  No locations found
                </div>
              ) : (
                filteredLocations.map(location => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white dark:bg-blue-800/50 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                      selectedLocation?.id === location.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-700/50 p-2 rounded-full mr-3">
                        {location.icon === 'home' && <Home className="text-blue-600 dark:text-blue-300" size={20} />}
                        {location.icon === 'building' && <Building className="text-blue-600 dark:text-blue-300" size={20} />}
                        {location.icon === 'coffee' && <Coffee className="text-blue-600 dark:text-blue-300" size={20} />}
                        {location.icon === 'utensils' && <Utensils className="text-blue-600 dark:text-blue-300" size={20} />}
                        {location.icon === 'shopping-bag' && <ShoppingBag className="text-blue-600 dark:text-blue-300" size={20} />}
                        {location.icon === 'map-pin' && <MapPin className="text-blue-600 dark:text-blue-300" size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-blue-700 dark:text-blue-200">{location.name}</h3>
                          {location.delivery && (
                            <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full flex items-center">
                              <Truck size={12} className="mr-1" />
                              Delivery
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">{location.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{location.address}</p>
                      </div>
                    </div>
                    
                    {selectedLocation?.id === location.id && (
                      <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-700/50 flex justify-between">
                        <button className="text-sm text-blue-600 dark:text-blue-300 flex items-center">
                          <Share2 size={16} className="mr-1" />
                          Share
                        </button>
                        {location.type === 'business' && (
                          <button className="text-sm text-blue-600 dark:text-blue-300 flex items-center">
                            {location.delivery ? (
                              <>
                                <Truck size={16} className="mr-1" />
                                Request Delivery
                              </>
                            ) : (
                              <>
                                <Navigation size={16} className="mr-1" />
                                Directions
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Add Location Tab */}
        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-blue-800/50 rounded-xl p-4 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">
              Add New Location
            </h2>
            
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="Location name"
                  required
                  className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                  Description
                </label>
                <textarea
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  placeholder="Full address"
                  required
                  className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                  Location Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLocation({...newLocation, type: 'personal'})}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      newLocation.type === 'personal'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                    }`}
                  >
                    <Home size={20} className="mr-2" />
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLocation({...newLocation, type: 'business'})}
                    className={`flex items-center justify-center p-3 rounded-lg ${
                      newLocation.type === 'business'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                    }`}
                  >
                    <Building size={20} className="mr-2" />
                    Business
                  </button>
                </div>
              </div>
              
              {newLocation.type === 'business' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="delivery"
                    checked={newLocation.delivery}
                    onChange={(e) => setNewLocation({...newLocation, delivery: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="delivery" className="ml-2 text-sm text-blue-700 dark:text-blue-200">
                    This business offers delivery services
                  </label>
                </div>
              )}
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className="flex-1 bg-gray-200 dark:bg-blue-900/50 text-gray-700 dark:text-gray-300 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Add Location
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'track' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {showTrackingDetails && activeTracking ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white dark:bg-blue-800/50 rounded-xl p-4 shadow-lg mb-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                      Active Tracking
                    </h3>
                    <button 
                      onClick={stopTracking}
                      className="text-red-500 dark:text-red-400 text-sm flex items-center"
                    >
                      <X size={16} className="mr-1" />
                      Stop
                    </button>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-700/50 p-2 rounded-full mr-3">
                      <User className="text-blue-600 dark:text-blue-300" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-200">
                        @{activeTracking.user}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Started {activeTracking.startTime} • Expires in {activeTracking.expiresIn}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-3 mb-3">
                    <div className="flex items-center mb-2">
                      <Clock className="text-blue-600 dark:text-blue-300 mr-2" size={16} />
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        ETA: <span className="font-semibold">{activeTracking.eta}</span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="text-blue-600 dark:text-blue-300 mr-2" size={16} />
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        Destination: <span className="font-semibold">{activeTracking.destination.name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      onClick={() => setShowTrackingDetails(false)}
                      className="text-sm text-blue-600 dark:text-blue-300"
                    >
                      View on map
                    </button>
                  </div>
                </motion.div>
              ) : activeTracking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-blue-100 dark:bg-blue-800/70 rounded-xl p-3 mb-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <User className="text-blue-600 dark:text-blue-300 mr-2" size={18} />
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Tracking <span className="font-semibold">@{activeTracking.user}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowTrackingDetails(true)}
                    className="text-xs text-blue-600 dark:text-blue-300 bg-white dark:bg-blue-700 px-2 py-1 rounded-full"
                  >
                    Details
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3">
              Tracking Requests
            </h2>
            
            {trackingRequests.length === 0 ? (
              <div className="bg-white dark:bg-blue-800/50 rounded-xl p-4 text-center text-blue-600 dark:text-blue-300">
                No pending tracking requests
              </div>
            ) : (
              <div className="space-y-3">
                {trackingRequests.map(request => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-blue-800/50 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-700/50 p-2 rounded-full mr-3">
                          <User className="text-blue-600 dark:text-blue-300" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-blue-700 dark:text-blue-200">
                            @{request.from}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {request.timestamp}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300' 
                          : 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300'
                      }`}>
                        {request.status === 'pending' ? 'Pending' : 'Active'}
                      </span>
                    </div>
                    
                    {request.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleTrackingResponse(request.id, false)}
                          className="flex-1 bg-gray-200 dark:bg-blue-900/50 text-gray-700 dark:text-gray-300 py-1.5 rounded-lg text-sm flex items-center justify-center"
                        >
                          <X size={16} className="mr-1" />
                          Decline
                        </button>
                        <button 
                          onClick={() => handleTrackingResponse(request.id, true)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-sm flex items-center justify-center"
                        >
                          <Check size={16} className="mr-1" />
                          Accept
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-blue-600 dark:text-blue-300">
                        Expires in {request.expiresIn}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3">
                Share Your Location
              </h2>
              
              <div className="bg-white dark:bg-blue-800/50 rounded-xl p-4 shadow-lg">
                <p className="text-blue-600 dark:text-blue-300 text-sm mb-3">
                  Share your real-time location with another PHI user
                </p>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="flex-1 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                    <Share2 size={18} className="mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}