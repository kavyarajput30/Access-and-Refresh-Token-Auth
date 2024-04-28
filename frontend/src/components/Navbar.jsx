import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await axios.get("http://localhost:8000/users/logout", {
      withCredentials: true,
    });
    if (res.data.success) {
      console.log(res);
      navigate("/login");
    }
  }
  return (
    <>
      <NavLink to="/home">Home </NavLink>
      <NavLink to="/register">Register </NavLink>
      <NavLink to="/login">Login </NavLink>
      <NavLink onClick={handleLogout}>Logout </NavLink>

    </>
  );
}

export default Navbar;
