import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

export default function ViewTrip() {
    const location = useLocation();
    const navigate = useNavigate();
    const { tripInformation } = location.state || {}; // Destructure the passed state
    
    console.log(tripInformation)
    console.log(tripInformation.tripLocations)

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Trip Details</h1>
            {tripInformation ? (
                <div>
                    <p><strong>Trip Name:</strong> {tripInformation.tripName}</p>
                    <p><strong>Starting Location:</strong> {tripInformation.startingLocation}</p>
                    {tripInformation.tripLocations.map((name,index) => {
                        return (
                            <p><strong>location {index+2}:</strong> {name}</p>
                        )
                    })}     
                </div>
            ) : (
                <p>No trip data available. Please select a trip.</p>
            )}

            <button 
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }} 
                onClick={() => navigate(-1)}  // This navigates back to the previous page
            >
                Back
            </button>
        </div>
    );
}