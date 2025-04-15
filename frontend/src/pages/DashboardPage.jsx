import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore.js";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { courses, getAllCources, loading, saveCources,user,userInfo } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCources();
    // userInfo();
  }, []);

  // console.log("Printing user information ... in dashboard...",user);
  // Filtered courses based on search
  const filteredCourses = searchQuery
    ? courses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses; // Show all courses if no search input

  // Toggle selection of courses
  const toggleCourseSelection = (course) => {
    setSelectedCourses((prev) => {
        const existingCourse = prev.find(item => item.id === course.id);

        if (existingCourse) {
            // Course already selected, remove it
            return prev.filter(item => item.id !== course.id);
        } else {
            // Course not selected, add it
            return [...prev, { id: course.id, name: course.name }];
        }
    });
};

  // Save selected courses
  const saveSelectedCourses = async () => {
    try {
      // console.log("printing selected courses ...")
      // console.log(selectedCourses);
      const res = saveCources({googleId :user.id , selectedCourses});
      if(res){
        navigate('/student')
      }
      
    } catch (error) {
      console.error("Failed to save courses", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-blue-600 mb-6">
        Welcome to Your Dashboard 🎓
      </h1>

      {/* Search Input */}
      <div className="relative w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="🔍 Search for a course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      {/* Courses */}
      {loading ? (
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading courses...
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Available Courses:
          </h2>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => toggleCourseSelection(course)}
                  className={`cursor-pointer p-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl border-2 ${
                    selectedCourses.some((item)=> item.id === course.id)
                      ? "bg-blue-500 text-white border-blue-700"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <h3 className="text-lg font-bold text-black">{course.name}</h3>
                  <p className="text-gray-600 mt-2">📚 Learn something new today!</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-3">
                No matching courses found.
              </p>
            )}
          </div>

          {/* Save Button */}
          {selectedCourses.length > 0 && (
            <button
              onClick={saveSelectedCourses}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all"
            >
              Save Selected Courses ✅
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
