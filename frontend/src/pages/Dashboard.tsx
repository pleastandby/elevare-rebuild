import { useEffect, useState } from "react";
import FacultyDashboard from "./FacultyDashboard";
import StudentDashboard from "./StudenDashboard";
import axios from "axios";
import { backendUrl } from "../App";

const Dashboard = ({setToken}: {setToken: (token: string) => void}) => {

  const [role, setRole] = useState('');

  const getRole = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/user/role");
      setRole(response.data.role);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRole();
  }, []);

  return (
    <div>
      (role === "faculty") ? (<FacultyDashboard setToken={setToken}/> ) : ( <StudentDashboard setToken={setToken}/> )    
    </div>
  )
}

export default Dashboard;