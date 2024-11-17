import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth.jsx"

const Root = () => {

    const navigate = useNavigate();
    const [username, email] = useAuth();

    const handleSignUpButtonPress = () => {
        navigate("/signup");
    }

    const handleLoginButtonPress = () => {
        navigate("/login");
    }

    return (
        <div className="root">
            <div className="root-title">
                <h1>PlanVacation</h1>
            </div>
            <div className="root-slogan">
                <h2>Find the most efficient routes for your next vacation</h2>
            </div>
            <div className="root-features">
                <div className="feature-header">
                    <h3>Explore Every Mode of Transportation</h3>
                </div>
                <div className="feature-description">
                    <p>Whether you're flying, driving, or taking a train, our platform helps you discover the best transportation options for every part of your journey.</p>
                </div>
                <div className="feature-header">
                    <h3>Optimize Costs and Avoid Hidden Fees</h3>
                </div>
                <div className="feature-description">
                    <p>Our cost estimator calculates the total expenses, including tolls and fuel costs, for every possible route in every part of the journey.</p>
                </div>
                <div className="feature-header">
                    <h3>Stay Ahead of Weather and Travel Disruptions</h3>
                </div>
                <div className="feature-description">
                    <p>Get real-time alerts on weather conditions and any potential travel delays, including storms or road closures.</p>
                </div>
                <div className="feature-header">
                    <h3>Always Up-to-Date with Real-Time Information</h3>
                </div>
                <div className="feature-description">
                    <p>Access live data on traffic, transportation schedules, and more.</p>
                </div>
            </div>
            <div className="root-options">
                <button onClick={handleSignUpButtonPress}>Sign Up</button>
                <button onClick={handleLoginButtonPress}>Login</button>
            </div>
        </div>
    )
}

export default Root;