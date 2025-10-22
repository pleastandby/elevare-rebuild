import AppButtons from "../../../components/AppButtons";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from 'axios';
import { backendUrl } from '../../../App';

interface UploadedFile {
  _id: string;
  originalName: string;
  storedName: string;
  path: string;
  size: number;
  uploadDate: string;
  userType: string;
}

const CreateAssignments = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${backendUrl}/upload/teachers/files`);
      setUploadedFiles(response.data.files);

      // Initialize selection state for each file
      const initialSelection: { [key: string]: boolean } = {};
      response.data.files.forEach((file: UploadedFile) => {
        initialSelection[file._id] = false;
      });
      setSelectedSyllabi(initialSelection);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const handleSyllabusChange = (fileId: string) => {
    setSelectedSyllabi(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const hasSelectedSyllabus = Object.values(selectedSyllabi).some(selected => selected);

  const UploadContent = () => {
    console.log('Selected syllabi:', selectedSyllabi);
    // TODO: Implement upload logic
  }

  const GenerateAssignment = () => {
    const selectedFileIds = Object.keys(selectedSyllabi).filter(id => selectedSyllabi[id]);
    const selectedFiles = uploadedFiles.filter(file => selectedFileIds.includes(file._id));

    console.log('Generating assignment with selected files:', selectedFiles);
    console.log('Selected file IDs:', selectedFileIds);

    // TODO: Implement assignment generation logic with selectedFiles
    // You can access file metadata like:
    // - selectedFiles[0].originalName
    // - selectedFiles[0].size
    // - selectedFiles[0].path
    // - selectedFiles[0].uploadDate
  }

  // Get selected syllabus names
  const getSelectedSyllabusNames = () => {
    return Object.keys(selectedSyllabi).filter(id => selectedSyllabi[id]);
  };

  return (
    <div className="flex flex-col gap-4 p-2 m-2 min-w-auto min-h-auto bg-white rounded-lg border-2 border-gray-200 ">
      <div>
        <h1 className="text-2xl font-bold text-center p-2 m-2">Select Syllabus</h1>
        <ul className="flex flex-col gap-2 p-2 m-2 border-2 border-gray-200 rounded-md">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map(file => (
              <li key={file._id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="p-2 m-2"
                    checked={selectedSyllabi[file._id] || false}
                    onChange={() => handleSyllabusChange(file._id)}
                  />
                  <div>
                    <span className="font-medium">{file.originalName}</span>
                    <span className="text-gray-500 ml-2">({Math.round(file.size / 1024)} KB)</span>
                    <span className="text-gray-400 ml-2">• Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <a
                  href={`${backendUrl}${file.path}`}
                  target="_blank"
                  className="text-green-400 hover:text-green-600 mr-2"
                  title="View/Download"
                >
                view
                </a>
              </li>
            ))
          ) : (
            <li className="text-gray-500 p-2">No syllabi uploaded yet.</li>
          )}
        </ul>

        {/* Display selected syllabi */}
        {getSelectedSyllabusNames().length > 0 && (
          <div className="p-4 m-2 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-green-800 mb-2">Selected Syllabi ({getSelectedSyllabusNames().length}):</h3>
            <ul className="list-disc list-inside">
              {getSelectedSyllabusNames().map(fileId => {
                const file = uploadedFiles.find(f => f._id === fileId);
                return (
                  <li key={fileId} className="text-green-700">
                    {file?.originalName || fileId} ({file ? Math.round(file.size / 1024) + ' KB' : ''})
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-center m-2">Or Upload a <span className="font-bold">Note</span> / <span className="font-bold">New Syllabus</span> if none of the above match your requirements</p>
        <form className="flex flex-col gap-2 p-2 m-2 justify-center w-full">
          {!hasSelectedSyllabus &&
          <div className="flex flex-col justify-center items-center gap-2 p-2 m-2 border-2 border-gray-200 rounded-md">
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center w-full gap-2 border-2 border-dashed border-gray-400 rounded-lg p-6 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
            >
              <MdOutlineDriveFolderUpload className="text-5xl text-gray-700" />
              <span className="text-gray-700 font-medium">Click to select file</span>
              <span className="text-sm text-gray-500">or drag and drop</span>
              <input id="file" type="file" className="hidden" />
            </label>
            <AppButtons content="Upload" color="primary" onClick={UploadContent}/>
          </div>
          }
        </form>
      </div>
      <div>
        <form onSubmit={GenerateAssignment} >
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name"/>
            <label htmlFor="description">Description</label>
            <input type="text" id="description"/>
            <label htmlFor="duedate">Due Date</label>
            <input type="date" id="duedate"/>
          </div>
          <div>
            <label htmlFor="keywords">Enter Portions from which You want to Generate Assignments</label>
            <input type="text" id="keywords"/>
            <label htmlFor="instructions">Add Additional Instructions For Generating ASsignment</label>
            <textarea name="instructions" id="instructions"/>
            <AppButtons content="Generate" color="primary"/>
          </div>
        </form>
      </div>
    </div>
  )
}
export default CreateAssignments