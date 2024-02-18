## Start Dev Server

To start a development server locally, run

    yarn run dev

## Project Structure

- src
  - assets (directory for images etc)
  - components (directory for reusable React components)
  - pages (directory for rendering pages)
  - util (directory for utility TypeScript files)
  - index.css
  - main.tsx
  - App.css (the main CSS file)
  - App.tsx (the entry point of the program where you define routes)

## Adding a New Page

To add a new page, create a new tsx file under pages directory. Then add a route in App.tsx as a child of the Root route. Your new page will be displayed next to the sidebar.
