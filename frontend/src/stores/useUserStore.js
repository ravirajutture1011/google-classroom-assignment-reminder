import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../libs/axios.js";

export const useUserStore = create((set, get) => ({
  user: null,
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
}));
