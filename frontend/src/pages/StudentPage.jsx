import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Trash2 } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const StudentPage = () => {
  const { user, studentCources, userCourses, getAssignments ,deleteCourse ,test} = useUserStore();
  const [assignments, setAssignments] = useState([]);
  const [course,setCourse] = useState(null);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    if (user?.id) {
      studentCources(user?.id);
    }
  }, [user?.id]);

  const clickHandler = async (courseId) => {
    setCourse(courseId);
    setLoading(true);

    console.log("printing current usrer" , user);

    const fetchedAssignments = await getAssignments(courseId);
    setAssignments(fetchedAssignments || []);
    setLoading(false);
  };
  const deleteCourseHandler = async () => {
    console.log("calling deleteCourse")
    await deleteCourse(course);
    console.log("after deleteCourse")
    setAssignments([]);
    studentCources(user.id);
  }

  return (
    <div className="mt-10 px-6 w-full  ">
      <div className="mt-20">
        {/* Header Section */}
        <div className="flex gap-3 justify-between">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Your Courses
          </h2>
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-emerald-400 transition flex items-center"
            >
              <PlusCircle size={20} className="mr-1" />
              Add Course
            </Link>

            <button
              onClick={deleteCourseHandler}
              className="text-gray-300 hover:text-emerald-400 transition flex items-center"
            >
              <Trash2 size={20} className="mr-1" />
              Delete Course
            </button>
            
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Courses Table (Takes 1 column) */}
          <div className="md:col-span-1">
            <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 border border-gray-600">
              {userCourses.length > 0 ? (
                <table className="w-full text-left border-collapse text-white">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3 border border-gray-600">
                        Course Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userCourses[0]?.courses?.map((course) => (
                      <tr
                        key={course.courseId}
                        className="hover:bg-gray-700 cursor-pointer"
                        onClick={() => clickHandler(course.courseId)}
                      >
                        <td className="p-3 border border-gray-600">
                          {course.courseName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400 p-3">No courses found</div>
              )}
            </div>
          </div>

          {/* Assignments Table (Takes 2 columns) */}
          <div className="md:col-span-2 overflow-x-auto">
            {loading ? (
              <div className="text-gray-400">Loading assignments...</div>
            ) : assignments.length > 0 ? (
              <table className="w-full text-left border-collapse border border-gray-600 text-white">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-gray-800">
                    <th className="p-3 border border-gray-600 w-1/4">
                      Assignment Title
                    </th>
                    <th className="p-3 border border-gray-600 w-5/12">
                      Description
                    </th>
                    <th className="p-3 border border-gray-600 w-2/12">
                      Due Date
                    </th>
                    <th className="p-3 border border-gray-600 w-2/12">
                      Updated Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, idx) => {
                    const { title, description, updateTime, dueDate, dueTime } =
                      assignment;

                    const year = dueDate.year;
                    const month = dueDate.month;
                    const day = dueDate.day;
                    let hours = dueTime.hours;
                    const minutes = dueTime.minutes;
                    const period = hours >= 12 ? "PM" : "AM";
                    const formattedHours = hours % 12 || 12;

                    return (
                      <tr
                        key={idx}
                        className="block md:table-row border-b md:border-none"
                      >
                        {/* Mobile View: Stacked Layout */}
                        <td className="p-3 border border-gray-600 block md:table-cell">
                          <span className="font-semibold md:hidden">
                            Title:{" "}
                          </span>
                          {title}
                        </td>
                        <td className="p-3 border border-gray-600 block md:table-cell">
                          <span className="font-semibold md:hidden">
                            Description:{" "}
                          </span>
                          {description}
                        </td>
                        <td className="p-3 border border-gray-600 block md:table-cell">
                          <span className="font-semibold md:hidden">
                            Due Date:{" "}
                          </span>
                          {year}-{month}-{day} {formattedHours}:
                          {minutes < 10 ? `0${minutes}` : minutes} {period}
                        </td>
                        <td className="p-3 border border-gray-600 block md:table-cell">
                          <span className="font-semibold md:hidden">
                            Updated:{" "}
                          </span>
                          {updateTime}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-400">No assignments found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
