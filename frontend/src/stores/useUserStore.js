import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axiosInstance from "../libs/axios.js";
 


export const useUserStore = create(
  persist(
    (set,get)=>({
  user: null,
  courses : [],
  userCourses:[],
  loading :false,
  login: async ({name,password}) => {
    try {
      const response = await axiosInstance.post('/auth/login',{name,password});  
      set({ user: response.data });  
      toast.success("Login successful", { toastId: "uniqueToastId" });
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to login", { toastId: "uniqueToastId" });
    }
  },

  signup: async () => {
    try {
      set({loading: true});
      window.open("http://localhost:5000/api/auth/google", "_self"); 
    } catch (error) {
      set({loading : false})
      console.error("Error in signup:", error);
      toast.error("Failed to signup", { toastId: "signupError" });
    }
  },

  logout : async ()=>{
    try{
       await axiosInstance.post('/auth/logout')
       set({ user: null });
       toast.success("Logged out successfully", { toastId: "uniqueToastId" });
    }
    catch(e){
      console.log("error in logout",e.message);
      toast.error("Failed to logout", { toastId: "uniqueToastId" });
    }
  },

  refreshToken : async ()=>{
   try{
      set({ loading: true });  
      await axiosInstance.post('/auth/refresh-token');
      set({ loading: false });  
    }
    catch(e){
      console.log("error in refreshToken",e.message);
      toast.error("Failed to refresh token", { toastId: "uniqueToastId" });
    }
   },
  getAllCources: async () => {
    try {
      set({ loading: true }); // Start loading
      const response = await axiosInstance.get('classroom/course-list');
      // console.log(response);
      set({ courses: response.data.data });
    } catch (error) {
      console.log("Error in getAllCources", error);
      toast.error("Failed to fetch courses", { toastId: "uniqueToastId" });
    } finally {
      set({ loading: false }); // Stop loading (Always runs)
    }
  },
  userInfo : async()=>{
    try{
      const response = await axiosInstance.get('/auth/user-info'); 
      console.log("Printing the resopnse ::::" + JSON.stringify(response.data, null, 2));
      set({ user: response.data });
      // console.log("user ====>>>>>" + user)
    }
    catch(e){
      console.log("error in userInfo",e.message);
      toast.error("Failed to fetch user info", { toastId: "uniqueToastId" });
    }
  },
  saveCources : async ({googleId,selectedCourses})=>{
    try{
      set({ loading: true });  
      await axiosInstance.post('classroom/selected-courses',{googleId,selectedCourses});
      toast.success("Courses saved successfully", { toastId: "uniqueToastId" });
    }
    catch(e){
      set({ loading: false });
      console.log("error in saveCources",e.message);
      toast.error(e.message);
    }
  },
  studentCources : async(id)=>{
    try{
      // console.log("id in studentCources", id);
      set({ loading: true });  
      const response = await axiosInstance.get(`classroom/student-courses/${id}`);
      // console.log("printing data inside studentCourses")
      // console.log(response);
      set({ userCourses: response.data.data});
    }
    catch(e){
      set({ loading: false });
      console.log("error in studentCources store",e.message);
      toast.error(e.message);
    } finally {
      set({ loading: false }); // Stop loading (Always runs)
    }
  },
      getAssignments: async (courseId) => {
        try {
          set({ loading: true });
          console.log("Fetching assignments for course:", courseId);
          
          const response = await axiosInstance.get(`classroom/assignment-list/${courseId}`);
          const fetchedAssignments = response.data.assignments;

          console.log("Assignments received:", fetchedAssignments);
         
          set({loading:false});
          return fetchedAssignments;
          
        } catch (e) {
          set({ loading: false });
          console.log("Error in getAssignments store", e.message);
          toast.error(e.message);
        }
      },

      deleteCourse  : async (courseId)=>{
        try{
          set({loading:true}); 
          const { user } = get();
          console.log("printing user data", user);
          console.log(`hitting classroom/delete-course/${user.id}/${courseId} `)
          await axiosInstance.delete(`classroom/delete-course/${user.id}/${courseId}`);

          set({loading:false});
          console.log("printing user data  : " ,user)
          toast.success("Course deleted successfully", { toastId: "uniqueToastId" });
        }
        catch(e){
          console.log("error in deleteCourse",e.message);
          toast.error(e.message);
        }
  
      },
    delete : async ()=>{
      await axiosInstance.delete(`classroom/delete-route`);
    },
    test : async ()=>{
      const id = 5
      await axiosInstance.get(`classroom/test/${id}`);
    }

    }),
    {
      name : "user-storage",
      storage: createJSONStorage(()=> localStorage)
    }
  )
)

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axiosInstance(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
