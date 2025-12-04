import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import { backendUrl } from "../../../App";
import toast from "react-hot-toast";

const UploadSyllabus = () => {

  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ _id: string; originalName: string; size: number; uploadDate: string; path: string }>>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState<{name: string, date: string} | null>(null);

  const fetchFiles = async () => {
    try {
      console.log('Fetching syllabi from backend...');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/syllabus`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetch response:', response.data);
      console.log('Syllabi received:', response.data.data);
      setUploadedFiles(response.data.data);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || isLoading) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${backendUrl}/api/syllabus/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      console.log('Upload response received:', res.data);
      console.log('Syllabus data from response:', res.data.data);

      toast.success(res.data.message || "Syllabus uploaded successfully!");

      // Reset form
      setFileName("");
      setFile(null);
      // Clear the file input
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Set the last uploaded file info
      setLastUploadedFile({
        name: file?.name || 'File',
        date: new Date().toLocaleString()
      });
      
      // Refresh the file list from server
      await fetchFiles();
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to upload syllabus. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/api/syllabus/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Syllabus deleted successfully!");
      await fetchFiles();
    } catch (error) {
      console.error("Error deleting syllabus:", error);
      toast.error("Failed to delete syllabus.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFileName(selectedFile ? selectedFile.name : "");
    setFile(selectedFile);
  };

  return (
    <div className="flex flex-col justify-center">
      <form className="flex flex-col gap-4 p-4 m-2 w-full bg-gray-200 rounded-lg border-1 border-gray-300" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center">Upload Syllabus</h2>
        <p className="text-center text-sm text-gray-600">Upload Syllabus Content in PDF Here To keep Records and Store them Permanently</p>

        <label
          htmlFor="file"
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-400 rounded-lg p-6 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
        >
          <MdOutlineDriveFolderUpload className="text-5xl text-gray-700" />
          <span className="text-gray-700 font-medium">Click to select file</span>
          <span className="text-sm text-gray-500">or drag and drop</span>
          <input id="file" type="file" className="hidden" onChange={handleFileChange} />
        </label>

        {fileName && (
          <p className="text-sm text-gray-600 text-center">Selected: {fileName}</p>
        )}

        <p className="text-center text-sm text-gray-600">
          Upload syllabus to Create Assignments/Notes
        </p>

        <div className="mt-4 w-full">
          <button
            type="submit"
            className={`px-4 py-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-600'} text-white rounded-lg w-full`}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload Syllabus'}
          </button>
          
          {lastUploadedFile && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                <span className="font-medium">Uploaded:</span> {lastUploadedFile.name}
                <br />
                <span className="text-xs text-green-600">
                  {lastUploadedFile.date}
                </span>
              </p>
            </div>
          )}
        </div>
      </form>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recently Uploaded</h2>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 text-sm rounded-md ${isEditMode ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {isEditMode ? 'Done' : 'Edit'}
          </button>
        </div>
        
        <div className="space-y-3">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map(file => {
              const fileName = file.originalName || 'Document';
              const fileSize = Math.round(file.size / 1024);
              const uploadDate = new Date(file.uploadDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
              
              return (
                <div key={file._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileName}({fileSize} KB)• Uploaded: {uploadDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <a
                      href={`${backendUrl}${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
                      title="View/Download"
                    >
                      View
                    </a>
                    {isEditMode && (
                      <button
                        onClick={() => deleteFile(file._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Delete file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
              <p className="mt-1 text-sm text-gray-500">Upload a file to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default UploadSyllabus