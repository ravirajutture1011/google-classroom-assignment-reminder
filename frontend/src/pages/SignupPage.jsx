import React from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useUserStore } from "../stores/useUserStore.js";
const SignupPage = () => {
  const navigate = useNavigate();
   const {signup} = useUserStore();
   const handleGoogleSignup = async () => {
    console.log("Google Signup Clicked");
    try {
      const success = await signup(); // Wait for the signup process
      if (success) {
        toast.success("Login successful!"); // Show success message
         // Navigate after success
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
           Continue with Google
        </h2>
        <p className="text-center text-gray-500 mb-6">
        Sign in or Sign up using your Google account
        </p>
        <button
          onClick={handleGoogleSignup}
          className="btn btn-outline btn-primary flex items-center justify-center w-full py-3"
        >
          <FcGoogle className="text-xl mr-2" />Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
