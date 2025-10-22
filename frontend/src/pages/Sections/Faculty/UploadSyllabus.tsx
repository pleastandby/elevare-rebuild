import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import { backendUrl } from "../../../App";
import toast, { Toaster } from "react-hot-toast";

const UploadSyllabus = () => {

  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ _id: string; name: string; size: number; uploadDate: string; path: string }>>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      console.log('Fetching files from backend...');
      const response = await axios.get(`${backendUrl}/upload/teachers/files`);
      console.log('Fetch response:', response.data);
      console.log('Files received:', response.data.files);
      setUploadedFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
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
    formData.append("userType", "teachers");

    try {
      const res = await axios.post(`${backendUrl}/upload/teachers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Upload response received:', res.data);
      console.log('File data from response:', res.data.file);

      toast.success(res.data.message || "Syllabus uploaded successfully!");

      // Reset form
      setFileName("");
      setFile(null);
      // Clear the file input
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh the file list from server
      await fetchFiles();
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to upload syllabus. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      await axios.delete(`${backendUrl}/upload/teachers/files/${fileId}`);
      toast.success("File deleted successfully!");
      await fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file.");
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

        <button
          type="submit"
          className={`mt-2 px-4 py-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-600'} text-white rounded-lg w-full sm:w-auto self-center`}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      
      <div className="flex flex-col w-full justify-center gap-2 p-2 m-2 bg-gray-200 rounded-lg border-1 border-gray-300 min-h-[50vh] overflow-y-auto">
        <div className="flex flex-row justify-between gap-1 p-2 m-1">
          <h2 className="text-3xl-gray-600 font-bold m-4 p-2">Recently Uploaded</h2>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`m-1 p-1 rounded-lg border-1 border-gray-300 min-w-[120px] h-10 hover:bg-gray-400 cursor-pointer ${isEditMode ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-gray-100'}`}
          >
            {isEditMode ? 'Done' : 'Edit'}
          </button>
        </div>
        <ul className="flex flex-col gap-1 p-2 m-1">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((uploadedFile) => (
              <li key={uploadedFile._id} className="p-2 m-2 bg-gray-100 rounded-lg border-1 border-gray-300 flex justify-between items-center">
                <div>
                  {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB) - Uploaded: {new Date(uploadedFile.uploadDate).toLocaleDateString()}
                </div>
                <button
                  onClick={() => deleteFile(uploadedFile._id)}
                  className={`ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 ${isEditMode ? 'block' : 'hidden'}`}
                >
                  ×
                </button>
              </li>
            ))
          ) : (
            <li className="p-2 m-2 bg-gray-100 rounded-lg border-1 border-gray-300">No files uploaded yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
export default UploadSyllabus