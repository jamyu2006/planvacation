import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import axios from 'axios';

const PlanNewTrip = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [uuid, setUuid] = useState(null);
    const [spot, setSpot] = useState('');
    const [spots, setSpots] = useState([]);
    const [searchBox, setSearchBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    const handleAddSpot = () => {
        if (spot) {
            setSpots([...spots, spot]);
            setSpot('');
        }
    };

    useEffect(() => {
        axios.get("http://localhost:1111/getinfo")
            .then((response) => {
                setUuid(response.data.uuid);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching info:", error);
                setLoading(false);
            });
    }, []);

    const handleSaveAndReturn = () => {
        const tripInfo = {
            uuid: uuid,
            tripname: title,
            defaultlocation: "commack",
            defaultaddress: "commack",
            triplocations: spots
        };

        axios.post("http://localhost:1111/createTrip", tripInfo)
            .then((response) => {
                if (response.data) {
                    navigate("/home");
                } else {
                    setError("Combo doesn't exist");
                }
            })
            .catch(error => {
                console.error("Error creating trip:", error);
                setError("There was an error saving your trip.");
            });
    };

    const handleSearchLoad = (searchBox) => {
        setSearchBox(searchBox);
    };

    const handlePlacesChanged = () => {
        if (searchBox && searchBox.getPlaces) {
            const places = searchBox.getPlaces();
            if (places.length === 0) {
                return;
            }
            const place = places[0];
            const formattedPlace = place.name;
            setSpot(formattedPlace);
        }
    };

    if (loading || !isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="PlanNewTrip-message">
            <h1>Plan a new trip</h1>
            <h2>Enter a title for the trip</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Trip Title"
            />
            <h2>Add spots to explore, include all stops</h2>

            <StandaloneSearchBox
                onLoad={handleSearchLoad}
                onPlacesChanged={handlePlacesChanged}
            >
                <input
                    type="text"
                    value={spot}
                    onChange={(e) => setSpot(e.target.value)}
                    placeholder="Search for a spot"
                />
            </StandaloneSearchBox>

            <button onClick={handleAddSpot}>Add Spot</button>
            <div className='PlanNewTrip-spots'>
                {spots.map((s, index) => (
                    <h3 key={index}>{s}</h3>
                ))}
            </div>

            {error && <div className="error-message">{error}</div>}
            <button onClick={handleSaveAndReturn}>Save Trip & Return to Home</button>
        </div>
    );
};

export default PlanNewTrip;
