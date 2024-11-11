import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';

const Root = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  }

  return (
    <div className="root">
      <div className="root-message">
        <h1>PlanVacation</h1>
        <h2>Find the most efficient routes for your next vacation</h2>
      </div>
      <div className="root-features">
        <h3>Explore Every Mode of Transportation</h3>
        <p>Whether you're flying, driving, or taking a train, our platform helps you discover the best transportation options for every part of your journey.</p>

        <h3>Optimize Costs and Avoid Hidden Fees</h3>
        <p>Our cost estimator calculates the total expenses, including tolls and fuel costs, for every possible route in every part of the journey.</p>

        <h3>Stay Ahead of Weather and Travel Disruptions</h3>
        <p>Get real-time alerts on weather conditions and any potential travel delays, including storms or road closures.</p>

        <h3>Always Up-to-Date with Real-Time Information</h3>
        <p>Access live data on traffic, transportation schedules, and more.</p>
      </div>
      <div className="root-options">
        <button onClick={handleSignup}>Sign up</button><br></br><br></br>
        Already started? <Link to="/login">Log in</Link> to see your saved trips.<br></br>
      </div>
    </div>
  );
};

export default Root;
