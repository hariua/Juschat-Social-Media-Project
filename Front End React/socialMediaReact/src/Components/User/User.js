import React, { useState } from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './Header'
import Chat from './UserComponents/Chat/Chat'
import AddPost from './UserComponents/Create Post/AddPost'
import HashPost from './UserComponents/HashTagPost/HashPost'
import Home from './UserComponents/home/Home'
import AnotherUserProfile from './UserComponents/Profile/AnotherUserProfile'
import EditProfile from './UserComponents/Profile/EditProfile'
import UserPost from './UserComponents/Profile/UserPost'
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
                <Route path="/myProfile"><Header /><UserProfile /></Route>
                <Route path="/editProfile"><Header /><EditProfile /></Route>
                <Route path="/userProfile"><Header /><AnotherUserProfile /></Route>
                <Route path="/addPost"><Header /><AddPost /></Route>
                <Route path="/hashPost"><Header /><HashPost /></Route>
                <Route path="/chat"><Header /><Chat /></Route>
                <Route path='/userPost'><Header /><UserPost /></Route>
                
                
                
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
