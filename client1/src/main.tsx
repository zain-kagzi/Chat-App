import ReactDOM from "react-dom/client";
import App from "./App";
import { ChatProvider } from "./context/ChatContext";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChatProvider>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </ChatProvider>
);