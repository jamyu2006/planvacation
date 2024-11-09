import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanNewTrip = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [spot, setSpot] = useState('');
    const [spots, setSpots] = useState([]);

    const handleAddSpot = () => {
        if (spot) {
            setSpots([...spots, spot]);
            setSpot('');
        }
    };

    const handleCalculatePaths = () => {
        
    };

    const handleSubmit = () => {
        navigate('/');
    };

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
            <input
                type="text"
                value={spot}
                onChange={(e) => setSpot(e.target.value)}
                placeholder="Add a spot"
            />
            <button onClick={handleAddSpot}>Add Spot</button>
            <ul>
                {spots.map((s, index) => (
                    <h3 key={index}>{s}</h3>
                ))}
            </ul>
            <button onClick={handleCalculatePaths}>Calculate Paths</button>
            <button onClick={handleSubmit}>Save Trip & Return to Home</button>
        </div>
    );
};

export default PlanNewTrip;
