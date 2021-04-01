import React from 'react'
import { Navbar, Button, Form, Nav, FormControl } from 'react-bootstrap'

export default function Header() {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="p-3">
                <Navbar.Brand href="#home"><h3 className="ml-3">Juschat</h3></Navbar.Brand>
                
                            <input type="text" placeholder="Search" className="mr-sm-2 form-control col-6 col-md-4" />
                            <Button variant="outline-info"><i className="fas fa-search"></i></Button>
                            
                        
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="" style={{paddingLeft:"18em"}}></Nav>
                    <Nav>
                        <Nav.Link href="#features"><h3 title="Add Post" className="pr-3 mr-5"><i className="far fa-plus-square"></i></h3></Nav.Link>
                        <Nav.Link href="#pricing"><h3 title="Chat" className="pr-3 mr-5"><i className="far fa-comment-alt"></i></h3></Nav.Link>
                        <Nav.Link href="#pricing"><h3 title="Notifications" className="pr-3 mr-5"><i className="far fa-bell"></i></h3></Nav.Link>
                        <Nav.Link href="#pricing"><h3 title="User" className="pr-3 mr-5"><i className="far fa-user"></i></h3></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                
            </Navbar>



        </div>


    )
}
