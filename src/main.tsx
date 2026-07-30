import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// Prerendered routes ship server-rendered markup inside #root, so hydrate it
// rather than throwing it away and re-rendering from scratch — that preserves
// the already-painted content and avoids a flash of empty page.
// Routes without prerendered markup (project/blog detail pages, admin) still
// mount normally.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
