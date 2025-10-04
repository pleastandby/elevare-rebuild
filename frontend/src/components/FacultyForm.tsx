import Input from "./Input";
import Button from "./Button";
import { useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const FacultyForm = ({setToken} : {setToken: (token: string) => void}) => {

  const [name, setName] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [currentMode, setCurrectMode] = useState("Login")

  const fromSubmission = async (event : React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault()

    if (currentMode === "Register") {
      try {
        const response = await axios.post(backendUrl + "/api/user/facultyregister", {name, facultyId, email, password})

        if(response.data.success){
          toast.success(response.data.message)
          setToken(response.data.token)
        }else{
          toast.error(response.data.message)
          console.log(response.data.error)
        }
      } catch (error) {
        console.log(error)
      }
      
    } else if (currentMode === "Login") {
      try {
        const response = await axios.post(backendUrl + "/api/user/facultylogin", {name, facultyId,email, password})

        if(response.data.success){
          toast.success(response.data.message)
          setToken(response.data.token)
        }else{
          toast.error(response.data.message)
          console.log(response.data.error)
        }
      } catch (error) {
        console.log(error)
      }
    }
    else{
      toast.error("Invalid Mode")
    }
  }

  return (
    <div>
      <div className="flex gap-2 justify-center items-center">
        <button 
        className={`p-3 rounded-tl-lg rounded-tr-lg font-[500] transition-all duration-300 ease-in-out ${currentMode === "Login" ? "bg-[#0079fc] text-white" : "bg-gray-200 text-black"}`}
        onClick={() => setCurrectMode("Login")}
        >Login</button>

        <button
        className={`p-3 rounded-tl-lg rounded-tr-lg font-[500] transition-all duration-300 ease-in-out ${currentMode === "Register" ? "bg-[#0079fc] text-white" : "bg-gray-200 text-black"}`}
        onClick={() => setCurrectMode("Register")}
        >Register</button>
      </div>
      <div className="relative overflow-hidden">
        {currentMode === "Login" ? (
          <form className="w-full space-y-6 animate-in fade-in slide-in-from-left-5 duration-300" onSubmit={fromSubmission}>
            <div className="text-center mb-8">
                <h1 className="font-bold text-3xl text-red-600">Faculty Login</h1>
            </div>
            <div className="space-y-4">
              <Input type="text" label="Name" placeholder="Your Name" value={name} onChange={setName} />
              <Input type="text" label="Faculty Id" placeholder="XXXX" value={facultyId} onChange={setFacultyId} />
              <Input type="email" label="Email" placeholder="faculty@example.com" value={email} onChange={setEmail} />
              <Input type="password" label="Password" placeholder="password" value={password} onChange={setPassword} />
            </div>
            <div className="pt-4">
              <Button content="Login" color="primary" />
            </div>
        </form>
      ) : (
        <form className="w-full space-y-6 animate-in fade-in slide-in-from-right-5 duration-300" onSubmit={fromSubmission}>
          <div className="text-center mb-8">
              <h1 className="font-bold text-3xl text-red-600">Faculty Register</h1>
          </div>
          <div className="space-y-4">
            <Input type="text" label="Name" placeholder="Your Name" value={name} onChange={setName} />
            <Input type="text" label="Faculty Id" placeholder="XXXX" value={facultyId} onChange={setFacultyId} />
            <Input type="email" label="Email" placeholder="faculty@example.com" value={email} onChange={setEmail} />
            <Input type="password" label="Password" placeholder="password" value={password} onChange={setPassword} />
          </div>
          <div className="pt-4">
            <Button content="Register" color="primary" />
          </div>
        </form>
      )}
      </div>
    </div>
  )
}

export default FacultyForm