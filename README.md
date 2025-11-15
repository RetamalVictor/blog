# Victor Retamal's Portfolio & Blog

Personal portfolio and blog showcasing machine learning research, projects, and learning journey.

## 🚀 Live Site

Visit: [https://retamalvictor.github.io/blog/](https://retamalvictor.github.io/blog/)

## 🛠 Tech Stack

- **Framework**: TypeScript + Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Math Rendering**: KaTeX
- **Syntax Highlighting**: Highlight.js
- **Markdown**: Marked
- **Deployment**: GitHub Pages with Actions

## 📁 Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── content/        # Blog posts and notebooks
│   ├── data/           # YAML configuration files
│   ├── templates/      # HTML templates
│   ├── utils/          # Utility functions
│   └── main.ts         # Application entry point
├── public/             # Static assets
└── .github/workflows/  # CI/CD automation
```

## 🔄 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📝 Adding Content

### Blog Posts
1. Add entry to `src/data/blog-posts.yaml`
2. Create markdown file in `src/content/markdown/`
3. Update content map in `src/pages/BlogPost.ts`

### Projects
- Edit `src/data/projects.yaml`

### CV/Resume
- Update `src/data/cv-data.yaml`

## 🚀 Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the main branch via GitHub Actions.

## 📄 License

© 2024 Victor Retamal. All rights reserved.