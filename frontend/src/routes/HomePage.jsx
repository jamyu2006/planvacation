import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState} from "react";

axios.defaults.withCredentials = true;

const HomePage = () => {
    const [username, email, uuid] = useAuth();
    const [oldTrips, setOldTrips] = useState([]);
    const navigate = useNavigate();

    const handlePlanNewTrip = () => {
        navigate('/plan-new-trip');
    }

    useEffect(() => {
        axios.get("http://localhost:1111/getoldtrips")
        .then((response) => {
            setOldTrips(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])

    const handleLogout = () => {
        axios.get("http://localhost:1111/logoutuser")
        .then((response)=>{
            if (response.data.success) {
                navigate("/")
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    if (!username) {
        return <div>Loading...</div>;
    }

    return (
        username &&
        <div className="Homepage">
            <div className="Homepage-welcome-message">
                Welcome {username}
            </div>
            <div className="options">
                <button onClick={handlePlanNewTrip}>Plan New Trip</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default HomePage;
