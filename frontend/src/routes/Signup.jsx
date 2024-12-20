import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

axios.defaults.withCredentials = true;

const Signup = () => {
    const [username, email] = useAuth();
    const [info, setInfo] = useState({ email: "", username: "", password: "", confirm: "" })
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleChange = (event) => {
        const type = event.target.name;
        const value = event.target.value;
        setInfo(prevInfo => ({ ...prevInfo, [type]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const { email, username, password, confirm } = info;
        if ((email.length > 0) && (username.length > 0) && (password.length > 0) && (password === confirm)) {
            axios.post("http://localhost:1111/createUser", info)
                .then((response) => {
                    if (response.data.success) {
                       navigate('/home');
                    } else {
                        setError("This email has already been registered, or the username was taken");
                    }
                })
                .catch(error => console.error("Error fetching info:", error));
        } else {
            setError("You didn't enter an email/username, your password was too small, or it didn't match confirm")
        }
    }
    return (
        <div className='signup'>
            <div className='signupmessage'>
                <h1>PlanVacation</h1>
            </div>
            <div className='signupform'>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder='enter email' onChange={handleChange} /><br></br>
                    <input type="text" name="username" placeholder='create username' onChange={handleChange} /><br></br>
                    <input type="password" name="password" placeholder='create password' onChange={handleChange} /><br></br>
                    <input type="password" name="confirm" placeholder='confirm password' onChange={handleChange} /><br></br>
                    <input type="submit" value="CREATE ACCOUNT" /><br></br>
                    <Link to="/login">Already have an account</Link><br></br>
                    <label>{error}</label>
                </form>
            </div>
        </div>
    )

}

export default Signup;