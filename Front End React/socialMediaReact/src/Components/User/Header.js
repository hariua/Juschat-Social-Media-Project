import React from 'react'
import { Navbar, Button, Form, Nav, FormControl,Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'


export default function Header() {
    
    let user = localStorage.getItem('User')
    let history = useHistory()
    function logout(){
        localStorage.removeItem('User')
        localStorage.removeItem('jwt')
        history.push('/')
        
    }
    

    return (
        <div >
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="p-3">
                <Link to="/"><Navbar.Brand href="#home"><h3 className="ml-3">Juschat</h3></Navbar.Brand></Link>

                <input type="text" placeholder="Search" className="mr-sm-2 form-control col-6 col-md-4" />
                <Button variant="outline-info"><i className="fas fa-search"></i></Button>
                

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="" style={{ paddingLeft: "18em" }}></Nav>
                    <Nav>
                        <Nav.Link><Link to="/addPost"><h3 title="Add Post" className="pr-3 mr-5"><i className="far fa-plus-square text-light"></i></h3></Link></Nav.Link>
                        <Nav.Link><h3 title="Chat" className="pr-3 mr-5"><i className="far fa-comment-alt"></i></h3></Nav.Link>
                        <Nav.Link><h3 title="Notifications" className="pr-3 mr-5"><i className="far fa-bell"></i></h3></Nav.Link>
                        <Nav.Link><Link to="/userProfile"><h3 title="User" className="pr-1 "><i className="far fa-user text-light"></i></h3></Link></Nav.Link>
                        <Dropdown>
                            <Dropdown.Toggle variant="sm" className="mt-2" >
                                <span className="h5 text-light">{user}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={logout} >Logout</Dropdown.Item>
                                
                            </Dropdown.Menu>
                        </Dropdown>
                        
                    </Nav>
                </Navbar.Collapse>


            </Navbar>



        </div>


    )
}
