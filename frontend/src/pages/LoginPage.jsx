import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const{login} = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(formData);
    if(success) {
      navigate("/dashboard");
    }
    
    console.log("Submitted Data:", formData);

  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          id="name"
          type="text"
          required
          value={formData.name} // ✅ Corrected this
          onChange={onChange}
          placeholder="Enter name here..."
        />
        <br />
        <input
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={onChange}
          placeholder="Enter password here..."
        />
        <br />
        <button type="submit" className="btn btn-success">Success</button>
      </form>
    </div>
  );
};

export default LoginPage;
