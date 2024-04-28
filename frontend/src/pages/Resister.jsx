import { useState } from "react";
import axios from 'axios';
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
function Resister() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const fullname = e.target.name;
    const value = e.target.value;

    return setData({ ...data, [fullname]: value });
  };

  const handleFormSubmit =async (e) =>{
    e.preventDefault();
   axios.post("http://localhost:8000/users/register", data, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    }
  }).then((res) =>{
    console.log(res.data);
    toast.success(res.data.message);
    setData({
      email: "",
      name: "",
      password: "",
    })
    navigate("/login");
  })
  .catch((error) =>{
   toast.error(error.response.data.error);
  })
  
  }
  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleInputChange}
        />

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleInputChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleInputChange}
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default Resister;
