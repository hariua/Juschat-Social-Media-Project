import React, { useEffect, useState } from 'react'
import { Navbar, Button, Form, Nav, FormControl, Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

export default function Header() {
    useEffect(()=>
    {
        if(!localStorage.getItem('jwt1'))
        {
            history.push('/admin')
        }
    })
    let history = useHistory()
    function logout() {
        localStorage.removeItem('jwt1')
        history.push('/admin')

    }
    return (
        <div className="container-fluid bg-danger">
            <div className="row p-2">
                <div className="col-md-8 col-12">
                    <Link  to="/admin/home"><Navbar.Brand><h3 id="navbarHeading" className="ml-3  text-white">Juschat Admin</h3></Navbar.Brand></Link>
                </div>
                <div className="col-md-4 mt-1 col-12">
                    <Link to=""><h3 title="User" className="pr-1 float-left "><i className="far fa-user text-light"></i></h3></Link>
                    <Dropdown>
                        <Dropdown.Toggle variant="sm" className="" >
                            <span className="h4 text-light">Harikrishnan</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={logout} >Logout</Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
















        </div >


    )
}
