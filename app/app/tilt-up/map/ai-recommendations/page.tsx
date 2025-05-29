'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  Search, 
  MapPin, 
  Compass, 
  Route, 
  Clock, 
  Star, 
  Coffee, 
  Utensils, 
  Hotel, 
  ShoppingBag, 
  Camera, 
  Loader2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';


// Sample locations
const sampleLocations = [
  { id: 1, name: "Paris, France" },
  { id: 2, name: "Tokyo, Japan" },
  { id: 3, name: "New York City, USA" },
  { id: 4, name: "Rome, Italy" },
  { id: 5, name: "Sydney, Australia" },
  { id: 6, name: "Cairo, Egypt" },
  { id: 7, name: "Rio de Janeiro, Brazil" },
  { id: 8, name: "London, UK" },
  { id: 9, name: "Bangkok, Thailand" },
  { id: 10, name: "Vancouver, Canada" }
];

// Sample interests
const sampleInterests = [
  { id: 'food', name: "Food & Dining", icon: <Utensils size={16} /> },
  { id: 'coffee', name: "Cafes", icon: <Coffee size={16} /> },
  { id: 'hotel', name: "Accommodation", icon: <Hotel size={16} /> },
  { id: 'shopping', name: "Shopping", icon: <ShoppingBag size={16} /> },
  { id: 'sightseeing', name: "Sightseeing", icon: <Camera size={16} /> }
];

export default function MapAiRecommendations() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [days, setDays] = useState(3);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(true);

  useEffect(() => {
  }, []);

  // Toggle interest selection
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  // Generate recommendations with AI
  const generateRecommendations = async () => {
    if (!location) {
      setError('Please select a location.');
      return;
    }

    if (!isApiKeyConfigured) {
      return;
    }

    setIsLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const interestsText = selectedInterests.length > 0
        ? `with a focus on ${selectedInterests.map(id => {
            const interest = sampleInterests.find(i => i.id === id);
            return interest ? interest.name.toLowerCase() : id;
          }).join(', ')}`
        : '';

      const prompt = `
Create a ${days}-day travel itinerary for ${location} ${interestsText}. 
For each day, suggest:
1. Morning activities
2. Lunch recommendations
3. Afternoon activities
4. Dinner recommendations
5. Evening activities or entertainment

Include specific locations, estimated times, and brief descriptions. Format the response with clear headings for each day and each time period.
`;

      // Mock recommendations result since OpenAI integration was removed
      const result = `
# ${days}-Day Itinerary for ${location}

## Day 1
**Morning (9:00 AM - 12:00 PM)**
- Start your adventure with a visit to the main attractions
- Explore the historic city center
- Take photos at iconic landmarks

**Lunch (12:00 PM - 1:30 PM)**
- Try local cuisine at a recommended restaurant
- Experience authentic flavors of the region

**Afternoon (1:30 PM - 6:00 PM)**
- Visit museums or cultural sites
- Explore local markets and shops
- Take a guided tour if available

**Dinner (7:00 PM - 9:00 PM)**
- Dine at a highly-rated local restaurant
- Enjoy traditional dishes and local specialties

**Evening (9:00 PM onwards)**
- Experience the nightlife
- Take an evening stroll through illuminated areas
- Relax at a local café or bar

${days > 1 ? `
## Day 2
**Morning (9:00 AM - 12:00 PM)**
- Explore different neighborhoods
- Visit parks or natural attractions
- Enjoy outdoor activities

**Lunch (12:00 PM - 1:30 PM)**
- Try a different style of local cuisine
- Visit a popular local eatery

**Afternoon (1:30 PM - 6:00 PM)**
- Continue exploring cultural sites
- Shopping for souvenirs
- Visit art galleries or exhibitions

**Dinner (7:00 PM - 9:00 PM)**
- Experience fine dining
- Try regional specialties

**Evening (9:00 PM onwards)**
- Attend local entertainment
- Explore evening markets
- Enjoy local nightlife
` : ''}

${days > 2 ? `
## Day 3 and beyond
Continue exploring with day trips to nearby attractions, more cultural experiences, and deeper dives into local traditions and cuisine.
` : ''}

*Note: This is a sample itinerary. For personalized AI-powered recommendations, please configure the OpenAI integration.*
      `;
      setRecommendations(result);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please check your API key or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 p-4">
      <div className="max-w-1200 mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            <Map className="text-blue-600 dark:text-blue-300 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-200">Map φ AI Recommendations</h1>
          </div>
          <button 
            onClick={() => router.push('/tilt-up')}
            className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg"
          >
            Back to Map
          </button>
        </motion.div>



        {error && (
          <div className="flex items-center bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4 flex items-center">
            <Compass className="mr-2" size={20} />
            Travel Planner
          </h2>
          
          {/* Location Selection */}
          <div className="mb-6">
            <label className="block text-blue-700 dark:text-blue-200 mb-2">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400" size={18} />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a location</option>
                {sampleLocations.map(loc => (
                  <option key={loc.id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Interests Selection */}
          <div className="mb-6">
            <label className="block text-blue-700 dark:text-blue-200 mb-2">
              Interests (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleInterests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <span className="mr-1">{interest.icon}</span>
                  {interest.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Trip Duration */}
          <div className="mb-6">
            <label className="block text-blue-700 dark:text-blue-200 mb-2">
              Trip Duration (Days)
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                disabled={days <= 1}
                className={`p-2 rounded-lg ${
                  days <= 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                }`}
              >
                -
              </button>
              <div className="flex-1 text-center text-blue-700 dark:text-blue-200 text-lg font-semibold">
                {days} {days === 1 ? 'Day' : 'Days'}
              </div>
              <button
                onClick={() => setDays(Math.min(14, days + 1))}
                disabled={days >= 14}
                className={`p-2 rounded-lg ${
                  days >= 14
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                }`}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Generate Button */}
          <button
            onClick={generateRecommendations}
            disabled={!location || isLoading || !isApiKeyConfigured}
            className={`w-full ${
              !location || isLoading || !isApiKeyConfigured
                ? 'bg-blue-300 dark:bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-3 rounded-lg flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <Sparkles size={20} className="mr-2" />
                Generate AI Recommendations
              </>
            )}
          </button>
        </motion.div>

        {/* Recommendations Results */}
        <AnimatePresence>
          {recommendations && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-4 flex items-center">
                <Route className="mr-2" size={24} />
                Your {days}-Day Itinerary for {location}
              </h2>
              
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: recommendations.replace(/\n/g, '<br />') 
                }} />
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg"
                >
                  Print Itinerary
                </button>
                <button
                  onClick={() => {
                    setRecommendations(null);
                    setLocation('');
                    setSelectedInterests([]);
                    setDays(3);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Plan Another Trip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}