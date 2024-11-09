import { useNavigate } from 'react-router-dom';

const PlanNewTrip = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <div className="PlanNewTrip-message">
            <h1>Plan a new trip</h1>
            <h2>Enter a title for the trip</h2>
            <h2>Add spots to explore, include all stops</h2>
            <h2>This is incomplete, but I plan to work on this more tomorrow - syed...</h2>
            <button onClick={handleClick}>Return to Home</button>
        </div>
    );
};

export default PlanNewTrip;
