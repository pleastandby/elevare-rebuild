import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import FacultyDashboard from "./FacultyDashboard";
import StudentDashboard from "./StudenDashboard";
import Header from'../components/Header';

const Dashboard = ({setToken}: {setToken: (token: string) => void}) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(backendUrl + "/api/user/role", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setRole(response.data.role);
        } else {
          // Default to student if there's an error
          setRole('student');
        }
      } catch (error: any) {
        console.error("Error checking role:", error);
        setRole('student');
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header setToken={setToken}/>
      {role === 'faculty' ? (
        <FacultyDashboard setToken={setToken} />
      ) : (
        <StudentDashboard setToken={setToken} />
      )}
    </div>
  );
};

export default Dashboard;