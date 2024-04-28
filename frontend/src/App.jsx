import "./App.css";
import { Route, Routes } from "react-router-dom";
import {Toaster} from 'react-hot-toast'
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login";
import Resister from "./pages/Resister";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
function App() {
  return (
    <>
      <UserContextProvider>
      <Toaster position="top-center" toastOptions={{duration: 3000}} />
        <Navbar />
        <Routes>
          <Route path="/register" element={<Resister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
