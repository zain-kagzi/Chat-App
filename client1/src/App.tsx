import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Chat from "./components/Chat";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [isRegister, setIsRegister] = useState(false);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />
      {isLoggedIn ? (
        <Chat />
      ) : isRegister ? (
        <Register
          onRegister={() => setIsRegister(false)}
          switchToLogin={() => setIsRegister(false)}
        />
      ) : (
        <Login
          onLogin={() => setIsLoggedIn(true)}
          switchToRegister={() => setIsRegister(true)}
        />
      )}
    </>
  );
}

export default App;