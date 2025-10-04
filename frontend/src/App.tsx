import {useState} from "react";
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from "react-toastify";

export const backendUrl = "http://localhost:4000";

function App() {

  const [token, setToken] = useState('');



  return (
    <div>
      <ToastContainer aria-label="Notifications" />
      {
        token === "" ? (<LoginPage setToken={setToken}/>) : (<Dashboard setToken={setToken}/>)
      }
    </div>
  )
}

export default App
