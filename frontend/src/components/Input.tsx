import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type InputProps={
    type:string;
    label:string;
    placeholder?:string;
    value?:string;
    onChange?:(value:string) => void;
}

function Input({type, label, placeholder, value, onChange}:InputProps){
    const [showPassword, setShowPassword] = useState(false);

    const togglePassWord = () => {
        setShowPassword(!showPassword);
    };

    function Eye(){
        return(
            <button
                onClick={togglePassWord}
            >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
        )
    }

    return(
        <>
            { type === "password" ? (
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">{label}</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange?.(e.target.value)}
                            required
                            className="w-full p-3 pr-10 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Eye />
                        </div>
                    </div>
                </div>
            ):(
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">{label}</label>
                    <input 
                        type={type} 
                        placeholder={placeholder} 
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        required 
                        className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
            )}
        </>
    )
}
export default Input;