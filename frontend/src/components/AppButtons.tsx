interface AppButtonsProps {
    content: string;
    color: string | "primary" | "secondary";
    onClick?: () => void;
}

const AppButtons = ({content, color, onClick}: AppButtonsProps) => {
  return (
    color === "primary" ?
    <button 
    type="submit" 
    onClick={onClick}
    className={`mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg w-full sm:w-auto self-center`}
    >
        {content}
    </button>
    :
    <button 
    type="submit" 
    onClick={onClick}
    className={`m-1 p-1 rounded-lg border-1 border-gray-300 min-w-[120px] h-10 hover:bg-gray-400 cursor-pointer`}
    >
        {content}
    </button>
  )
}

export default AppButtons;