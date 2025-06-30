# Course Builder

A modern, interactive Course Builder tool for creating and organizing course content with modules, resources (links/files), drag-and-drop, outline navigation, and search.

## 🚀 Features

- Add, rename, and delete modules
- Add, rename, and delete resources (links, PDFs, images)
- Resources can exist inside or outside modules
- Drag-and-drop to reorder modules and resources, or move resources between modules/outside
- Outline sidebar for quick navigation and scroll sync
- Search for modules and resources
- Validations for empty/duplicate names, valid URLs, and duplicate files
- Responsive, Figma-inspired UI

## 🛠️ Getting Started

### Prerequisites
- [Node.js & npm](https://nodejs.org/) (LTS recommended)

### Installation
1. **Clone or download the repository**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Open your browser:**
   Go to [http://localhost:5173](http://localhost:5173) (or the URL shown in your terminal)

### Build for Production
```sh
npm run build
```
The output will be in the `dist` folder. Deploy this folder to Netlify, Vercel, etc.

## 🌐 Deployment
- Deploy the `dist` folder to [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).
- Or connect your GitHub repo and let the platform build automatically.

## 📁 Project Structure
```
src/
  components/
    modules/      # Main feature components (CourseBuilder, ModuleCard, etc.)
    ui/           # UI components (Header, EmptyState)
  assets/         # SVGs and static assets
  App.css         # Main styles
  main.jsx        # App entry point
```

## 🤖 AI Usage
- AI tools (like GitHub Copilot and ChatGPT) were used for debugging, code generation, and UI/UX suggestions.

## 📝 License
MIT
