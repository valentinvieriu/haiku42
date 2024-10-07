# Haiku Generator

A modern, visually engaging Haiku Generator application built using **Nuxt.js**, **Pinia** for state management, and **TailwindCSS** for styling. The application is deployed on **Cloudflare Pages**. The app generates random haikus with a corresponding background image, offering users a poetic and visually enriching experience.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Random Haiku Generation**: Generates a 5-7-5 haiku with modern themes using various AI models.
- **Background Images**: Each haiku is presented with a visually compelling background image fetched from Lexica's image API.
- **Interactive Elements**: Clicking on the background or haiku generates a new haiku and corresponding image.
- **Typing Effect**: The haiku text is displayed with a typing animation for a pleasant reading experience.
- **Smooth Transitions**: CSS transitions and animations are used for a seamless user experience.
- **Server-side Rendering (SSR)**: Utilizes Nuxt.js capabilities to improve loading times and SEO.

## Technologies Used
- **Nuxt 3** (with SSR support)
- **Vue 3** (Composition API and `<script setup>`)
- **TailwindCSS** (Styling)
- **Cloudflare Pages** (Deployment)
- **Lexica API** (Background Images)
- **Multiple AI Services** for generating haikus (as reflected in the topics.js file)

## Getting Started
Follow these instructions to get a local copy of the project up and running, including setting up dependencies and configuring environment variables. Then, launch the development server to get a complete local experience.

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **yarn**

### Installation
1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/haiku-generator.git
   cd haiku-generator
   ```

2. **Install Dependencies**
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App
1. **Development Server**
   Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Configuration
Configuration can be managed through the `nuxt.config.ts` file and environment variables.

### Environment Variables
- **API Keys**: The application uses several AI services, and you'll need valid API keys.
- **Lexica API**: Requires a valid endpoint for fetching background images.

To manage environment variables, you can add a `.env` file in the root directory. Make sure not to share or commit this file to the repository to ensure security best practices:

```env
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
```

These keys should also be configured for production in the deployment environment settings.

## Deployment
The application is pre-configured for deployment on **Cloudflare Pages**.

1. **Build the Project**
   ```sh
   npm run build
   # or
   yarn build
   ```

2. **Deploy to Cloudflare Pages**
   - Link your GitHub repository to Cloudflare Pages.
   - Set the build command as `npm run build`.
   - Set the output directory to `.output/public`.

Make sure the required environment variables are set up in the Cloudflare Pages settings.

## Folder Structure
A brief overview of the folder structure:

```
haiku-generator/
├── components/          # Vue components such as BackgroundImage and HaikuDisplay
├── pages/               # Nuxt pages (e.g., haiku/[id].vue)
├── server/              # API routes and utilities for fetching haikus and images
│   ├── api/             # Haiku API and image streaming logic
│   └── utils/           # AI services and helper utilities
├── public/              # Static assets
├── nuxt.config.ts       # Nuxt.js configuration
└── README.md            # Documentation for the repository
```

## Contributing
Contributions make the open-source community a great place to learn and create. Any contributions you make are **greatly appreciated**.

1. **Fork the Project**
2. **Create Your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## License
Distributed under the MIT License. See `LICENSE` for more information.

---

# Thank You

Thank you for using and contributing to the Haiku Generator! Enjoy crafting and reading beautiful haikus.
