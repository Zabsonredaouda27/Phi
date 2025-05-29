# PHI Application Deployment Instructions

This guide provides clear, step-by-step instructions for deploying your PHI application to GitHub and making it publicly accessible through Vercel.

## Prerequisites
- Git is installed on your computer
- A GitHub account
- A Vercel account (free tier is sufficient)

## Step 1: GitHub Repository Setup (Already Completed)
✅ Git has been initialized in your PHI directory
✅ A .gitignore file has been created to exclude sensitive files like .env.local
✅ The application has been built successfully
✅ Initial commit has been made

## Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter a name for your repository (e.g., "phi-app")
4. Choose whether the repository should be public or private
   - **Public**: Anyone can see the repository, but you control who can commit
   - **Private**: You choose who can see and commit to the repository
5. Do not initialize the repository with a README, .gitignore, or license
6. Click "Create repository"

## Step 3: Connect Your Local Repository to GitHub

After creating the repository, GitHub will display commands to push an existing repository. Run the following commands in your PHI directory:

```bash
git remote add origin https://github.com/yourusername/phi-app.git
git branch -M main
git push -u origin main
```

Replace `yourusername` with your GitHub username and `phi-app` with your repository name.

## Step 4: Deploy to Vercel

### Option 1: Deploy from the Vercel Dashboard

1. Go to [Vercel](https://vercel.com/) and sign in (you can sign in with your GitHub account)
2. Click "Add New..." and select "Project"
3. Import your GitHub repository (you may need to install the Vercel GitHub app if you haven't already)
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: app (important!)
   - Environment Variables: Add your OpenAI API key
     - NAME: `OPENAI_API_KEY`
     - VALUE: Your OpenAI API key (starts with `sk-`)
5. Click "Deploy"

### Option 2: Deploy Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your app directory:
   ```bash
   cd /home/ubuntu/PHI/app
   ```

3. Run the deployment command:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Log in to Vercel if prompted
   - Set up and deploy: Yes
   - Link to existing project: No
   - Project name: Accept default or enter a name
   - Directory: ./
   - Override settings: No

5. After deployment, set up your environment variable:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Enter your OpenAI API key when prompted

6. Redeploy with the environment variable:
   ```bash
   vercel --prod
   ```

## Step 5: Access Your Deployed Application

After successful deployment, Vercel will provide you with a URL to access your application (e.g., `https://phi-app.vercel.app`).

## Important Notes

### Protecting Sensitive Information
- Your `.env.local` file containing your OpenAI API key is excluded from Git by the `.gitignore` file
- Always set environment variables through your hosting platform's secure interface
- Never commit API keys or sensitive credentials to your repository

### Updating Your Deployed Application
When you make changes to your application:

1. Commit your changes to Git:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

2. Push to GitHub:
   ```bash
   git push
   ```

3. Vercel will automatically detect the changes and redeploy your application

## Troubleshooting

### API Key Issues
- If AI features are limited or not working, verify that your API key is correctly set in Vercel's environment variables
- Check that your API key is valid and has sufficient credits

### Deployment Issues
- If your application builds locally but fails in deployment, check the build logs in Vercel for errors
- Ensure all dependencies are correctly installed and that your project structure is correct
- Verify that you've selected the correct root directory (app) during deployment

For more detailed information, refer to the PHI_DEPLOYMENT_GUIDE.md and GITHUB_EXPORT_INSTRUCTIONS.md files in your app directory.
