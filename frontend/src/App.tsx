import {useState} from "react";
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from "react-toastify";

export const backendUrl = "http://localhost:4000";

function App() {

  const [token, setToken] = useState(() => {
    // Initialize token from localStorage if available
    return localStorage.getItem('token') || '';
  });

  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <div>
      <ToastContainer aria-label="Notifications" />
      {
        token === "" ? (<LoginPage setToken={handleSetToken}/>) : (<Dashboard setToken={handleSetToken}/>)
      }
    </div>
  )
}

export default App
