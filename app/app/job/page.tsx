'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Briefcase, 
  Building, 
  User, 
  Search, 
  MapPin, 
  Clock, 
  Filter, 
  Plus, 
  Edit, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  StarHalf, 
  Send, 
  X, 
  Check, 
  Upload, 
  Calendar, 
  DollarSign, 
  Users, 
  Bookmark, 
  Share2, 
  Settings
} from 'lucide-react';

// Mock data for jobs
const mockJobs = [
  {
    id: 1,
    title: "Quantum Reality Engineer",
    company: "PHI Technologies",
    location: "Paris, France",
    distance: "2.5 km",
    type: "Full-time",
    salary: "€60,000 - €80,000",
    posted: "2 days ago",
    description: "Join our team of reality engineers to develop cutting-edge multiverse navigation technologies. You'll work on expanding PHI's capabilities across different realities.",
    requirements: [
      "3+ years experience in quantum computing",
      "Knowledge of multiverse theory",
      "Experience with reality manipulation algorithms",
      "Strong problem-solving skills"
    ],
    logo: "/ChatPHI.png",
    companyRating: 4.8,
    applications: 12,
    saved: false
  },
  {
    id: 2,
    title: "Multiverse Data Analyst",
    company: "Quantum Insights",
    location: "Remote (Any Reality)",
    distance: "Virtual",
    type: "Contract",
    salary: "€50 - €70 per hour",
    posted: "1 week ago",
    description: "Analyze data patterns across multiple realities to identify trends and opportunities for our clients. This role requires strong analytical skills and the ability to work with interdimensional datasets.",
    requirements: [
      "Bachelor's in Data Science or related field",
      "Experience with multidimensional data analysis",
      "Proficiency in Python and R",
      "Strong visualization skills"
    ],
    logo: "/ChatPHI.png",
    companyRating: 4.2,
    applications: 8,
    saved: true
  },
  {
    id: 3,
    title: "Reality Interface Designer",
    company: "Dimension UX",
    location: "Lyon, France",
    distance: "150 km",
    type: "Full-time",
    salary: "€55,000 - €75,000",
    posted: "3 days ago",
    description: "Design intuitive interfaces for users navigating between different realities. Focus on creating seamless transitions and consistent experiences across the multiverse.",
    requirements: [
      "5+ years of UX/UI design experience",
      "Portfolio showcasing interface designs",
      "Experience with AR/VR technologies",
      "Understanding of human perception across realities"
    ],
    logo: "/ChatPHI.png",
    companyRating: 4.5,
    applications: 15,
    saved: false
  },
  {
    id: 4,
    title: "Interdimensional Logistics Coordinator",
    company: "MultiShip Express",
    location: "Marseille, France",
    distance: "300 km",
    type: "Part-time",
    salary: "€35,000 - €45,000",
    posted: "5 days ago",
    description: "Coordinate the movement of goods and services across different realities. Ensure timely delivery and compliance with interdimensional trade regulations.",
    requirements: [
      "Experience in logistics or supply chain management",
      "Knowledge of interdimensional trade laws",
      "Strong organizational skills",
      "Ability to work under pressure"
    ],
    logo: "/ChatPHI.png",
    companyRating: 3.9,
    applications: 6,
    saved: false
  },
  {
    id: 5,
    title: "Quantum Security Specialist",
    company: "SecureVerse",
    location: "Toulouse, France",
    distance: "250 km",
    type: "Full-time",
    salary: "€70,000 - €90,000",
    posted: "1 day ago",
    description: "Protect our systems from interdimensional threats and ensure the security of data across multiple realities. Develop and implement security protocols for multiverse navigation.",
    requirements: [
      "5+ years in cybersecurity",
      "Experience with quantum encryption",
      "Knowledge of interdimensional threat vectors",
      "Certification in security protocols"
    ],
    logo: "/ChatPHI.png",
    companyRating: 4.7,
    applications: 9,
    saved: true
  }
];

// Mock data for user profile (prouφ)
const mockUserProfile = {
  name: "Alex Quantum",
  title: "Multiverse Navigator",
  description: "Experienced in traversing multiple realities with a focus on data collection and analysis across dimensions.",
  location: "Paris, France",
  skills: ["Quantum Computing", "Reality Manipulation", "Data Analysis", "Interdimensional Communication"],
  experience: [
    {
      title: "Senior Reality Engineer",
      company: "Dimension Labs",
      period: "2020 - Present",
      description: "Developed algorithms for seamless reality transitions."
    },
    {
      title: "Multiverse Analyst",
      company: "Quantum Insights",
      period: "2018 - 2020",
      description: "Analyzed data patterns across multiple realities."
    }
  ],
  education: [
    {
      degree: "Ph.D. in Quantum Physics",
      institution: "University of Reality Studies",
      year: "2018"
    },
    {
      degree: "B.Sc. in Computer Science",
      institution: "Tech University",
      year: "2014"
    }
  ],
  profileImage: "/ChatPHI.png"
};

