
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import './AdminSidebar.css'
export default function AdminSidebar() {
    useEffect(()=>
    {
        if(!localStorage.getItem('jwt1'))
        {
            history.push('/admin')
        }
    },[])
    let history = useHistory()
    return (
        <div className="">
            
            
            <div id="wrapper">
            
                <div id="sidebar-wrapper">
                    <ul  class="sidebar-nav">
                        <li class="sidebar-brand">
                            <Link to="/admin/home">Dashboard</Link>
                                
                            
                        </li>
                        <li>
                        <Link to="/admin/allUsers">Users</Link>
                        </li>
                        <li>
                            <a href="#">Posts</a>
                        </li>
                        <li>
                            <a href="#">Overview</a>
                        </li>
                       
                    </ul>
                </div>
            </div>
           
        </div>
    )
}
