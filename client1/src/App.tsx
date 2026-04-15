import { useState } from "react";
import Chat from "./components/Chat";
import Register from "./components/Register";
import Login from "./components/Login";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  

  const [isRegister, setIsRegister] = useState(false);

  if (isLoggedIn) return <Chat />;

  return isRegister ? (
    <Register
      onRegister={() => setIsRegister(false)}
      switchToLogin={() => setIsRegister(false)}
    />
  ) : (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      switchToRegister={() => setIsRegister(true)}
    />
  );
}

export default App;