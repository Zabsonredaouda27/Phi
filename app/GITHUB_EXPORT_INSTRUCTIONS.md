# Exporting PHI to GitHub

This document provides step-by-step instructions for exporting the PHI application to GitHub for version control and collaboration.

## Prerequisites

1. [Git](https://git-scm.com/downloads) installed on your computer
2. A [GitHub](https://github.com/) account
3. The PHI application code on your local machine

## Step 1: Initialize Git Repository

If you haven't already initialized a Git repository for your project, do so by running the following command in the root directory of your project:

```bash
git init
```

## Step 2: Configure .gitignore

Ensure that the `.gitignore` file is properly set up to exclude sensitive information and unnecessary files. The PHI application already includes a `.gitignore` file with appropriate settings.

## Step 3: Add Your Files to Git

Add all the files to the Git repository:

```bash
git add .
```

## Step 4: Make Your First Commit

Commit the files to the repository:

```bash
git commit -m "Initial commit of PHI application"
```

## Step 5: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter a name for your repository (e.g., "phi-app")
4. Optionally, add a description
5. Choose whether the repository should be public or private
6. Do not initialize the repository with a README, .gitignore, or license
7. Click "Create repository"

## Step 6: Connect Your Local Repository to GitHub

After creating the repository, GitHub will display commands to push an existing repository. Run the following commands:

```bash
git remote add origin https://github.com/yourusername/phi-app.git
git branch -M main
git push -u origin main
```

Replace `yourusername` with your GitHub username and `phi-app` with the name of your repository.

## Step 7: Configure Environment Variables for Deployment

When deploying the application, you'll need to set up the OpenAI API key as an environment variable:

1. For local development, create a `.env.local` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. For deployment platforms:
   - **Vercel**: Add the `OPENAI_API_KEY` in the Environment Variables section of your project settings
   - **Netlify**: Add the `OPENAI_API_KEY` in the Environment Variables section of your site settings
   - **GitHub Actions**: Add the `OPENAI_API_KEY` as a repository secret

## Step 8: Collaborate with Others

Now that your repository is on GitHub, you can:

1. Invite collaborators to your repository
2. Create branches for new features or bug fixes
3. Submit and review pull requests
4. Track issues and enhancements

## Important Notes

- Never commit your `.env.local` file or any file containing your API keys to GitHub
- Always check that sensitive information is properly excluded by the `.gitignore` file
- Make sure all collaborators understand how to set up their environment variables locally

## Troubleshooting

If you encounter any issues with the OpenAI API integration:

1. Verify that your API key is correctly set in the environment variables
2. Check that the API key is valid and has sufficient credits
3. Ensure that the server-side API routes are correctly configured to use the environment variables