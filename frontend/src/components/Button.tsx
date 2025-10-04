type ButtonProps = {
    content: string;
    color: string   | "primary" | "secondary";
    onClick?: () => void;
};

function Button({content, color, onClick}: ButtonProps) {
    return (
        color === "primary" ?
         <button
            type="submit"
            className="w-full bg-[#0079fc] text-white font-medium rounded-full px-6 py-3 hover:bg-[#0055b3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClick}>
            {content}
        </button>
        :
        <button
            type="submit"
            className="w-full bg-white text-black font-medium rounded-full px-6 py-3 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 border border-gray-200"
            onClick={onClick}>
            {content}
        </button>
    );
};
export default Button;