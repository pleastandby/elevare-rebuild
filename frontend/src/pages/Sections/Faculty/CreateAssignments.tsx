import { useState, useEffect } from "react";
import axios from 'axios';
import { backendUrl } from '../../../App';
import { message } from 'antd';

interface UploadedFile {
  _id: string;
  originalName: string;
  storedName: string;
  path: string;
  size: number;
  uploadDate: string;
  faculty_id: string;
}

interface CreateAssignmentsProps {
  onNavigateToUpload: () => void;
}

interface FormData {
  name: string;
  description: string;
  duedate: string;
  keywords: string;
  instructions: string;
  syllabus: string;
  count: number;
}

const CreateAssignments = ({ onNavigateToUpload }: CreateAssignmentsProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    duedate: '',
    keywords: '',
    instructions: '',
    syllabus: '',
    count: 5
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/syllabus`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUploadedFiles(response.data.data);

      // Initialize selection state for each file
      const initialSelection: { [key: string]: boolean } = {};
      response.data.data.forEach((file: UploadedFile) => {
        initialSelection[file._id] = false;
      });
      setSelectedSyllabi(initialSelection);
    } catch (error) {
      console.error('Error fetching syllabi:', error);
    }
  };

  const handleSyllabusChange = (fileId: string) => {
    setSelectedSyllabi(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const GenerateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedFileIds = Object.keys(selectedSyllabi).filter(id => selectedSyllabi[id]);
    
    if (selectedFileIds.length === 0) {
      message.error('Please select at least one syllabus file');
      return;
    }
    
    if (!formData.name || !formData.duedate || !formData.instructions) {
      message.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // First, create the assignment with the selected syllabus
      const selectedFiles = uploadedFiles.filter(file => selectedFileIds.includes(file._id));
      const syllabusText = selectedFiles.map(f => f.originalName).join(', ');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duedate', formData.duedate);
      formDataToSend.append('instruction', formData.instructions);
      formDataToSend.append('syllabus', syllabusText);
      
      // Add the file if available
      if (selectedFiles.length > 0) {
        // Note: We can't directly upload from existing uploaded files
        // We need to reference the existing file path
        formDataToSend.append('existingFilePath', selectedFiles[0].path);
        formDataToSend.append('existingFileName', selectedFiles[0].originalName);
      }
      
      // Create the assignment first
      const createResponse = await axios.post(`${backendUrl}/api/assignment`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const createdAssignment = createResponse.data.data;
      
      // Now generate assignments using AI
      const generateResponse = await axios.post(
        `${backendUrl}/api/ai/assignments/${createdAssignment._id}/generate`,
        {
          portions: formData.keywords || 'General',
          count: formData.count
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the assignment with the generated content
      await axios.put(
        `${backendUrl}/api/assignment/${createdAssignment._id}`,
        {
          generatedAssignments: generateResponse.data.data.assignments,
          aiGenerated: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      message.success('Assignment created and generated successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        duedate: '',
        keywords: '',
        instructions: '',
        syllabus: '',
        count: 5
      });
      setSelectedSyllabi({});
      
      // Navigate to view assignments
      window.location.href = '/faculty/assignments';
      
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      message.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'count' ? parseInt(value) || 5 : value
    }));
  };

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
                    className="p-2 m-2 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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

        <div className="m-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-gray-700 mb-2">
            Select a Syllabus to Generate Assignments
          </p>
          <p className="text-gray-600">
            Can't find what you're looking for?{' '}
            <button 
              onClick={(e) => {
                e.preventDefault();
                onNavigateToUpload();
              }}
              className="text-blue-600 hover:text-blue-800 font-medium underline focus:outline-none cursor-pointer"
            >
              Upload a New Syllabus
            </button>
          </p>
        </div>
        {/*Additional infdo that faculties can add*/}
      </div>
      <div className="flex flex-col p-2 m-3 bg-gray-100 gap-2 rounded-md border-2 border-gray-200">
        <form onSubmit={GenerateAssignment}>
          <div className="flex flex-col p-2 gap-1">
            <label htmlFor="name"
              className="font-[500] m-2"
              >Name of the Assignment *
            </label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={handleInputChange}
              className="pl-3 m-2 min-h-10 bg-white outline-none rounded-sm border-2 border-gray-200"
              placeholder="Enter assignment name"
              required
            />
            <label htmlFor="description"
              className="font-[500] m-2"
              >Description
            </label>
            <input 
              type="text" 
              id="description" 
              value={formData.description}
              onChange={handleInputChange}
              className="pl-3 m-2 min-h-10 bg-white outline-none rounded-sm border-2 border-gray-200"
              placeholder="Enter assignment description"
            />
            <label htmlFor="count"
              className="font-[500] m-2"
              >Number of Questions 
            </label>
            <input 
              type="number" 
              id="count" 
              value={formData.count}
              onChange={handleInputChange}
              className="pl-3 m-2 min-h-10 bg-white outline-none rounded-sm border-2 border-gray-200"
              placeholder="Enter number of questions"
            />
            <label htmlFor="duedate"
              className="font-[500] m-2"
              >Due Date *
            </label>
            <input 
              type="date" 
              id="duedate" 
              value={formData.duedate}
              onChange={handleInputChange}
              className="pl-3 m-2 min-h-10 bg-white outline-none rounded-sm border-2 border-gray-200"
              required
            />
          </div>
          <div className="flex flex-col p-2 gap-1">
            <label htmlFor="keywords" className="font-[500] m-2">
              Enter Portions from which You want to Generate Assignments 
              <span className="text-gray-500"> (separated by commas)</span>
            </label>
            <input 
              type="text" 
              id="keywords" 
              value={formData.keywords}
              onChange={handleInputChange}
              className="pl-3 m-2 min-h-10 bg-white outline-none rounded-sm border-2 border-gray-200"
              placeholder="e.g., Chapter 1, Chapter 2, Topic 3"
            />
            <label htmlFor="instructions" className="font-[500] m-2">
              Add Additional Instructions For Generating Assignment *
            </label>
            <textarea 
              id="instructions" 
              value={formData.instructions}
              onChange={handleInputChange}
              className="pl-3 pt-2 m-2 min-h-25 max-h-25 bg-white outline-none rounded-sm border-2 border-gray-200 resize-none"
              placeholder="Provide specific instructions for assignment generation..."
              required
            />
            <div className="flex justify-center m-4">
              <button
                type="submit"
                disabled={loading}
                className={`mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg w-full sm:w-auto self-center ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? "Generating..." : "Generate Assignment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default CreateAssignments