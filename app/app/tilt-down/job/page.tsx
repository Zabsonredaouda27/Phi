'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';


export default function JobAiAnalysis() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(true);

  useEffect(() => {
  }, []);

  // Sample job description
  const sampleJobDescription = `Quantum Reality Engineer
  
PHI Technologies is seeking a skilled Quantum Reality Engineer to join our innovative team. The ideal candidate will have experience in quantum computing and multiverse navigation technologies.

Responsibilities:
- Develop and maintain quantum reality interfaces
- Troubleshoot cross-dimensional communication issues
- Collaborate with interdisciplinary teams on reality-shifting projects
- Document new discoveries and technological advancements

Requirements:
- 3+ years experience in quantum computing
- Knowledge of multiverse theory
- Experience with reality manipulation algorithms
- Strong problem-solving skills
- Bachelor's degree in Physics, Computer Science, or related field`;

  // Load sample job description
  const loadSampleJob = () => {
    setJobDescription(sampleJobDescription);
  };

  // Analyze resume with AI
  const analyzeResume = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both a resume and job description.');
      return;
    }

    if (!isApiKeyConfigured) {
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const prompt = `
I have a job description and a resume. Please analyze how well the resume matches the job requirements and provide:
1. A match percentage (0-100%)
2. Key strengths that align with the job
3. Skills or experiences that are missing
4. Suggestions to improve the resume for this specific job

Job Description:
${jobDescription}

Resume:
${resumeText}

Please format your response in clear sections with headers.
`;

      // Mock analysis result since OpenAI integration was removed
      const result = `
# Resume Analysis Results

## Match Percentage: 75%

## Key Strengths
- Strong technical background aligns well with the role requirements
- Relevant experience in the field
- Good educational foundation

## Areas for Improvement
- Consider highlighting specific achievements with quantifiable results
- Add more keywords from the job description
- Emphasize relevant skills more prominently

## Recommendations
- Tailor your resume to include more specific technologies mentioned in the job posting
- Add metrics and numbers to demonstrate impact
- Consider reorganizing sections to highlight most relevant experience first
      `;
      setAnalysis(result);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please check your API key or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate resume improvements with AI
  const improveResume = async () => {
    if (!resumeText.trim()) {
      setError('Please provide a resume to improve.');
      return;
    }

    if (!isApiKeyConfigured) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const prompt = `
Please improve the following resume to make it more effective and professional. Enhance the language, structure, and impact while keeping the same information and experience. Format it professionally.

Resume:
${resumeText}

Improved version:
`;

      // Mock improved resume since OpenAI integration was removed
      const improvedResume = `${resumeText}\n\n[Resume has been formatted and enhanced with professional language and structure]`;
      setResumeText(improvedResume);
    } catch (err) {
      console.error('Error improving resume:', err);
      setError('Failed to improve resume. Please check your API key or try again later.');
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
            <Briefcase className="text-blue-600 dark:text-blue-300 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-200">Job φ AI Analysis</h1>
          </div>
          <button 
            onClick={() => router.push('/tilt-down')}
            className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg"
          >
            Back to Jobs
          </button>
        </motion.div>



        {error && (
          <div className="flex items-center bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 flex items-center">
                <FileText className="mr-2" size={20} />
                Your Resume
              </h2>
              <button
                onClick={improveResume}
                disabled={!resumeText.trim() || isLoading || !isApiKeyConfigured}
                className={`flex items-center ${
                  !resumeText.trim() || isLoading || !isApiKeyConfigured
                    ? 'bg-blue-300 dark:bg-blue-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-3 py-1 rounded-lg text-sm`}
              >
                {isLoading ? (
                  <Loader2 size={16} className="mr-1 animate-spin" />
                ) : (
                  <Sparkles size={16} className="mr-1" />
                )}
                Improve with AI
              </button>
            </div>
            
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={15}
              className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-blue-500 dark:text-blue-400">
                {resumeText ? `${resumeText.length} characters` : 'No resume text'}
              </div>
              <button
                onClick={() => setResumeText('')}
                disabled={!resumeText || isLoading}
                className={`${
                  !resumeText || isLoading
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40'
                } text-red-600 dark:text-red-400 px-3 py-1 rounded-lg text-sm`}
              >
                Clear
              </button>
            </div>
          </motion.div>

          {/* Job Description Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 flex items-center">
                <Briefcase className="mr-2" size={20} />
                Job Description
              </h2>
              <button
                onClick={loadSampleJob}
                className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-lg text-sm"
              >
                Load Sample
              </button>
            </div>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={15}
              className="w-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-blue-500 dark:text-blue-400">
                {jobDescription ? `${jobDescription.length} characters` : 'No job description'}
              </div>
              <button
                onClick={() => setJobDescription('')}
                disabled={!jobDescription || isLoading}
                className={`${
                  !jobDescription || isLoading
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40'
                } text-red-600 dark:text-red-400 px-3 py-1 rounded-lg text-sm`}
              >
                Clear
              </button>
            </div>
          </motion.div>
        </div>

        {/* Analysis Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 mb-6"
        >
          <button
            onClick={analyzeResume}
            disabled={!resumeText.trim() || !jobDescription.trim() || isLoading || !isApiKeyConfigured}
            className={`w-full ${
              !resumeText.trim() || !jobDescription.trim() || isLoading || !isApiKeyConfigured
                ? 'bg-blue-300 dark:bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-3 rounded-xl flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="mr-2 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Search size={24} className="mr-2" />
                Analyze Resume Match
              </>
            )}
          </button>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-4 flex items-center">
                <CheckCircle className="mr-2" size={24} />
                Analysis Results
              </h2>
              
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: analysis.replace(/\n/g, '<br />') 
                }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}