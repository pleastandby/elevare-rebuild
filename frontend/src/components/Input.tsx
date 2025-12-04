import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type InputProps={
    type:string;
    label:string;
    placeholder?:string;
    value?:string;
    onChange?:(value:string) => void;
    error?:string;
    disabled?:boolean;
}

function Input({type, label, placeholder, value, onChange, error, disabled}:InputProps){
    const [showPassword, setShowPassword] = useState(false);

    const togglePassWord = () => {
        setShowPassword(!showPassword);
    };

    function Eye(){
        return(
            <button
                type="button"
                onClick={togglePassWord}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
        )
    }

    const inputClasses = `
        w-full p-3 rounded-lg border transition-all duration-200
        ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
        placeholder-gray-400 text-gray-900
    `;

    return(
        <>
            { type === "password" ? (
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange?.(e.target.value)}
                            required
                            disabled={disabled}
                            className={`${inputClasses} pr-10`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Eye />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
            ):(
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <input 
                        type={type} 
                        placeholder={placeholder} 
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        required 
                        disabled={disabled}
                        className={inputClasses}
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
            )}
        </>
    )
}
export default Input;