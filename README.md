# Vistral Temporal Bindings 

https://github.com/timeplus-io/vistral 

Interactive visualization of temporal binding strategies for streaming data:

- **Axis Binding** - Continuous data stream through a fixed time window
- **Frame Binding** - Discrete time snapshots for state comparison  
- **Key-based Updates** - In-place mutations of entities by unique key

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Build Standalone HTML

Create a single, self-contained HTML file with no external dependencies:

1. First time only - download Tailwind CSS:
   ```bash
   curl -sL https://cdn.tailwindcss.com > tailwind.css
   ```

2. Build the standalone HTML:
   ```bash
   npm run build:standalone
   ```

3. The output will be at `docs/index.html`

4. Open `docs/index.html` directly in any browser - no server needed!

## Deploy

The `docs/` folder contains a fully self-contained static HTML file that can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:standalone` - Build single HTML file to docs/index.html
- `npm run preview` - Preview production build
