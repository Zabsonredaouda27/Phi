# PHI Application Deployment Guide

This comprehensive guide provides detailed instructions for configuring the OpenAI API key in the PHI application and deploying it to GitHub.

## Table of Contents
1. [API Key Configuration](#api-key-configuration)
2. [Verifying Application Functionality](#verifying-application-functionality)
3. [GitHub Deployment](#github-deployment)
4. [Troubleshooting](#troubleshooting)
5. [Additional Resources](#additional-resources)

## API Key Configuration

### Step 1: Obtain Your OpenAI API Key
1. Log in to your Abacus account
2. Navigate to the API section
3. Copy your OpenAI API key (it should start with `sk-`)

### Step 2: Configure the API Key in the Application
1. Locate the `.env.local` file in the root directory of the PHI application
2. Open the file in a text editor
3. Replace the placeholder text with your actual API key:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
4. Save the file

### Step 3: Restart the Application
1. If the application is running, stop it by pressing `Ctrl+C` in the terminal
2. Restart the application with:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Verifying Application Functionality

### Step 1: Check API Status
1. Open the PHI application in your browser (typically at http://localhost:3000)
2. Navigate to different sections that use AI features (ChatPHI, Job φ, Map φ, Game φ)
3. Verify that the "AI FEATURES LIMITED" message does not appear

### Step 2: Test AI Features
1. In ChatPHI, send a message and confirm that you receive an AI-generated response
2. In Job φ, test the resume analysis feature
3. In Map φ, test the location recommendations
4. In Game φ, test the AI opponent

### Step 3: Check Server Logs
1. Monitor the terminal where the application is running
2. Look for any error messages related to the OpenAI API
3. If errors occur, verify that your API key is correct and has sufficient credits

## GitHub Deployment

### Step 1: Initialize Git Repository
If you haven't already initialized a Git repository for your project:
```bash
git init
```

### Step 2: Create .gitignore File
Ensure that sensitive files are not committed to the repository:
```bash
# Create or edit .gitignore file
echo ".env.local" >> .gitignore
echo "node_modules" >> .gitignore
echo ".next" >> .gitignore
```

### Step 3: Add and Commit Files
```bash
# Add all files except those in .gitignore
git add .

# Make the initial commit
git commit -m "Initial commit of PHI application"
```

### Step 4: Create a GitHub Repository
1. Go to [GitHub](https://github.com/) and sign in
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter a name for your repository (e.g., "phi-app")
4. Choose whether the repository should be public or private
5. Do not initialize the repository with a README, .gitignore, or license
6. Click "Create repository"

### Step 5: Connect Local Repository to GitHub
GitHub will display commands to push an existing repository. Run these commands:
```bash
git remote add origin https://github.com/yourusername/phi-app.git
git branch -M main
git push -u origin main
```
Replace `yourusername` with your GitHub username and `phi-app` with your repository name.

### Step 6: Deploy to a Hosting Service (Optional)
For deploying to a hosting service like Vercel or Netlify:

#### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add your OpenAI API key as an environment variable named `OPENAI_API_KEY`
3. Deploy the application

#### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Add your OpenAI API key as an environment variable named `OPENAI_API_KEY`
3. Deploy the application

## Troubleshooting

### API Key Issues
- **Problem**: "AI FEATURES LIMITED" message still appears
  - **Solution**: Verify that your API key is correctly set in the `.env.local` file and that the application has been restarted

- **Problem**: OpenAI API errors in the console
  - **Solution**: Check that your API key is valid and has sufficient credits

### Deployment Issues
- **Problem**: Environment variables not working in production
  - **Solution**: Ensure that you've set the environment variables in your hosting platform's settings

- **Problem**: Application builds locally but fails in deployment
  - **Solution**: Check the build logs for errors and ensure all dependencies are correctly installed

## Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [GitHub Documentation](https://docs.github.com/en)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)