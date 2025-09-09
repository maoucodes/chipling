import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Theme is now handled by next-themes, so we don't need manual initialization

createRoot(document.getElementById("root")!).render(<App />);