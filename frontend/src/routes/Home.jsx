import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState} from "react";
import TripBox from '../components/trip_box'

axios.defaults.withCredentials = true;

const Home = () => {
    const [username, email] = useAuth();
    const [oldTrips, setOldTrips] = useState([]);
    const navigate = useNavigate();

    const handlePlanNewTrip = () => {
        navigate('/create-trip');
    }

    const handleDelete = (index) => {
        console.log(index);
        axios.post("http://localhost:1111/deleteTrip", {index: index})
        .then((response) => {
            if (response.data){
                const prevOldTrips = [...oldTrips];
                prevOldTrips.splice(index, 1);
                setOldTrips(prevOldTrips);
            } 
            else {
                alert("Unable to delete this trip")
            }
        })
        .catch(error => console.error("Error fetching info:", error));
    }

    useEffect(() => {
        axios.get("http://localhost:1111/getoldtrips")
        .then((response) => {
            console.log("oldtrips: ", response);
            console.log("oldtrips: ", response.data);
            setOldTrips(response.data.oldtrips);
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
        <>     
            <div className="home">
                <div className="home-title">
                    Welcome {username}
                </div>
                <div className="home-options">
                    <button onClick={handlePlanNewTrip}>New Trip</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
            {/* have a see all trips and shit as a child component that can display, or root */}
            <div>
                {oldTrips.map((element, index) => {
                    return(
                        <div className="trip-box-container" key={index}>
                            <TripBox 
                                tripInformation={element} 
                            />
                            <button onClick={() => handleDelete(index)}>Delete Trip</button>
                        </div>
                    )
                })}
            </div>  
        </>
    );
};

export default Home;