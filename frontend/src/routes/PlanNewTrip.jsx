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
    const [defaultSearchBox, setDefaultSearchBox] = useState(null);
    const [exploreSearchBox, setExploreSearchBox] = useState(null);
    const [error, setError] = useState('');
    const [defaultLocationInput, setDefaultLocationInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [info, setInfo] = useState({
        uuid: '',
        tripname: '',
        defaultlocation: '',
        triplocations: [],
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "tripname") {
            setInfo((prevInfo) => ({
                ...prevInfo,
                tripname: value,
            }));
        }
    };

    const handleSaveAndReturn = () => {
        axios.post("http://localhost:1111/createTrip", info)
            .then((response) => {
                if (response.data) {
                    navigate("/home");
                } else {
                    setError("something has been left blank");
                }
            })
            .catch((error) => {
                console.error("Error creating trip:", error);
            });
    };

    const handleDefaultLocationPlacesChanged = () => {
        if (defaultSearchBox && defaultSearchBox.getPlaces) {
            const places = defaultSearchBox.getPlaces();
            const place = places[0];
            const formattedPlace = { name: place.name, address: place.formatted_address };
            setInfo((prevInfo) => ({
                ...prevInfo,
                uuid: uuid,
                defaultlocation: formattedPlace
            }));
            setDefaultLocationInput(formattedPlace.name);
        }
    };

    const handlePlacesChanged = () => {
        if (exploreSearchBox && exploreSearchBox.getPlaces) {
            const places = exploreSearchBox.getPlaces();
            const place = places[0];
            const formattedPlace = { name: place.name, address: place.formatted_address };
            setInfo((prevInfo) => ({
                ...prevInfo,
                uuid: uuid,
                triplocations: [...prevInfo.triplocations, formattedPlace],
            }));
            setLocationInput('');
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
            <h2>Enter your current location</h2>
            <StandaloneSearchBox onLoad={setDefaultSearchBox} onPlacesChanged={handleDefaultLocationPlacesChanged}>
                <input
                    type="text"
                    value={defaultLocationInput}
                    onChange={(e) => setDefaultLocationInput(e.target.value)}
                    placeholder="Search for a location"
                />
            </StandaloneSearchBox>
            <h2>Add locations to explore, include all stops</h2>
            <StandaloneSearchBox onLoad={setExploreSearchBox} onPlacesChanged={handlePlacesChanged}>
                <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Search for a location"
                />
            </StandaloneSearchBox>
            <div className="PlanNewTrip-locations">
                {<h3>{info.defaultlocation.name}</h3>}
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
