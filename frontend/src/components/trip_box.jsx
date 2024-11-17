import React from 'react';
import {useNavigate} from 'react-router-dom'

export default function TripBox({tripInformation}) {
    const navigate = useNavigate();

    const style = {
        backgroundColor: "rgba(0,0,0,0)", // Fix to ensure the color is valid
        width: "100px",
        height: "100px",
        display: "flex",
        flexDirection: "column", // Stack the text vertically
        justifyContent: "center",
        alignItems: "left",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        margin: "10px",
        overflow: "hidden", // Hides any content overflowing the box
        textOverflow: "ellipsis", // Adds "..." to truncated text
        whiteSpace: "nowrap", // Prevents wrapping of text
    };

    const handleClick = () => {
        navigate('/home/viewtrip', {
            state: {
                tripInformation
            },
        });
    };

    return (
        <div style={style} onClick={handleClick}>
            <div>{tripInformation.tripName}</div>
            <div>{tripInformation.startingLocation}</div>
            <div>{tripInformation.tripLocations[0]}</div>
            <div>{tripInformation.tripLocations[1]}</div>
        </div>
    );
}