// Mock data for job applications
const mockApplications = [
  {
    id: 1,
    jobId: 1, // Reference to the job ID
    jobTitle: "Quantum Reality Engineer",
    company: "PHI Technologies",
    status: "Applied",
    date: "2023-05-15",
    logo: "/ChatPHI.png"
  },
  {
    id: 2,
    jobId: 2, // Reference to the job ID
    jobTitle: "Multiverse Data Analyst",
    company: "Quantum Insights",
    status: "Interview",
    date: "2023-05-10",
    logo: "/ChatPHI.png"
  },
  {
    id: 3,
    jobId: 3, // Reference to the job ID
    jobTitle: "Reality Interface Designer",
    company: "Dimension UX",
    status: "Rejected",
    date: "2023-05-05",
    logo: "/ChatPHI.png"
  }
];

// Define the application type
interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  status: string;
  date: string;
  logo: string;
}

export default function JobPhiPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'candidate' | 'employer' | null>(null);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'applications', 'profile', 'post'
  const [jobs, setJobs] = useState(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistance, setFilterDistance] = useState<number>(50);
  const [filterType, setFilterType] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: 'Your Company',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: ['']
  });

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'All' || job.type === filterType;
    
    // Parse distance (remove "km" and convert to number)
    const distanceValue = job.distance === "Virtual" ? 0 : parseFloat(job.distance.replace(" km", ""));
    const matchesDistance = distanceValue <= filterDistance;
    
    return matchesSearch && matchesType && matchesDistance;
  });

  // Handle job application
  const handleApplyJob = (jobId: number) => {
    // Check if already applied
    if (applications.some(app => app.jobId === jobId)) {
      alert("You've already applied to this job!");
      return;
    }
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newApplication: Application = {
        id: applications.length + 1,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: "Applied",
        date: new Date().toISOString().split('T')[0],
        logo: job.logo
      };
      
      setApplications([...applications, newApplication]);
      setSelectedJob(null);
      setActiveTab('applications');
    }
  };

  // Handle saving/unsaving a job
  const handleSaveJob = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  // Handle profile update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(editedProfile);
    setIsEditingProfile(false);
  };

  // Handle adding a new job (for employers)
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJobObj = {
      id: jobs.length + 1,
      ...newJob,
      distance: "0 km",
      posted: "Just now",
      logo: "/ChatPHI.png",
      companyRating: 0,
      applications: 0,
      saved: false
    };
    
    setJobs([newJobObj, ...jobs]);
    setShowJobForm(false);
    setNewJob({
      title: '',
      company: 'Your Company',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: ['']
    });
  };

  // Add a requirement field in the job form
  const addRequirement = () => {
    setNewJob({
      ...newJob,
      requirements: [...newJob.requirements, '']
    });
  };

  // Update a requirement field in the job form
  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...newJob.requirements];
    updatedRequirements[index] = value;
    setNewJob({
      ...newJob,
      requirements: updatedRequirements
    });
  };

  // Remove a requirement field from the job form
  const removeRequirement = (index: number) => {
    const updatedRequirements = newJob.requirements.filter((_, i) => i !== index);
    setNewJob({
      ...newJob,
      requirements: updatedRequirements
    });
  };

  // If user type is not selected, show selection screen
  if (!userType) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 p-4">
        <div className="max-w-1200 mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center mb-8"
          >
            <button 
              onClick={() => router.push('/')}
              className="flex items-center justify-center p-2 rounded-full bg-white dark:bg-blue-800 shadow-md"
            >
              <ArrowLeft className="text-blue-600 dark:text-blue-300" size={24} />
            </button>
            <h1 className="ml-4 text-3xl font-bold text-blue-700 dark:text-blue-200">Job φ</h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-blue-800/50 rounded-2xl shadow-lg p-6 mb-8 text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-700/50 p-4 rounded-full">
                <Briefcase className="text-blue-600 dark:text-blue-300" size={40} />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-6">
              Welcome to Job φ
            </h2>
            
            <p className="text-blue-600 dark:text-blue-300 mb-8">
              Please select how you want to use Job φ:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType('candidate')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-md flex flex-col items-center"
              >
                <User size={40} className="mb-4" />
                <h3 className="text-lg font-semibold mb-2">I'm a Candidate</h3>
                <p className="text-sm opacity-90">
                  Create your prouφ, search for jobs, and apply to positions
                </p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType('employer')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-md flex flex-col items-center"
              >
                <Building size={40} className="mb-4" />
                <h3 className="text-lg font-semibold mb-2">I'm an Employer</h3>
                <p className="text-sm opacity-90">
                  Post job openings and manage applications from candidates
                </p>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

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
            <h1 className="ml-3 text-xl font-bold text-blue-700 dark:text-blue-200">Job φ</h1>
          </div>
          
          <div className="flex space-x-2">
            {userType === 'candidate' ? (
              <>
                <button 
                  onClick={() => setActiveTab('jobs')}
                  className={`p-2 rounded-full ${
                    activeTab === 'jobs' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <Briefcase size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('applications')}
                  className={`p-2 rounded-full ${
                    activeTab === 'applications' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <Send size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`p-2 rounded-full ${
                    activeTab === 'profile' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <User size={20} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('jobs')}
                  className={`p-2 rounded-full ${
                    activeTab === 'jobs' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <Briefcase size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('applications')}
                  className={`p-2 rounded-full ${
                    activeTab === 'applications' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <Users size={20} />
                </button>
                <button 
                  onClick={() => setActiveTab('post')}
                  className={`p-2 rounded-full ${
                    activeTab === 'post' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <Plus size={20} />
                </button>
              </>
            )}
            <button 
              onClick={() => setUserType(null)}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-1200 mx-auto p-4">
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
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
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-300" size={18} />
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-300"
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-blue-800/50 rounded-xl p-4 mb-4 shadow-sm overflow-hidden"
                >
                  <h3 className="text-blue-700 dark:text-blue-200 font-medium mb-3">Filters</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-blue-600 dark:text-blue-300 mb-1">
                        Maximum Distance: {filterDistance} km
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={filterDistance}
                        onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-blue-600 dark:text-blue-300 mb-1">
                        Job Type
                      </label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Job List */}
            <AnimatePresence mode="wait">
              {selectedJob ? (
                <motion.div
                  key="job-detail"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-blue-100 dark:border-blue-700/50 flex items-center justify-between">
                    <button 
                      onClick={() => setSelectedJob(null)}
                      className="flex items-center text-blue-600 dark:text-blue-300"
                    >
                      <ArrowLeft size={18} className="mr-1" />
                      <span>Back to jobs</span>
                    </button>
                    
                    <button 
                      onClick={() => handleSaveJob(selectedJob.id)}
                      className={`p-2 rounded-full ${
                        selectedJob.saved 
                          ? 'bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300' 
                          : 'bg-gray-100 dark:bg-blue-900/30 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Bookmark size={18} fill={selectedJob.saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start mb-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white mr-3 flex-shrink-0">
                        <Image
                          src={selectedJob.logo}
                          alt={selectedJob.company}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-blue-700 dark:text-blue-200">
                          {selectedJob.title}
                        </h2>
                        <div className="flex items-center text-blue-600 dark:text-blue-300 text-sm">
                          <span>{selectedJob.company}</span>
                          <span className="mx-1">•</span>
                          <div className="flex items-center">
                            {Array.from({ length: Math.floor(selectedJob.companyRating) }).map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                            {selectedJob.companyRating % 1 !== 0 && (
                              <StarHalf size={14} fill="currentColor" />
                            )}
                            <span className="ml-1">{selectedJob.companyRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                        <div className="flex items-center text-blue-600 dark:text-blue-300 text-sm mb-1">
                          <MapPin size={14} className="mr-1" />
                          <span>Location</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-200 font-medium">
                          {selectedJob.location}
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400">
                          {selectedJob.distance}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                        <div className="flex items-center text-blue-600 dark:text-blue-300 text-sm mb-1">
                          <Briefcase size={14} className="mr-1" />
                          <span>Job Type</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-200 font-medium">
                          {selectedJob.type}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                        <div className="flex items-center text-blue-600 dark:text-blue-300 text-sm mb-1">
                          <DollarSign size={14} className="mr-1" />
                          <span>Salary</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-200 font-medium">
                          {selectedJob.salary}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                        <div className="flex items-center text-blue-600 dark:text-blue-300 text-sm mb-1">
                          <Clock size={14} className="mr-1" />
                          <span>Posted</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-200 font-medium">
                          {selectedJob.posted}
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400">
                          {selectedJob.applications} applications
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                        Job Description
                      </h3>
                      <p className="text-blue-600 dark:text-blue-300">
                        {selectedJob.description}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {selectedJob.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 dark:text-blue-400 mr-2">•</span>
                            <span className="text-blue-600 dark:text-blue-300">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleSaveJob(selectedJob.id)}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center ${
                          selectedJob.saved 
                            ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
                            : 'bg-gray-100 dark:bg-blue-900/30 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Bookmark size={18} className="mr-2" fill={selectedJob.saved ? 'currentColor' : 'none'} />
                        {selectedJob.saved ? 'Saved' : 'Save'}
                      </button>
                      
                      {userType === 'candidate' && (
                        <button 
                          onClick={() => handleApplyJob(selectedJob.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center"
                        >
                          <Send size={18} className="mr-2" />
                          Apply with prouφ
                        </button>
                      )}
                      
                      {userType === 'employer' && (
                        <button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center"
                        >
                          <Edit size={18} className="mr-2" />
                          Edit Job
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="job-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {userType === 'employer' && (
                    <div className="mb-4">
                      <button 
                        onClick={() => setShowJobForm(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center"
                      >
                        <Plus size={18} className="mr-2" />
                        Post a New Job
                      </button>
                    </div>
                  )}
                  
                  {filteredJobs.length === 0 ? (
                    <div className="bg-white dark:bg-blue-800/50 rounded-xl p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <Search size={40} className="text-blue-400 dark:text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                        No jobs found
                      </h3>
                      <p className="text-blue-600 dark:text-blue-300">
                        Try adjusting your search or filters to find more opportunities.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredJobs.map(job => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-blue-800/50 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedJob(job)}
                        >
                          <div className="flex items-start">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white mr-3 flex-shrink-0">
                              <Image
                                src={job.logo}
                                alt={job.company}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-blue-700 dark:text-blue-200">{job.title}</h3>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveJob(job.id);
                                  }}
                                  className="text-blue-600 dark:text-blue-300"
                                >
                                  <Bookmark size={18} fill={job.saved ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                              <p className="text-sm text-blue-600 dark:text-blue-300">{job.company}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                                  <MapPin size={12} className="mr-1" />
                                  {job.distance}
                                </span>
                                <span className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                                  {job.type}
                                </span>
                                <span className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                                  <Clock size={12} className="mr-1" />
                                  {job.posted}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Job Form Modal */}
            <AnimatePresence>
              {showJobForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowJobForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-blue-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-blue-100 dark:border-blue-700 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                        Post a New Job
                      </h3>
                      <button 
                        onClick={() => setShowJobForm(false)}
                        className="text-blue-600 dark:text-blue-300"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <form onSubmit={handleAddJob} className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={newJob.title}
                          onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                          placeholder="e.g. Quantum Reality Engineer"
                          required
                          className="w-full bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={newJob.location}
                          onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                          placeholder="e.g. Paris, France or Remote"
                          required
                          className="w-full bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                            Job Type
                          </label>
                          <select
                            value={newJob.type}
                            onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                            className="w-full bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                            Salary
                          </label>
                          <input
                            type="text"
                            value={newJob.salary}
                            onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                            placeholder="e.g. €60,000 - €80,000"
                            className="w-full bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                          Job Description
                        </label>
                        <textarea
                          value={newJob.description}
                          onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                          placeholder="Describe the job role and responsibilities"
                          rows={4}
                          required
                          className="w-full bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-blue-700 dark:text-blue-200">
                            Requirements
                          </label>
                          <button 
                            type="button"
                            onClick={addRequirement}
                            className="text-sm text-blue-600 dark:text-blue-300 flex items-center"
                          >
                            <Plus size={14} className="mr-1" />
                            Add
                          </button>
                        </div>
                        
                        {newJob.requirements.map((req, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <input
                              type="text"
                              value={req}
                              onChange={(e) => updateRequirement(index, e.target.value)}
                              placeholder={`Requirement ${index + 1}`}
                              className="flex-1 bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {newJob.requirements.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => removeRequirement(index)}
                                className="ml-2 text-red-500 dark:text-red-400"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                        >
                          Post Job
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">
              {userType === 'candidate' ? 'Your Applications' : 'Candidate Applications'}
            </h2>
            
            {applications.length === 0 ? (
              <div className="bg-white dark:bg-blue-800/50 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Send size={40} className="text-blue-400 dark:text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                  No applications yet
                </h3>
                <p className="text-blue-600 dark:text-blue-300">
                  {userType === 'candidate' 
                    ? 'Start applying to jobs to see your applications here.' 
                    : 'No candidates have applied to your job postings yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map(application => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-blue-800/50 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white mr-3 flex-shrink-0">
                        <Image
                          src={application.logo}
                          alt={application.company}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-blue-700 dark:text-blue-200">
                              {application.jobTitle}
                            </h3>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                              {application.company}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            application.status === 'Applied' 
                              ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
                              : application.status === 'Interview' 
                              ? 'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-300'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Applied on {application.date}
                        </p>
                        
                        {userType === 'candidate' ? (
                          <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-700/50 flex justify-between">
                            <button className="text-sm text-blue-600 dark:text-blue-300">
                              View Details
                            </button>
                            <button className="text-sm text-red-500 dark:text-red-400">
                              Withdraw
                            </button>
                          </div>
                        ) : (
                          <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-700/50 flex justify-between">
                            <button className="text-sm text-blue-600 dark:text-blue-300">
                              View Candidate
                            </button>
                            <div className="flex space-x-2">
                              <button className="text-sm text-red-500 dark:text-red-400">
                                Reject
                              </button>
                              <button className="text-sm text-green-500 dark:text-green-400">
                                Interview
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab (for candidates) */}
        {activeTab === 'profile' && userType === 'candidate' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isEditingProfile ? (
                <motion.div
                  key="edit-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-blue-100 dark:border-blue-700/50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                      Edit Your prouφ
                    </h2>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="text-blue-600 dark:text-blue-300"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="p-4 space-y-4">
                    <div className="flex justify-center mb-2">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-800">
                        <Image
                          src={editedProfile.profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                        <button 
                          type="button"
                          className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Upload size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={editedProfile.title}
                        onChange={(e) => setEditedProfile({...editedProfile, title: e.target.value})}
                        className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                        className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                        Description (50 words max)
                      </label>
                      <textarea
                        value={editedProfile.description}
                        onChange={(e) => setEditedProfile({...editedProfile, description: e.target.value})}
                        rows={3}
                        className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                        {editedProfile.description.split(/\s+/).filter(Boolean).length} / 50 words
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                        Skills
                      </label>
                      <input
                        type="text"
                        value={editedProfile.skills.join(', ')}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile, 
                          skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                        })}
                        placeholder="Separate skills with commas"
                        className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                      >
                        Save Profile
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="view-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                  
                  <div className="px-4 pb-4">
                    <div className="flex flex-col items-center -mt-16 mb-4">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-blue-800 bg-white">
                        <Image
                          src={userProfile.profileImage}
                          alt={userProfile.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h2 className="text-xl font-bold text-blue-700 dark:text-blue-200 mt-3">
                        {userProfile.name}
                      </h2>
                      <p className="text-blue-600 dark:text-blue-300">
                        {userProfile.title}
                      </p>
                      <div className="flex items-center text-blue-500 dark:text-blue-400 text-sm mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{userProfile.location}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                        About
                      </h3>
                      <p className="text-blue-600 dark:text-blue-300">
                        {userProfile.description}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                        Experience
                      </h3>
                      <div className="space-y-3">
                        {userProfile.experience.map((exp, index) => (
                          <div key={index} className="border-l-2 border-blue-200 dark:border-blue-700 pl-3">
                            <h4 className="font-medium text-blue-700 dark:text-blue-200">
                              {exp.title}
                            </h4>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                              {exp.company} • {exp.period}
                            </p>
                            <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                        Education
                      </h3>
                      <div className="space-y-3">
                        {userProfile.education.map((edu, index) => (
                          <div key={index} className="border-l-2 border-blue-200 dark:border-blue-700 pl-3">
                            <h4 className="font-medium text-blue-700 dark:text-blue-200">
                              {edu.degree}
                            </h4>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                              {edu.institution} • {edu.year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Post Job Tab (for employers) */}
        {activeTab === 'post' && userType === 'employer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-4"
          >
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4">
              Post a New Job
            </h2>
            
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  placeholder="e.g. Quantum Reality Engineer"
                  required
                  className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  placeholder="e.g. Paris, France or Remote"
                  required
                  className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                    className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                    placeholder="e.g. €60,000 - €80,000"
                    className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
                  Job Description
                </label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Describe the job role and responsibilities"
                  rows={4}
                  required
                  className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-200">
                    Requirements
                  </label>
                  <button 
                    type="button"
                    onClick={addRequirement}
                    className="text-sm text-blue-600 dark:text-blue-300 flex items-center"
                  >
                    <Plus size={14} className="mr-1" />
                    Add
                  </button>
                </div>
                
                {newJob.requirements.map((req, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1 bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {newJob.requirements.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="ml-2 text-red-500 dark:text-red-400"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                >
                  Post Job
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </main>
  );
}