import { useState, useEffect } from "react";
import Overview from "./Sections/Faculty/Overview";
import ViewStudents from "./Sections/Faculty/ViewStudents";
import CreateAssignments from "./Sections/Faculty/CreateAssignments";
import UploadSyllabus from "./Sections/Faculty/UploadSyllabus";
import ViewResults from "./Sections/Faculty/ViewResults";
import ViewAssignments from "./Sections/Faculty/ViewAssignments";

const FacultyDashboard = ({setToken}: {setToken: (token: string) => void}) => {
   
  const [selectedOption, setSelectedOption] = useState('Overview')
  const [activeOption, setActiveOption] = useState('Overview')

  // Handle navigation messages from child components
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE' && event.data.tab) {
        setSelectedOption(event.data.tab);
        setActiveOption(event.data.tab);
        window.scrollTo(0, 0);
      }
    };

    // Listen for messages from child iframes
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option)
    setActiveOption(option)
  }

  const renderContent = () => {
    console.log('🔄 Rendering content for:', selectedOption);
    
    switch (selectedOption) {
      case 'Overview':
        console.log('📊 Rendering Overview');
        return <Overview />
      case 'View Students':
        console.log('👥 Rendering View Students');
        return <ViewStudents />
      case 'View Assignments':
        console.log('📋 Rendering View Assignments (TEST SIMPLE)');
        return <ViewAssignments/>
      case 'Create Assignments':
        console.log('➕ Rendering Create Assignments');
        return <CreateAssignments onNavigateToUpload={() => handleOptionChange('Upload Syllabus')} />
      case 'Upload Syllabus':
        console.log('📤 Rendering Upload Syllabus');
        return <UploadSyllabus />
      case 'View Results':
        console.log('📈 Rendering View Results');
        return <ViewResults />
      default:
        console.log('🏠 Defaulting to Overview');
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
              className={`m-2 p-2 w-full cursor-pointer rounded-lg transition-colors duration-300 ${selectedOption === 'View Assignments' ? 'bg-gray-800 text-gray-200 font-[500]' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'}`} 
              onClick={() => handleOptionChange('View Assignments')}
            >View Assignments</li>
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