import { useState } from "react";
import Overview from "./Sections/Faculty/Overview";
import ViewStudents from "./Sections/Faculty/ViewStudents";
import CreateAssignments from "./Sections/Faculty/CreateAssignments";
import UploadSyllabus from "./Sections/Faculty/UploadSyllabus";
import ViewResults from "./Sections/Faculty/ViewResults";

const FacultyDashboard = ({setToken}: {setToken: (token: string) => void}) => {
   
  const [selectedOption, setSelectedOption] = useState('Overview')
  const [activeOption, setActiveOption] = useState('Overview')

  const handleOptionChange = (option: string) => {
    setSelectedOption(option)
    setActiveOption(option)
  }

  const renderContent = () => {
    switch (selectedOption) {
      case 'Overview':
        return <Overview />
      case 'View Students':
        return <ViewStudents />
      case 'Create Assignments':
        return <CreateAssignments />
      case 'Upload Syllabus':
        return <UploadSyllabus />
      case 'View Results':
        return <ViewResults />
      default:
        return <Overview />
    }
  }
  
  return (
    <div className="flex flex-row p-4 m-2 gap-4">
      <nav className="flex flex-col bg-gray-100 p-4 rounded-lg border-1 border-gray-300 max-w-[250px] h-[80vh]">
        <div>
          <h2 className="text-2xl font-bold p-3 m-2">Faculty Dashboard</h2>
        </div>
        <div className="flex flex-col">
          <ul className="flex flex-col gap-2 p-2 m-2">
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'Overview' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('Overview')}
              >Overview
            </li>
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'View Students' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('View Students')}
            >View Students</li>
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'Create Assignments' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('Create Assignments')}
            >Create Assignments</li>
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'Upload Syllabus' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('Upload Syllabus')}
            >Upload Syllabus</li>
            <li 
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'View Results' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('View Results')}
            >View Results</li>
          </ul>
        </div>
      </nav>

      <div className="flex flex-col w-full bg-gray-100 p-4 rounded-lg border-1 border-gray-300 h-[80vh] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default FacultyDashboard;