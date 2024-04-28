import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const userContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            axios.get("http://localhost:8000/users/profile", { withCredentials: true })
                .then((res) => {
                    console.log(res.data.user);
                    setUser(res.data.user);
                })
                .catch((error) => {
                     if(error.response.data.error=="Generate Access Token Again"){
                            axios.get("http://localhost:8000/users/refreshToken", { withCredentials: true }).then((res) => {

                            axios.get("http://localhost:8000/users/profile", { withCredentials: true })
                            .then((res) => {
                                console.log(res.data.user);
                                setUser(res.data.user);
                            })
                            })
                     }

                     else if(error.response.data.error=="Login Again"){
                        setUser(null);
                        navigate("/login");

                     }          
                });
        }
    },[]); // Adding user as a dependency to avoid unnecessary re-fetching

    return (
        <userContext.Provider value={{ user, setUser }}>
            {children}
        </userContext.Provider>
    );
};

