import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './Header'
import Home from './UserComponents/home/Home'
import EditProfile from './UserComponents/Profile/EditProfile'
import UserProfile from './UserComponents/Profile/UserProfile'
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
                <Route path="/userProfile"><Header /><UserProfile /></Route>
                <Route path="/editProfile"><Header /><EditProfile /></Route>
            </Router>
            <ToastContainer position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
        </div>
    )
}
