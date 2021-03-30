import React,{useState} from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import SignIn from './AdminComponents/SignIn/SignIn'

export default function Admin() {
    
    return (
        <div>
            <Router>
                <Route path="/admin" exact><SignIn /></Route>
               
                
            </Router>
        </div>
    )
}
