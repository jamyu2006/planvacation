import {useState} from 'react';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

axios.defaults.withCredentials = true;

const Login = () => {
    const [username, email] = useAuth();
    const [info, setInfo] = useState({email: "", password: ""});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const type = event.target.name;
        const value = event.target.value;
        setInfo(previnfo => ({...previnfo, [type]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:1111/authenticateUser", info)
        .then((response) => {
            if (response.data.success){
                navigate("/home");
            } else {
                setError("combo doesn't exist");
            }
        })
        .catch(error => console.error("Error fetching info:", error));
    }

    return(
        <div className='login'>
            <div className='loginmessage'>
                <h1>PlanVacation</h1>
            </div>
            <div className='loginform'>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='email' name = 'email' value = {info.email} onChange={handleChange}/><br></br>
                    <input type='password' placeholder='password' name ='password' value = {info.password} onChange={handleChange}/><br></br>
                    <input type='submit' value='LOGIN'/><br></br>
                    <Link to="/signup">Create new account</Link><br></br>
                    <label>{error}</label>
                </form>
            </div>
        </div>
    )
}
export default Login;
