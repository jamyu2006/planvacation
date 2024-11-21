import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

axios.defaults.withCredentials = true;
const libraries = ['places'];
const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const CreateTrip = () => {
    const [tripName, setTripName] = useState('');
    const [startingLocationInput, setStartingLocationInput] = useState('');
    const [tripLocationInput, setTripLocationInput] = useState('');
    const [startingLocation, setStartingLocation] = useState('');
    const [tripLocations, setTripLocations] = useState([]);
    const [startingLocationAutocomplete, setStartingLocationAutocomplete] = useState(null);
    const [tripLocationAutocomplete, setTripLocationAutocomplete] = useState(null);
    const navigate = useNavigate();

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: key,
        libraries,
    })

    const handleTripNameChange = (newTripName) => {
        setTripName(newTripName);
    }

    const handleStartingLocationInputChange = (newStartingLocationInput) => {
        setStartingLocationInput(newStartingLocationInput);
    }

    const handleTripLocationInputChange = (newTripLocationInput) => {
        setTripLocationInput(newTripLocationInput);
    }

    const isValidLocation = (location) => {
        return new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({address: location}, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    resolve(true);
                    return;
                }
                resolve(false);
            });
        });
    }

    const addStartingLocation = async () => {
        const isLocationValid = await isValidLocation(startingLocationInput);
        if (isLocationValid) {
            setStartingLocation(startingLocationInput);
            return;
        }
        alert('The starting location you entered could not be found');
    }

    const addTripLocation = async () => {
        const isLocationValid = await isValidLocation(tripLocationInput);
        if (isLocationValid) {
            setTripLocations((prevTripLocations) => [...prevTripLocations, tripLocationInput]);
            return;
        }
        alert('The trip location you entered could not be found');
    }

    const handleStartingLocationPlaceChanged = () => {
        const place = startingLocationAutocomplete.getPlace();
        setStartingLocationInput(place.formatted_address);
    }

    const handleTripLocationPlaceChanged = () => {
        const place = tripLocationAutocomplete.getPlace();
        setTripLocationInput(place.formatted_address);
    }

    const handleCalculateRoutes = () => {
        if (tripName === '' || startingLocation === '' || tripLocations.length === 0) {
            alert("Some sections are blank, or no locations have been added");
            return;
        }
        const tripInfo = { tripName: tripName, startingLocation: startingLocation, tripLocations: tripLocations };
        axios.post("http://localhost:1111/createTrip", tripInfo)
            .then((response) => {
                if (response.data) {
                    navigate('/view-possible-routes', { 
                        state: {startingLocation, tripLocations}
                    });
                }
                else {
                    alert("A problem occurred with saving the trip and calculating routes");
                    navigate("/home");
                }
            })
            .catch(error => console.error("Error posting info:", error));
    };

    const handleSaveTrip = () => {
        if (tripName == '' || startingLocation == '' || tripLocations.length == 0) {
            alert("Some sections are blank, or no locations have been added");
            return;
        }
        const tripInfo = { tripName: tripName, startingLocation: startingLocation, tripLocations: tripLocations };
        axios.post("http://localhost:1111/createTrip", tripInfo)
            .then((response) => {
                if (response.data) {
                    navigate("/home");
                }
                else {
                    alert("A problem occurred with saving your trip");
                    navigate("/home");
                }
            })
            .catch(error => console.error("Error posting info:", error));
    }

    if (!isLoaded) {
        return <div className="loading-message">Loading...</div>;
    }

    return (
        <div className="create-trip">
            <div className="create-trip-title">
                <h2>Create Your Trip</h2>
            </div>
            <div className="create-trip-form">
                <div className="create-trip-question">
                    <div className="input-container">
                        <input onChange={(event) => handleTripNameChange(event.target.value)} placeholder='Enter a Name For Your Trip'></input>
                    </div>
                    <h3>Enter Your Starting Location</h3>
                    <div className="input-container">
                        <Autocomplete onLoad={(autocomplete) => setStartingLocationAutocomplete(autocomplete)} onPlaceChanged={handleStartingLocationPlaceChanged}>
                            <input value={startingLocationInput} onChange={(event) => handleStartingLocationInputChange(event.target.value)} />
                        </Autocomplete>
                        <button onClick={addStartingLocation}>Add</button>
                    </div>
                    <h3>Enter All Additional Locations You Would Like to Journey, In Order</h3>
                    <div className="input-container">
                        <Autocomplete onLoad={(autocomplete) => setTripLocationAutocomplete(autocomplete)} onPlaceChanged={handleTripLocationPlaceChanged}>
                            <input value={tripLocationInput} onChange={(event) => handleTripLocationInputChange(event.target.value)} />
                        </Autocomplete>
                        <button onClick={addTripLocation}>Add</button>
                    </div>
                </div>
            </div>
            <div className="trip-locations">
                <h3>Below Are All Your Traveling Destinations</h3>
                <h4>Destinations</h4>
                <h5>{startingLocation ? (`${startingLocation} (Starting Location)`) : ('Starting Location has not been added yet')}</h5>
                <h5>{tripLocations.length == 0 ? ("No destinations have been added") : ('')}</h5>
                {tripLocations.map((location, index) => (
                    <h5 key={index}>Location {index+2}: {location}</h5>
                ))}
            </div>
            <div className='create-trip-options'>
                <button onClick={handleCalculateRoutes}>Calculate All Possible Pathways</button>
                <button onClick={handleSaveTrip}>Save Trip And Return To Home</button>
            </div>
        </div>
    )
}

export default CreateTrip;
