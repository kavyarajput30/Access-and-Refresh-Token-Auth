import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import toast from 'react-hot-toast'  
function Login() {
  const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: "",
      });
      const handleInputChange = (e) => {
        const fullname = e.target.name;
        const value = e.target.value;
    
        return setData({ ...data, [fullname]: value });
      };
      const handleFormSubmit =async (e) =>{
        e.preventDefault();
     axios.post("http://localhost:8000/users/login", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      }).then((res) =>{
        console.log(res.data);
        toast.success(res.data.message);
        navigate("/dashboard");
      }).catch((error) =>{
        toast.error(error.response.data.error);
      })

      }
    return (
        <>
        <form onSubmit={handleFormSubmit}>
         <label>
             Email
         </label>
         <input type="email" name='email' value={data.email} onChange={handleInputChange} />
 
         <label>
             Password
         </label>
         <input type="password" name='password' value={data.password} onChange={handleInputChange}/>
         <button type="submit" style={{backgroundColor:"blue"}}>Login</button>
        </form>
        </>
    )
}

export default Login