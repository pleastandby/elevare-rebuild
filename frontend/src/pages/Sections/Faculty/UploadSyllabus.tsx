import { useState, type ChangeEvent } from "react";
import { MdOutlineDriveFolderUpload } from "react-icons/md";

const UploadSyllabus = () => {
    const [fileName, setFileName] = useState<string>("");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileName(file ? file.name : "");
    };

    return (
      <div className="flex flex-col justify-center">
        <form className="flex flex-col gap-4 p-4 m-2 w-full bg-gray-200 rounded-lg border-1 border-gray-300">
          <h2 className="text-2xl font-bold text-center">Upload Syllabus</h2>

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
            className="mt-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-600 rounded-lg w-full sm:w-auto self-center"
          >
            Upload
          </button>
        </form>
        
        <div className="flex flex-col w-full justify-center gap-2 p-2 m-2 bg-gray-200 rounded-lg border-1 border-gray-300 min-h-[50vh] overflow-y-auto">
          <div className="flex flex-row justify-between gap-1 p-2 m-1">
            <h2 className="text-3xl-gray-600 font-bold m-4 p-2">Recently Uploaded</h2>
            <button className="m-1 p-1 bg-gray-100 rounded-lg border-1 border-gray-300 min-w-[120px] h-10 hover:bg-gray-400 cursor-pointer">Edit</button>
          </div>
          <ul className="flex flex-col gap-1 p-2 m-1">
            <li className="p-2 m-2 bg-gray-100 rounded-lg border-1 border-gray-300">Sample Syllabus 1</li>
            <li className="p-2 m-2 bg-gray-100 rounded-lg border-1 border-gray-300">Sample Syllabus 2</li>
            <li className="p-2 m-2 bg-gray-100 rounded-lg border-1 border-gray-300">Sample Syllabus 3</li>
            <li className="p-2 m-2 bg-gray-100 rounded-lg border-1 border-gray-300">Sample Syllabus 4</li>
          </ul>
        </div>
      </div>
    )
}
export default UploadSyllabus