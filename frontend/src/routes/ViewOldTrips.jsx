import { useNavigate } from 'react-router-dom';

const ViewOldTrips = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <div>
            <h1>Here are all your trips</h1>
            <h2>Below would show a list of trips that each user went on</h2>
            <button onClick={handleClick}>Return to home</button>
        </div>
    );
};

export default ViewOldTrips;
