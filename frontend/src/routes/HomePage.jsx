import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const HomePage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handlePlanNewTrip = () => {
        navigate('/plan-new-trip');
    }

    useEffect(() => {
        axios.get("http://localhost:1111/getinfo")
        .then((response) => {
            setUsername(response.data.user);
            setEmail(response.data.email);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching info:", error);
            setLoading(false);
        });
    }, []);

    if (loading) {
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
            </div>
        </div>
    );
};

export default HomePage;
