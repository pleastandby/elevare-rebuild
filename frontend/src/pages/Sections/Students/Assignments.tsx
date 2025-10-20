import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { useState} from 'react';

const Assignments = () => {

  const [ismodalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{
    title: string;
    description: string;
    dueDate: string;
    questions?: string[];
  } | null>(null);

  const openModalWith = (assignment: {
    title: string;
    description: string;
    dueDate: string;
    questions?: string[];
  }) => {
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

//REUSABLE ASSIGMENT TAB IDK WHERE TO PUT THIS LET"S SAY PUT IT THERE UNTIL DB STARTS TO WORK
  const AssignmentTab = (props:{title:string, description:string, dueDate:string}) => {
    return (
      <div className="flex flex-row justify-between align-center min-h-[100px] bg-white m-2 p-2 rounded-lg border-2 border-gray-200">
        <div className="flex flex-col basis-2/3 p-2">
          <h3 className="text-md font-semibold text-gray-800 ">{props.title}</h3>
          <p className="text-sm text-gray-700">{props.description}</p>
          <p className="text-sm text-gray-600">Due Date: {props.dueDate}</p>
        </div>
        <div className="flex justify-end items-center h-auto w-auto p-2 basis-1/3">
          <button className="bg-gray-800 text-white p-2 rounded-lg w-[100px] h-[40px] hover:bg-gray-700 cursor-pointer transition-colors">View</button>
        </div>
      </div>
    )
  }
  
  const AssignmentPopUpModal =() =>{
    return ( ismodalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10">
            <div className="flex flex-col justify-center min-h-[80vh] bg-white shadow-2xl rounded-lg">
              <div className="flex flex-col gap-2 p-2 m-2">
                <h1 className="text-2xl font-bold text-center">{selectedAssignment?.title || 'Title of Assignment'}</h1>
                <p className="text-center">{selectedAssignment?.description || 'Description of Assignment'}</p>
                <p className="text-sm text-red-700 font-semibold p-2 m-2">NOTE : Read Ech Questions Carefully and Upload the Scanned Copy of the Handwritten Answers in PDF Format</p>
              </div>
              <div className="bg-gray-100 h-auto m-2 p-2 rounded-lg border-2 border-gray-300">
                <h2 className="text-xl font-bold text-center">Questions</h2>
                <ul className="flex flex-col gap-2">
                  {selectedAssignment?.questions && selectedAssignment.questions.length > 0 ? (
                    selectedAssignment.questions.map((q, idx) => (
                      <li key={idx}>
                        <p className="text-md font-semibold">{`Q${idx + 1}. ${q}`}</p>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>
                        <p className="text-md font-semibold">Q1. Explain Virtualization</p>
                      </li>
                      <li>
                        <p className="text-md font-semibold">Q2. Core Elements of Data Centre</p>
                      </li>
                      <li>
                        <p className="text-md font-semibold">Q3. Type 1 Hypervisor Vs Type 2 HyperVisor</p>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="flex flex-col gap-2 m-2">
                <div className="flex flex-col justify-center items-center gap-2 p-2 border-1 border-gray-400 rounded-lg">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full gap-2 border-2 border-dashed border-gray-400 rounded-lg p-6 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    <MdOutlineDriveFolderUpload className="text-5xl text-gray-700" />
                    <span className="text-gray-700 font-medium">Click to select file</span>
                    <span className="text-sm text-gray-500">or drag and drop</span>
                    <input id="file" type="file" className="hidden"/>
                  </label>
                </div>
                <div className="flex flex-row justify-end gap-3 items-center">
                  <p className="text-sm text-gray-600">Due Date : {selectedAssignment?.dueDate || '2025-10-15'}</p>
                  <button className="bg-gray-800 text-white p-2 rounded-lg w-[100px] h-[40px] hover:bg-gray-700 cursor-pointer transition-colors">Upload</button>
                  <button className="bg-gray-800 text-white p-2 rounded-lg w-[100px] h-[40px] hover:bg-gray-700 cursor-pointer transition-colors" onClick={() => setModalOpen(false)}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold m-2 p-2">Assignments</h1>
      <div>
        <h2 className="text-xl font-semibold text-gray-800 m-2 p-2">Upcoming</h2>

        <div className="flex flex-row justify-between align-center min-h-[100px] bg-white m-2 p-2 rounded-lg border-2 border-gray-200">
          <div className="flex flex-col basis-2/3 p-2">
            <h3 className="text-md font-semibold text-gray-800 ">VTCC Assignment 2</h3>
            <p className="text-sm text-gray-700">Module 1 - Assignment 1</p>
            <p className="text-sm text-gray-600">Due Date: 2025-10-15</p>
          </div>
          <div className="flex justify-end items-center h-auto w-auto p-2 basis-1/3">
            <button 
              className="bg-gray-800 text-white p-2 rounded-lg w-[100px] h-[40px] hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => openModalWith({ title: 'VTCC Assignment 2', description: 'Module 1 - Assignment 1', dueDate: '2025-10-15', questions: ['Explain Virtualization', 'Core Elements of Data Centre', 'Type 1 Hypervisor Vs Type 2 HyperVisor'] })}
            >View
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 m-2 p-2">Completed</h2>

        <div className="flex flex-row justify-between bg-gray-200 m-2 p-2 rounded-lg border-2 border-gray-300">
          <div className="flex flex-col basis-2/3 p-2">
            <h3 className="text-md font-semibold text-gray-600">VTCC Assignment 1</h3>
            <p className="text-sm text-gray-600">Module 1 - Assignment 1</p>
            <p className="text-sm text-gray-500">Due Date: 2025-10-10</p>
          </div>
          <div className="flex flex-col justify-end items-end gap-2 h-auto w-auto p-2 basis-1/3">
            <button className="bg-gray-300 border-2 border-gray-400 text-gray-800 font-[500] p-2 rounded-lg w-[100px] h-[40px] hover:bg-gray-500 hover:text-white hover:border-gray-800 transition-colors cursor-pointer">View</button>
            <p className="text-sm text-gray-600">Submitted on : 2025-10-10</p>
          </div>
        </div>

      </div>
      <AssignmentPopUpModal />
    </div>
  )
}

export default Assignments