import { useContext } from "react";
import { userContext } from "../context/UserContext.jsx";
function Dashboard() {
  const { user } = useContext(userContext);
  console.log(user);
  return (
    <>
      <h1>Dashboard</h1>
      {user ? (
      <p>{user.email}</p>
    ) : (
      <p>Loading...</p>
    )}
    </>
  );
}

export default Dashboard;
