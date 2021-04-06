import React,{useState} from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import AdminSignIn from './AdminComponents/SignIn/AdminSignIn'
import AdminNavbar from './AdminComponents/Home/AdminNavbar'
import AdminSidebar from './AdminComponents/Home/AdminSidebar'
import AllUsers from './AdminComponents/AllUsers/AllUsers'
export default function Admin() {
    
    return (
        <div>
            <Router>
                <Route path="/admin" exact><AdminSignIn /></Route>
                <Route path ="/admin/home"><AdminNavbar /><AdminSidebar /></Route>
                <Route path="/admin/allUsers"><AdminNavbar /><AdminSidebar /><AllUsers /></Route>
            </Router>
        </div>
    )
}
