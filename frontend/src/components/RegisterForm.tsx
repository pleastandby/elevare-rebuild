import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { backendUrl } from "../App";


const RegisterForm = ({setToken} : {setToken: (token: string) => void}) => {

  const [name, setName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [department, setDepartment] = useState('')
  const [semester, setSemester] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const formSubmission = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
        const response = await axios.post(backendUrl + "/api/student/register", {name, rollNo, department, semester, email, password})
        if(response.data.success){
            toast.success("Student registration successful!")
            setToken(response.data.token)
        }else{
            toast.error(response.data.message || 'Registration failed')
        }
    } catch (error : any) {
        console.log(error);
        if (error.response?.status === 400) {
            toast.error('Invalid registration details. Please check your information.')
        } else if (error.response?.status === 409) {
            toast.error('Email already registered. Please use a different email.')
        } else if (!error.response) {
            toast.error('Network error. Please check your connection.')
        } else {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
        }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={formSubmission}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Registration</h2>
        <p className="text-gray-600">Create your student account to get started</p>
      </div>
      
      <div className="space-y-4">
        <Input 
          type="text" 
          label="Full Name" 
          placeholder="Your full name" 
          value={name}
          onChange={setName}
        />
        <Input 
          type="text" 
          label="Roll Number" 
          placeholder="Your roll number" 
          value={rollNo}
          onChange={setRollNo}
        />
        <Input 
          type="text" 
          label="Department" 
          placeholder="Your department" 
          value={department}
          onChange={setDepartment}
        />
        <Input 
          type="number" 
          label="Semester" 
          placeholder="Current semester (1-8)" 
          value={semester}
          onChange={setSemester}
        />
        <Input 
          type="email" 
          label="Email" 
          placeholder="Your email address" 
          value={email}
          onChange={setEmail}
        />
        <Input 
          type="password" 
          label="Password" 
          placeholder="Your password"
          value={password}
          onChange={setPassword}
        />
      </div>
      
      <div className="pt-4">
        <Button content="Create Student Account" color="primary" disabled={isLoading}/>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account? 
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="text-gray-900 hover:text-gray-700 font-medium ml-1"
          >
            Login here
          </button>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm