import React,{useState} from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import AdminSignIn from './AdminComponents/SignIn/AdminSignIn'
import AdminNavbar from './AdminComponents/Home/AdminNavbar'
import AdminSidebar from './AdminComponents/Home/AdminSidebar'
import AllUsers from './AdminComponents/AllUsers/AllUsers'
import { ToastContainer } from 'react-toastify'
import AllPosts from './AdminComponents/AllPosts/AllPosts'
import ReportedPosts from './AdminComponents/Reported Posts/ReportedPosts'
export default function Admin() {
    
    return (
        <div>
            <Router>
                <Route path="/admin" exact><AdminSignIn /></Route>
                <Route path ="/admin/home"><AdminNavbar /><AdminSidebar /></Route>
                <Route path="/admin/allUsers"><AdminNavbar /><AdminSidebar /><AllUsers /></Route>
                <Route path="/admin/allPosts"><AdminNavbar /><AdminSidebar /><AllPosts /></Route>
                <Route path="/admin/reportedPosts"><AdminNavbar /><AdminSidebar /><ReportedPosts /></Route>
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
