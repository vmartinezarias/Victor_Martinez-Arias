# Victor M. Martinez-Arias Portfolio

This is a single-page React portfolio designed for a biologist and researcher. It includes sections for Bio, Research Interests, Experience, Publications, and an AI Chatbot powered by Google Gemini.

## Deployment to GitHub Pages

This project is designed to run directly in the browser using ES Modules and Babel Standalone, making deployment to GitHub Pages very simple.

### Steps:

1.  **Create a Repository:** Create a new public repository on GitHub (e.g., `portfolio`).
2.  **Upload Files:** Upload `index.html` and `index.tsx` to the root of the repository. Also upload your images (`P1080838.JPG`, `P1090332.JPG`, etc.) to the root.
3.  **Configure API Key:**
    *   Open `index.tsx`.
    *   Find the line: `apiKey: process.env.API_KEY`.
    *   Replace `process.env.API_KEY` with your actual Google Gemini API Key string (e.g., `"AIzaSy..."`).
    *   *Note:* Since this is a frontend-only site, your API key will be visible in the source code. For a personal portfolio with free tier limits, this is often acceptable, but be aware of the security implication.
4.  **Enable Pages:**
    *   Go to Repository Settings -> Pages.
    *   Select Source: `Deploy from a branch`.
    *   Branch: `main` / Folder: `/ (root)`.
    *   Click Save.

Your site will be live at `https://your-username.github.io/portfolio`.
