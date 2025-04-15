import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, PlusCircle, Trash2, LogOut,BookOpen ,LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
  const {logout} = useUserStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async()=>{
    await logout();
    navigate("/signup");
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-emerald-400">
          Course Manager
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="sm:hidden text-gray-300 focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <nav className={`sm:flex sm:items-center gap-6 
          ${menuOpen ? "flex flex-col absolute top-16 left-0 w-full bg-gray-900 py-4 shadow-md" : "hidden"}
          sm:static sm:bg-transparent sm:w-auto sm:flex-row sm:py-0
        `}>
          
          <Link to="/dashboard" className="text-gray-300 hover:text-emerald-400 transition flex items-center">
            <PlusCircle size={20} className="mr-1"/>
            Add Course
          </Link>

          <Link to="/student" className="text-gray-300 hover:text-emerald-400 transition flex items-center">
            <BookOpen size={20} className="mr-1"/>
            Your Cources
          </Link>

 

          <Link to="/profile" className="text-gray-300 hover:text-emerald-400 transition flex items-center">
            <User size={20} className="mr-1"/>
            Profile
          </Link>


          <Link to ="/signup">
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
            onClick={() => navigate("/login")}
          >
            <LogIn size={18} />
            <span className="ml-2">Login</span>
          </button>
          </Link>

          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
            onClick={() => navigate("/login")}
          >
            <LogOut size={18} onClick={handleLogout} />
            <span className="ml-2">Logout</span>
          </button>

          

        </nav>
      </div>
    </header>
  );
};

export default Navbar;
