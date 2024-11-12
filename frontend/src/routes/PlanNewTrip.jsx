// PlanNewTrip.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import useAuth from '../hooks/useAuth';
import axios from 'axios';

axios.defaults.withCredentials = true;

const libraries = ['places'];

const PlanNewTrip = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });
    const navigate = useNavigate();
    const [username, email, uuid] = useAuth();
    const [searchBox, setSearchBox] = useState(null);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');
    const [info, setInfo] = useState({
        uuid: '',
        tripname: '',
        defaultlocation: '',
        defaultaddress: '',
        triplocations: [],
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleLocationChange = (event) => {
        const { name, value } = event.target;
        setLocation(value);
    };

    const handleSaveAndReturn = () => {
        axios.post("http://localhost:1111/createTrip", info)
            .then((response) => {
                if (response.data) {
                    navigate("/home");
                } 
                else {
                    setError("something has been left blank");
                }
            })
            .catch((error) => {
                console.error("Error creating trip:", error);
            });
    };

    const handleSearchLoad = (searchBox) => {
        setSearchBox(searchBox);
    };

    const handlePlacesChanged = () => {
        if (searchBox && searchBox.getPlaces) {
            const places = searchBox.getPlaces();
            const place = places[0];
            const formattedPlace = {name: place.name, address: place.formatted_address};
            setLocation(formattedPlace.name);
            setInfo((prevInfo) => ({
                ...prevInfo,
                uuid: uuid,
                triplocations: [...prevInfo.triplocations, formattedPlace],
            }));
        }
    };

    if (!isLoaded || username == null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="PlanNewTrip">
            <h1>Plan a new trip</h1>
            <h2>Enter a title for the trip</h2>
            <input
                type="text"
                name="tripname"
                value={info.tripname}
                onChange={handleChange}
                placeholder="Trip Title"
            />
            <h2>Add locations to explore, include all stops</h2>
            <StandaloneSearchBox onLoad={handleSearchLoad} onPlacesChanged={handlePlacesChanged}>
                <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={handleLocationChange}
                    placeholder="Search for a location"
                />
            </StandaloneSearchBox>
            <div className="PlanNewTrip-locations">
                {info.triplocations.map((location, index) => (
                    <h3 key={index}>{location.name} - {location.address}</h3>
                ))}
            </div>
            <button onClick={handleSaveAndReturn}>Save Trip & Return to Home</button><br></br>
            {error}
        </div>
    );
};

export default PlanNewTrip;
