import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { backendUrl } from "../App";


const RegisterForm = ({setToken} : {setToken: (token: string) => void}) => {

  const [name, setName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const formSubmission = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
        const response = await axios.post(backendUrl + "/api/user/register", {name, rollNo, email, password})
        if(response.data.success){
            toast.success(response.data.message)
            setToken(response.data.token)
        }else{
            toast.error(response.data.message)
        }
    } catch (error : any) {
        console.log(error);
        toast.error(error.response.data.message);
    }
  }

  return (
    <form className="w-full space-y-6" onSubmit={formSubmission}>
      <div className="text-center mb-8">
        <h1 className="font-bold text-3xl text-gray-800">Register</h1>
      </div>
      <div className="space-y-4">
        <Input 
          type="text" 
          label="Name" 
          placeholder="Your Name" 
          value={name}
          onChange={setName}
        />
        <Input 
          type="text" 
          label="Roll Number" 
          placeholder="Your Roll No" 
          value={rollNo}
          onChange={setRollNo}
        />
        <Input 
          type="email" 
          label="Email" 
          placeholder="someone@example.com" 
          value={email}
          onChange={setEmail}
        />
        <Input 
          type="password" 
          label="Password" 
          placeholder="password" 
          value={password}
          onChange={setPassword}
        />
      </div>
      <div className="pt-4">
        <Button content="Register" color="primary"/>
      </div>
    </form>
  )
}

export default RegisterForm