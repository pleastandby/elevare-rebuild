type ButtonProps = {
    content: string;
    color: "primary" | "secondary" | "outline";
    onClick?: () => void;
    type?: "submit" | "button";
    disabled?: boolean;
    fullWidth?: boolean;
};

function Button({content, color, onClick, type = "submit", disabled = false, fullWidth = true}: ButtonProps) {
    const baseClasses = "font-medium rounded-lg px-6 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const widthClasses = fullWidth ? "w-full" : "";
    
    const buttonStyles = {
        primary: `${baseClasses} ${widthClasses} bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed`,
        secondary: `${baseClasses} ${widthClasses} bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`,
        outline: `${baseClasses} ${widthClasses} bg-transparent text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-900 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed`
    };

    return (
        <button
            type={type}
            className={buttonStyles[color]}
            onClick={onClick}
            disabled={disabled}>
            {content}
        </button>
    );
};
export default Button;