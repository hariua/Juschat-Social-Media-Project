import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import SignIn from './UserComponents/SignIn/UserSignin'
import SignUp from './UserComponents/Signup/UserSignup'

export default function User() {
    return (
        <div>
            <Router>
                <Route path='/' exact><SignIn /></Route>
                <Route path="/userSignup"><SignUp /></Route>
            </Router>
        </div>
    )
}
