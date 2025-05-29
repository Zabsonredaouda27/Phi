# PHI Mobile Application

PHI is a Next.js-based mobile application featuring multiple interactive sections, including ChatPHI, Multi φ, Job φ, Map φ, and Game φ. The application leverages OpenAI's API to provide AI-powered features across various sections.

## Features

- **Welcome Page**: Central navigation hub with tap buttons for all sections
- **ChatPHI**: AI-powered chat interface using OpenAI
- **Multi φ**: Social media platform with tilt-based scrolling
- **Job φ**: Job search and resume analysis with AI assistance
- **Map φ**: Location-based services with AI travel recommendations
- **Game φ**: Interactive games with AI opponents
- **Sidebar Menu**: Accessible from all sections with application settings

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/phi-app.git
   cd phi-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository.

2. Connect your repository to Vercel.

3. Add your OpenAI API key as an environment variable named `OPENAI_API_KEY` in the Vercel project settings.

4. Deploy the application.

### Deploying to Netlify

1. Push your code to a GitHub repository.

2. Connect your repository to Netlify.

3. Add your OpenAI API key as an environment variable named `OPENAI_API_KEY` in the Netlify project settings.

4. Deploy the application.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required for AI features)

## Security Considerations

- The OpenAI API key is stored securely on the server side and is not exposed to clients.
- All API requests to OpenAI are proxied through secure server-side API routes.
- No user-provided API keys are required, making the application publicly accessible.

## Mobile Optimization

PHI is designed primarily for mobile devices and includes:

- Responsive design for various screen sizes
- Touch and tilt-based interactions
- Smooth animations and transitions
- Dark mode support

## License

This project is licensed under the MIT License - see the LICENSE file for details.