import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupAnalytics } from "./lib/analytics";

// Setup analytics tracking
setupAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
