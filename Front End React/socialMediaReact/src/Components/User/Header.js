import { Collapse } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { Navbar, Button, Form, Nav, FormControl, Dropdown, Overlay, Popover, Table } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import server from "../../Server";

export default function Header() {
    let user = localStorage.getItem("User");
    let history = useHistory();
    function logout() {
        localStorage.removeItem("User");
        localStorage.removeItem("jwt");
        history.push("/");
    }
    const searchClick = () => {
        let data = {
            jwt: localStorage.getItem('jwt'),
            search: search
        }
        document.getElementById('searchInput').value = ''
        if (search.length === 0) {
            toast("Enter Some Keywords!!!")
        } else {

            axios.post(server + '/searchUsers', data).then((response) => {
                if (response.data !== 'NoResult') {
                    setSearchBool(!searchBool)
                    setSearchUser(response.data)
                } else {
                    toast("Search Not Found !!!")
                }

            })
        }
    }
    const searchFound = (id) => {
        localStorage.setItem("profileUser", id)
        history.push('/userProfile')

    }
    const notificationClick = (event) => {
        setNotificationBool(!notificationBool)
        setNotification(event.target)
    }
    const friendRequestClick = (event) => {
        if(friendRequestBool===false){
            let data={
                jwt:localStorage.getItem('jwt'),
                user:localStorage.getItem('userId')
            }
            axios.post(server+'/getFriendRequest',data).then((response)=>
            {
                if(response.data !=='noRequests')
                {
                    setRequestList(response.data)
                }
            })
        }
        setFriendRequestBool(!friendRequestBool)
        setFriendRequest(event.target)
    }
    const requestAccept=(userDetails,owner,index)=>
    {
        let data={
            details:userDetails,
            accepter:owner,
            jwt:localStorage.getItem('jwt')
        }
        axios.post(server+'/acceptFriend',data).then((response)=>
        {
            if(response.data==='Accepted')
            {
                document.getElementById(index+'reqList').hidden=true
            }
        })
        
    }
    const requestReject=(userDetails,owner,index)=>
    {
        let data={
            details:userDetails,
            accepter:owner,
            jwt:localStorage.getItem('jwt')
        }
        axios.post(server+'/rejectFriend',data).then((response)=>
        {
            if(response.data==='Removed')
            {
                document.getElementById(index+'reqList').hidden=true
            }
        })
    }
    const [search, setSearch] = useState('')
    const [searchUser, setSearchUser] = useState([])
    const [searchBool, setSearchBool] = useState(false)


    const [notificationBool, setNotificationBool] = useState(false)
    const [notification, setNotification] = useState()


    const [friendRequestBool, setFriendRequestBool] = useState(false)
    const [friendRequest, setFriendRequest] = useState()
    const [requestList,setRequestList]=useState([])


    return (
        <div>
            <Navbar
                collapseOnSelect
                expand="lg"
                bg="dark"
                variant="dark"
                className="p-3"
            >
                <Link to="/">
                    <Navbar.Brand href="#home">
                        <h3 className="ml-3">Juschat</h3>
                    </Navbar.Brand>
                </Link>

                <input
                    type="text"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search" id="searchInput"
                    className="mr-sm-2 form-control col-6 col-md-4"
                />
                <Button variant="outline-info"
                    onClick={searchClick}
                >
                    <i className="fas fa-search"></i>
                </Button>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="" style={{ paddingLeft: "18em" }}></Nav>
                    <Nav>
                        <Nav.Link>
                            <Link to="/addPost">
                                <h3 title="Add Post" className="pr-3 mr-3">
                                    <i className="far fa-plus-square text-light"></i>
                                </h3>
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <h3 title="Add Friends" onClick={(event) => friendRequestClick(event)} className="pr-3 mr-3">
                                <i className="fas fa-users "></i>
                            </h3>
                        </Nav.Link>
                        <Nav.Link>
                            <h3 title="Chat" className="pr-3 mr-3">
                                <i className="far fa-comment-alt"></i>
                            </h3>
                        </Nav.Link>
                        <Nav.Link>
                            <h3 title="Notifications" onClick={(event) => notificationClick(event)} className="pr-3 mr-3">
                                <i className="far fa-bell"></i>
                            </h3>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/myProfile">
                                <h3 title="User" className="pr-1 ">
                                    <i className="far fa-user text-light"></i>
                                </h3>
                            </Link>
                        </Nav.Link>
                        <Dropdown>
                            <Dropdown.Toggle variant="sm" className="mt-2">
                                <span className="h5 text-light">{user}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Collapse in={searchBool}>
                <div>
                    <div className="row ml-lg-3 container-fluid">
                        <div className="col-md-1 col-sm-2"></div>
                        <div className="col-md-4 col-sm-6 alert border-primary ml-lg-5">
                            <ul style={{ listStyleType: "none" }}>
                                {searchUser.length !== 0 ? searchUser.map((data, index) => {
                                    return (
                                        <div>
                                            <div className="row">
                                                <div className="col-md-2 col-lg-1 col-2 mt-1" style={{ padding: "0px" }}>
                                                    <img src={server + '/ProfileImages/' + data._id + '.jpg'} className="img-fluid rounded-circle" style={{ width: "2.5em", height: "2.5em" }} ></img>

                                                </div>
                                                <div className="col-md-8 col-6">
                                                    {data.Name ? <h5 style={{ cursor: "pointer" }} onClick={() => searchFound(data._id)} className="m-1"><b>{data.Name}</b></h5> : <div></div>}
                                                    {data.Description ? <p className="m-1">{data.Description}</p> : <p></p>}
                                                </div>

                                            </div>
                                            <hr className="seperator bg-white"></hr>
                                        </div>


                                    )
                                }) : <div></div>}
                            </ul>
                        </div>
                    </div>
                </div>
            </Collapse>
            {/* notification overlay */}
            <Overlay
                show={notificationBool}
                target={notification}
                placement="bottom"
                containerPadding={20}
            >
                <Popover id="popover-contained">
                    <Popover.Title as="h3">Popover bottom</Popover.Title>
                    <Popover.Content>
                    </Popover.Content>
                </Popover>
            </Overlay>

            {/* friend request overlay */}
            <Overlay
                show={friendRequestBool}
                target={friendRequest}
                placement="bottom"
                containerPadding={40}
            >
                <Popover id="popover-contained" style={{ width: "50em" }}>
                    <Popover.Title as="h3" className="bg-primary text-center text-white h1">Friend Requests</Popover.Title>
                    <Popover.Content>
                        {requestList.length>0?requestList.map((data,index)=>
                        {
                            return(
                                <div id={index+"reqList"}>
                        <div style={{ display: "flex",flexDirection:"row",textAlign:"justify" }}>
                            <img src={server+'/ProfileImages/'+data.userId+'.jpg'} className="img-fluid rounded-circle" style={{ width: "2.5em", height: "2.5em",margin:"auto" }}></img>
                            <span className="ml-4 h5 text-justify" style={{margin:"auto"}}>{data.userName}</span>
                            <span style={{ fontSize: "1.75em",margin:"auto" }} onClick={()=>requestAccept(data,localStorage.getItem('userId'),index)} className="btn far fa-check-square text-success"></span>
                            <span style={{ fontSize: "1.75em",margin:"auto" }} onClick={()=>requestReject(data,localStorage.getItem('userId'),index)} className="btn far fa-window-close text-danger"></span>
                        </div>
                        <hr className="seperator"></hr>
                        </div>
                            )
                        }):<h4 className="text-center">No New Requests</h4>}
                    </Popover.Content>
                </Popover>
            </Overlay>
        </div>
    );
}
