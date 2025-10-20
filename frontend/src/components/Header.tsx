import { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa6";
import axios from "axios";
import { backendUrl } from "../App";

type Profile = { name: string; role: string; email: string };

const Header = ({ setToken }: { setToken: (token: string) => void }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const { data } = await axios.get(`${backendUrl}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          name: data.data.name,
          role: data.data.role,
          email: data.data.email,
        });
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FaGraduationCap className="text-3xl text-gray-800" />
        <h1 className="text-xl font-bold">
          {profile?.role === "faculty" ? "Elevare Faculty" : "Elevare Student"}
        </h1>
      </div>
      <div className="text-right">
        {loading ? (
          <div className="text-sm text-gray-500">Loading profile...</div>
        ) : profile ? (
          <>
            <div className="flex flex-row gap-3">
                <div className="flex flex-col">
                    <h2 className="font-semibold">{profile.name}</h2>
                    <p className="text-sm text-gray-600">{profile.email}</p>    
                </div>
                <button
                onClick={handleLogout}
                className="mt-2 px-5 py-2 rounded bg-black text-white hover:bg-gray-600"
                >
                Logout
                </button>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500">Not logged in</div>
        )}
      </div>
    </header>
  );
};

export default Header;