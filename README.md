# Haiku Generator with Image Backgrounds

This project is a web application built with Nuxt 3 that generates haikus based on various topics and displays them with corresponding background images. The application leverages AI services to create unique haikus and fetches images that resonate with the generated poetry.

## Features

- **Dynamic Haiku Generation**: Utilizes AI models to generate haikus based on random or user-defined topics.
- **Image Backgrounds**: Fetches relevant images to serve as backgrounds for the displayed haikus, enhancing the visual experience.
- **User Interaction**: Users can click to load new haikus and images, providing an engaging experience.
- **Responsive Design**: The application is designed to be responsive, ensuring a good user experience on both desktop and mobile devices.
- **Multiple AI Models**: Supports various AI models for haiku generation, including GPT-4, Claude, Llama, and Cloudflare AI.
- **Error Handling**: Implements robust error handling and logging for improved reliability.

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Backend**: Cloudflare Workers, Nuxt 3 server-side API routes
- **AI Services**: OpenAI GPT-4, Anthropic Claude, Groq Llama, Cloudflare AI
- **Image Service**: Lexica API for AI-generated images
- **State Management**: Pinia
- **Deployment**: Cloudflare Pages

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (refer to `.env.example`)
4. Run the development server:
   ```
   npm run dev
   ```

## Deployment

This project is configured for deployment on Cloudflare Pages. To deploy:

1. Build the project:
   ```
   npm run build
   ```
2. Deploy to Cloudflare Pages:
   ```
   npm run deploy
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).