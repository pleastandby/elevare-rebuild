import { useState } from 'react';
import DashboardPage from './Sections/Students/DashboardPage';
import Notifications from './Sections/Students/Notifications';
import Assignments from './Sections/Students/Assignments';
import Results from './Sections/Students/Results';

const StudenDashboard = ({setToken}: {setToken: (token: string) => void}) => {

   const [selectedOption, setSelectedOption] = useState('DashboardPage')
  const [activeOption, setActiveOption] = useState('DashboardPage')

  const handleOptionChange = (option: string) => {
    setSelectedOption(option)
    setActiveOption(option)
  }

  const renderContent = () => {
    switch (selectedOption) {
      case 'DashboardPage':
        return <DashboardPage />
      case 'Notifications':
        return <Notifications />
      case 'Assignments':
        return <Assignments />
      case 'Results':
        return <Results />
      default:
        return <DashboardPage />
    }
  }
  return (
    <div className="flex flex-row p-4 m-2 gap-4">
      <nav className="flex flex-col bg-gray-100 p-4 rounded-lg border-1 border-gray-300 max-w-[250px] h-[80vh]">
        <div>
          <h2 className="text-2xl font-bold p-3 m-2">Student Dashboard</h2>
        </div>
        <div className="flex flex-col">
          <ul className="flex flex-col gap-2 p-2 m-2">
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'DashboardPage' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('DashboardPage')}
              >Dashboard
            </li>
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'Notifications' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('Notifications')}
            >Notifications</li>
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'Assignments' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('Assignments')}
            >Assignments</li>
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'Results' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('Results')}
            >Results</li>
          </ul>
        </div>
      </nav>

      <div className="flex flex-col w-full bg-gray-100 p-4 rounded-lg border-1 border-gray-300 h-[80vh] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  )
}

export default StudenDashboard