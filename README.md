# Victor M. Martinez-Arias Portfolio

This is a single-page React portfolio designed for a biologist and researcher. It includes sections for Bio, Research Interests, Experience, Publications, and an AI Chatbot powered by Chatbase.

## Deployment to GitHub Pages

This project is designed to run directly in the browser using ES Modules and Babel Standalone, making deployment to GitHub Pages very simple.

### Steps to Publish:

1.  **Create a Repository:** Create a new public repository on GitHub.
2.  **Upload Files:** Upload `index.html` to the root of the repository.
3.  **Upload Images:** Upload your photos to the root folder using exactly these names:
    *   `hero.jpg` (Main background landscape/waterfall)
    *   `profile.jpg` (Profile picture)
    *   `mammal.jpg` (Opossum/Mammal photo)
    *   `team.jpg` (Black and white team photo)
4.  **Enable Pages:**
    *   Go to Repository Settings -> Pages.
    *   Select Source: `Deploy from a branch`.
    *   Branch: `main` / Folder: `/ (root)`.
    *   Click Save.

Your site will be live at `https://your-username.github.io/repo-name`.

### Chatbot Configuration

The chatbot is integrated via [Chatbase](https://www.chatbase.co). To modify the greeting message ("Initial Message") or the training data, you must log in to your Chatbase dashboard. No code changes are needed here.
