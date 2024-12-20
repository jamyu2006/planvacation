import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

axios.defaults.withCredentials = true;

const useAuth = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get("http://localhost:1111/getinfo")
            .then((response) => {
                if (response.data.username == null) {
                    if (location.pathname != "/" && location.pathname != "/login" && location.pathname != "/signup") {
                        navigate("/");
                    }
                } 
                else {
                    if (location.pathname == "/" || location.pathname == "/login" || location.pathname == "/signup") {
                        navigate("/home")
                    }
                    setEmail(response.data.email);
                    setUsername(response.data.username);
                }
            })
            .catch(error => {
                console.error("Error fetching info:", error);
            });
    }, [location.pathname]);

    return [username, email];
};

export default useAuth;
