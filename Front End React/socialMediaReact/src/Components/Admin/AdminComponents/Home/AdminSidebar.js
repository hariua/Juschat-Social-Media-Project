
import React, { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
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
    const sidebarClick=()=>
    {
        if(sidebarBool==true)
        {
            document.getElementById('btnClick').style.backgroundColor="white"
            document.getElementById('btnClick').style.color="white"
        }else{
            document.getElementById('btnClick').style.backgroundColor="black"
            document.getElementById('btnClick').style.color="black"
        }
        setSidebarBool(!sidebarBool)
    }
    let history = useHistory()
    const [sidebarBool,setSidebarBool] = useState(true)
    return (
        <div className="">
            
            <button className="" id="btnClick" style={{width:"250px",backgroundColor:"black",border:"none"}} onClick={sidebarClick}>h</button>
            <div id="wrapper">
            <Collapse in={sidebarBool}>
            <div id="sidebar-wrapper">
                    <ul  class="sidebar-nav">
                        <li class="sidebar-brand">
                            <Link to="/admin/home">Dashboard</Link>
                                
                            
                        </li>
                        <li>
                        <Link to="/admin/allUsers">Users</Link>
                        </li>
                        <li>
                        <Link to="/admin/allPosts">Posts</Link>
                        </li>
                        <li>
                        <Link to="/admin/reportedPosts">Reported Posts</Link>
                        </li>
                       
                    </ul>
                </div>
            </Collapse>
            </div>
           
        </div>
    )
}
