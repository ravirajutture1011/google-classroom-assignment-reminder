import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";

const HomePage = () => {

  const {userInfo,user} = useUserStore();

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const profileClickHandler = async () => {
    console.log("calling userinfo");
    await userInfo();
    console.log("After calling userInfo"); 
    handleNavigation("/profile");
  };
  


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-white text-2xl font-bold">Course Manager</h1>
            <div className="space-x-4">
              <button
                className="btn btn-primary"
                onClick={() => handleNavigation("/add-course")}
              >
                Add New Course
              </button>
              <button
                className="btn btn-error"
                // onClick={() => handleNavigation("/delete-course")}
              >
                Delete Course
              </button>
              <button
                className="btn btn-secondary"
                onClick={profileClickHandler}
              >
                Your Profile
              </button>

              <button
                className="btn btn-warning"
                onClick={() => {
                  handleNavigation("/login");
                  toast.success("Logged out successfully!");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-16 text-center px-4">
        <h2 className="text-4xl font-bold text-gray-800">Welcome to Course Manager</h2>
        <p className="text-gray-600 mt-4 text-lg">
          Select and manage your courses with ease!
        </p>
        <button
          className="btn btn-accent mt-6 px-6 py-3 text-lg"
          onClick={() => handleNavigation("/dashboard")}
        >
          Explore Courses
        </button>
      </div>
    </div>
  );
};

export default HomePage;
