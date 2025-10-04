import Button from "../components/Button";
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
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0079fc] to-white p-4">
            <div className="w-full max-w-4xl mx-auto" style={{width: '50%'}}>
                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
                    <div className="flex flex-col justify-center items-center p-6 lg:p-10">
                        <div className="w-full max-w-md">
                            <Form />
                        </div>
                    </div>
                    <div className="flex flex-col text-white justify-center items-center gap-6 p-6 lg:p-10 bg-[#0079fc] order-first lg:order-last">
                        <div className="flex flex-col items-center gap-4">
                            <img src="/logo.svg" alt="Elevare Logo" className="w-16 h-16 lg:w-20 lg:h-20" />
                            <h1 className="font-bold text-2xl lg:text-3xl text-white text-center">
                                Elevare
                            </h1>
                        </div>
                        <div className="text-center space-y-4">
                            <h2 className="font-medium text-xl lg:text-2xl text-white">
                                Welcome Back!
                            </h2>
                            <p className="text-sm lg:text-base opacity-90">
                                Already Have an Account?<br />Try Registering
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <Button 
                                content={currentForm === "register" ? "Login" : "Register"} 
                                color="secondary" 
                                onClick={() => setcurrentForm(currentForm === "register" ? "login" : "register")}
                            />
                            <Button 
                                content="Faculty Login" 
                                color="secondary" 
                                onClick={() => setcurrentForm("faculty")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;