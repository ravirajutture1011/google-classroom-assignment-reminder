import React from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
const HomePage = () => {
  const navigate = useNavigate();
  const clickhandler = ()=>{
    navigate('/login');
    toast.success("Button is clicked", { toastId: "uniqueToastId" });
  }
  return (
    <div>
      <h1>This is the Home Page</h1>
      <p>Welcome to the React App!</p>
      <button onClick={clickhandler}>Click Me</button>
    </div>
  )
}

export default HomePage