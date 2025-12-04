import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import FacultyForm from "../components/FacultyForm";
import {useState} from 'react';


interface LoginPageProps {
    setToken: (token: string) => void;
}

const LoginPage = ({setToken}: LoginPageProps) => {

    const [currentForm, setcurrentForm] = useState("login");

    const Form = () => {
        if (currentForm === "login") return <LoginForm setToken={setToken} />;
        else if (currentForm === "register") return <RegisterForm setToken={setToken} />;
        else return <FacultyForm setToken={setToken} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Brand */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <img src="/logo.svg" alt="Elevare Logo" className="w-12 h-12" />
                        <h1 className="text-3xl font-bold text-gray-900">Elevare</h1>
                    </div>
                    <p className="text-gray-600">Welcome to Elevare Learning Platform</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setcurrentForm("login")}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                                currentForm === "login"
                                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setcurrentForm("register")}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                                currentForm === "register"
                                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Register
                        </button>
                        <button
                            onClick={() => setcurrentForm("faculty")}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                                currentForm === "faculty"
                                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Faculty
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        <Form />
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        &copy; 2025 Elevare. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;