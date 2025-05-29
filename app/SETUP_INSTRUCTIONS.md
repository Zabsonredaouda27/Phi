# PHI Application Setup Instructions

This document provides step-by-step instructions for setting up the PHI application with your OpenAI API key and deploying it to GitHub.

## Setting Up Your OpenAI API Key

1. **Get Your API Key from Abacus**
   - Log in to your Abacus account
   - Navigate to the API section
   - Copy your OpenAI API key

2. **Configure the API Key in the Application**
   - Open the `.env.local` file in the root directory of the PHI application
   - Replace the placeholder text with your actual API key:
     ```
     OPENAI_API_KEY=sk-your-openai-api-key-here
     ```
   - Save the file

3. **Verify the Configuration**
   - Start the application with `npm run dev` or `yarn dev`
   - Navigate to any section that uses AI features (e.g., ChatPHI)
   - Confirm that the "AI FEATURES LIMITED" message no longer appears
   - Test the AI functionality to ensure it works correctly

## Deploying to GitHub

### Step 1: Initialize Git Repository

If you haven't already initialized a Git repository for your project, do so by running the following command in the root directory of your project:

```bash
git init
```

### Step 2: Add Your Files to Git

Add all the files to the Git repository:

```bash
git add .
```

### Step 3: Make Your First Commit

Commit the files to the repository:

```bash
git commit -m "Initial commit of PHI application"
```

### Step 4: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter a name for your repository (e.g., "phi-app")
4. Optionally, add a description
5. Choose whether the repository should be public or private
6. Do not initialize the repository with a README, .gitignore, or license
7. Click "Create repository"

### Step 5: Connect Your Local Repository to GitHub

After creating the repository, GitHub will display commands to push an existing repository. Run the following commands:

```bash
git remote add origin https://github.com/yourusername/phi-app.git
git branch -M main
git push -u origin main
```

Replace `yourusername` with your GitHub username and `phi-app` with the name of your repository.

### Step 6: Protect Your API Key

**Important**: The `.env.local` file containing your API key should never be committed to GitHub. It is already included in the `.gitignore` file, but double-check to ensure it's not being tracked:

```bash
git status
```

If `.env.local` appears in the list of tracked files, add it to `.gitignore` and remove it from Git tracking:

```bash
echo ".env.local" >> .gitignore
git rm --cached .env.local
git commit -m "Remove .env.local from tracking"
```

### Step 7: Set Up Environment Variables for Deployment

When deploying your application to a hosting service, you'll need to set up environment variables:

- **Vercel**:
  - In your Vercel project settings, add an environment variable named `OPENAI_API_KEY` with your API key

- **Netlify**:
  - In your Netlify site settings, go to "Build & deploy" > "Environment variables"
  - Add a variable named `OPENAI_API_KEY` with your API key

### Step 8: Collaborate and Manage Your Repository

Now that your repository is on GitHub, you can:

1. Invite collaborators to your repository
2. Create branches for new features or bug fixes
3. Submit and review pull requests
4. Track issues and enhancements

## Troubleshooting

If you encounter any issues with the OpenAI API integration:

1. Verify that your API key is correctly set in the `.env.local` file
2. Check that the API key is valid and has sufficient credits
3. Ensure that the server-side API routes are correctly configured to use the environment variables
4. Check the browser console and server logs for any error messages

For deployment issues:

1. Make sure your environment variables are correctly set in your hosting platform
2. Check that your repository is properly connected to your hosting service
3. Review the deployment logs for any errors