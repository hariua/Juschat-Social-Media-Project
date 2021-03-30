import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import SignIn from './UserComponents/SignIn/SignIn'
import SignUp from './UserComponents/Signup/SignUp'

export default function User() {
    return (
        <div>
            <Router>
                <Route path='/signIn'><SignIn /></Route>
                <Route path="/signUp"><SignUp /></Route>
            </Router>
        </div>
    )
}
