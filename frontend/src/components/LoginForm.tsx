import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { backendUrl } from "../App";

const LoginForm = ({setToken} : {setToken: (token: string) => void}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const formSubmission = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
        const endpoint = role === 'faculty' ? '/api/student/facultylogin' : '/api/student/login'
        const response = await axios.post(backendUrl + endpoint, {email, password})
        if(response.data.success){
            toast.success(`Welcome back!`)
            setToken(response.data.token)
        }else{
            toast.error(response.data.message || 'Login failed')
        }
    } catch (error : any) {
        console.log(error);
        // Handle specific error cases
        if (error.response?.status === 401) {
            toast.error('Incorrect email or password. Please try again.')
        } else if (error.response?.status === 404) {
            toast.error('Account not found. Please check your credentials.')
        } else if (error.response?.status === 400) {
            toast.error('Invalid login credentials. Please try again.')
        } else if (!error.response) {
            toast.error('Network error. Please check your connection.')
        } else {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.')
        }
    } finally {
        setIsLoading(false)
    }
}

  const handleForgotPassword = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
        const response = await axios.post(backendUrl + "/api/student/forgot-password", {email: forgotEmail})
        if(response.data.success){
            toast.success(response.data.message || 'OTP sent to your email')
            setOtpSent(true)
        }else{
            toast.error(response.data.message || 'Failed to send OTP')
        }
    } catch (error : any) {
        console.log(error);
        if (error.response?.status === 404) {
            toast.error('Email address not found in our system.')
        } else if (!error.response) {
            toast.error('Network error. Please check your connection.')
        } else {
            toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
        }
    } finally {
        setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }
    
    try {
        const response = await axios.post(backendUrl + "/api/student/verify-otp", {
            email: forgotEmail,
            otp,
            newPassword
        })
        if(response.data.success){
            toast.success(response.data.message || 'Password reset successfully')
            setShowForgotPassword(false)
            setOtpSent(false)
            setForgotEmail('')
            setOtp('')
            setNewPassword('')
            setConfirmPassword('')
        }else{
            toast.error(response.data.message || 'Failed to reset password')
        }
    } catch (error : any) {
        console.log(error);
        if (error.response?.status === 400) {
            toast.error('Invalid or expired OTP. Please try again.')
        } else if (!error.response) {
            toast.error('Network error. Please check your connection.')
        } else {
            toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.')
        }
    } finally {
        setIsLoading(false)
    }
  }

  const resetForgotPasswordFlow = () => {
    setShowForgotPassword(false)
    setOtpSent(false)
    setForgotEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
  }

  if (showForgotPassword) {
    if (!otpSent) {
      return (
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter your email to receive OTP</p>
          </div>
          <div className="space-y-4">
            <Input 
              type="email" 
              label="Email" 
              placeholder="Your email address" 
              value={forgotEmail}
              onChange={setForgotEmail}
            />
          </div>
          <div className="space-y-3">
            <Button content="Send OTP" color="primary" disabled={isLoading}/>
            <button
              type="button"
              onClick={resetForgotPasswordFlow}
              className="w-full text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </form>
      )
    } else {
      return (
        <form className="space-y-6" onSubmit={handleVerifyOTP}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
            <p className="text-gray-600">Enter OTP and new password</p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-center text-xl font-mono"
              />
            </div>
            <Input 
              type="password" 
              label="New Password" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <Input 
              type="password" 
              label="Confirm Password" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>
          <div className="space-y-3">
            <Button content="Reset Password" color="primary" disabled={isLoading}/>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Back to Email
            </button>
            <button
              type="button"
              onClick={resetForgotPasswordFlow}
              className="w-full text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </form>
      )
    }
  }

  return (
    <form className="space-y-6" onSubmit={formSubmission}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {role === 'faculty' ? 'Faculty Login' : 'Student Login'}
        </h2>
        <p className="text-gray-600">Enter your credentials to access your account</p>
      </div>

      {/* Role Selection */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            role === 'student'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole('faculty')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            role === 'faculty'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Faculty
        </button>
      </div>

      <div className="space-y-4">
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

      <div className="space-y-3">
        <Button content="Login" color="primary" disabled={isLoading}/>
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="w-full text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  )
}

export default LoginForm