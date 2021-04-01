import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Header from './Header'
import Home from './UserComponents/home/Home'
import SignIn from './UserComponents/SignIn/UserSignin'
import OtpSubmit from './UserComponents/Signup/OtpSubmit'
import SignUp from './UserComponents/Signup/UserSignup'

export default function User() {
    return (
        <div>
            <Router>
                <Route path='/' exact><SignIn /></Route>
                <Route path="/userSignup"><SignUp /></Route>
                <Route path ="/home"><Header /><Home /></Route>
                <Route path ="/otpSubmit"><OtpSubmit /></Route>
            </Router>
        </div>
    )
}
