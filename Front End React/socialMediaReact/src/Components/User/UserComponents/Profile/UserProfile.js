import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardDeck, Dropdown, Modal, Overlay, Popover } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import server from '../../../../Server'
import './UserProfile.css'

export default function UserProfile() {
    let user = localStorage.getItem('User')
    let history = useHistory()
    useEffect(() => {
        let token = localStorage.getItem('jwt')
        if (token) {
            axios.get(server + '/getProfileDetails?jwt=' + token).then((response) => {
                console.log(response);
                if (response.data.imgUrl === '') {
                    document.getElementById('userDp').src = server + '/ProfileImages/DEFAULT.jpg'
                }
                else {
                    document.getElementById('userDp').src = server + response.data.imgUrl

                }
                if (response.data.user.Description === '') {
                    document.getElementById('userDescription').hidden = true
                }

                else {
                    document.getElementById('userDescription').innerHTML = response.data.user.Description
                    document.getElementById('userDescription').hidden = false
                }
                if (response.data.user.GoogleId || response.data.user.FacebookId) {
                    document.getElementById('proMob').hidden = true
                }
                if (response.data.friends.length > 0) {
                    setFriendsList(response.data.friends)
                }
                document.getElementById('userName').innerHTML = response.data.user.Name
                document.getElementById('userMail').innerHTML = response.data.user.Email
                document.getElementById('userMobile').innerHTML = response.data.user.Mobile

                setPost(response.data.posts)


            })
        }
    }, [])
    const searchDpError = (id)=>
    {
        document.getElementById(id+"dp").src = server+'/ProfileImages/DEFAULT.jpg'
    }
    const friendPage = (id) => {
        localStorage.setItem("profileUser", id)
        history.push('/userProfile')

    }
    const deletePost = (postId, index) => {
        let data = {
            postId: postId,
            jwt: localStorage.getItem('jwt')
        }
        axios.post(server + '/deletePost', data).then((response) => {
            console.log(response);
            toast.success("Post Deleted Successfully")
            document.getElementById(index + "delete").hidden = true
        })
    }
    const userPosts = () => {
        history.push('/userPost')
    }
    const getFriends = () => {
        setFriendsBool(!friendBool)
    }
    const [post, setPost] = useState([])

    const [friendsList, setFriendsList] = useState([])
    const [friendBool, setFriendsBool] = useState(false)
    return (
        <div className="profileBg">
            <div className="container-fluid userProfileHead">
                <div className="row text-white mt-5">
                    <div className="col-md-4">
                        <img src="" id="userDp" className="img-fluid rounded-circle m-5 profileDp"></img>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-7">
                        <div className="userDetails"><h2 className="pt-5  mt-3 " id="userName"></h2><Link to="/editProfile"><buton size="lg" className="btn btn-light border-primary m-2"><span className="h5">Edit Profile</span></buton></Link></div>
                        <ul className="pl-0 pt-3 " style={{ listStyleType: "none" }}>
                            {post ? <li  onClick={userPosts} style={{cursor:"pointer"}} className="float-left pr-2 h6">{post.length} posts</li> : <li className="float-left pr-2 h6">0 posts</li>}
                            {friendsList.length>0?<li className=" pr-2 h6" style={{cursor:"pointer"}} onClick={() => getFriends()}>{friendsList.length} Friends</li>:<li className=" pr-2 h6">0 Friends</li>}

                        </ul>
                        <em><p className="h5 text-justify" id="userDescription"></p></em>
                        <div className="float-left pr-5">
                            <i className="h3 far fa-envelope pr-2 pt-2 pl-5 ml-4"></i>
                            <h5 id="userMail"></h5>
                        </div>
                        <div id="proMob">
                            <i className="h3 fas fa-mobile-alt pr-2 pt-2 pl-4 ml-3"></i>
                            <h5 className="" id="userMobile"></h5>
                        </div>



                    </div>

                </div>
                <hr className="seperator bg-white"></hr>
                <div className="row">
                    <div className="col-md-12">
                        <p className="text-center text-white h4">POSTS</p>

                        <div className="row">
                            {post ? post.map((data, index) => {
                                return (
                                    <div className="col-md-4 mt-3" >
                                        <Card className="mx-auto alert border-dark" id={index + "delete"} key={index}>
                                            <div className="col-md-12 col-12" style={{ padding: "0px", display: "flex", flexDirection: "row-reverse" }}>

                                                <Dropdown>
                                                    <Dropdown.Toggle id="dropdown-basic" variant="sm" className=""  >
                                                        <span className="fas fa-ellipsis-v float-right" ></span>
                                                    </Dropdown.Toggle >

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => deletePost(data._id, index)} >Delete Post</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>

                                            </div>

                                            {data.FileName.split('.').pop() === 'jpg' && <Card.Img variant="top" onClick={userPosts} className="img-fluid mx-auto" style={{ objectFit: "", width: "28em", height: "18em",cursor:"pointer" }} src={server + "/PostFiles/" + data.FileName} />}
                                            {data.FileName.split('.').pop() === 'mp4' && <video onClick={userPosts} controls style={{ objectFit: "", width: "17em", height: "18em", textAlign: "center", margin: "auto",cursor:"pointer" }}>
                                                <source src={server + "/PostFiles/" + data.FileName}></source></video>}

                                            <div className=" row text-center">
                                                <div className="col-6">
                                                    {data.Likes ? <h6 className="m-1"><span className="fas fa-heart pr-3"></span>{data.Likes.length}</h6> : <h6 className="m-1"><span className="fas fa-heart pr-3"></span>0</h6>}

                                                </div>
                                                <div className="col-6">
                                                    {data.Comment ? <h6 className="m-1"><span className="fas fa-comment-alt pr-3"></span>{data.Comment.length}</h6> : <h6 className="m-1"><span className="fas fa-comment-alt pr-3"></span>0</h6>}
                                                </div>
                                            </div>

                                        </Card>
                                    </div>
                                )
                            }) : <p></p>}



                        </div>
                        <Modal show={friendBool} onHide={getFriends} aria-labelledby="contained-modal-title-vcenter"
                            centered>
                            <Modal.Header closeButton>
                                <Modal.Title >Friends List</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {friendsList.length > 0 ? friendsList.map((data, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="row ml-3">
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <img src={server + '/ProfileImages/' + data.userId + '.jpg'} id={index + "dp"} onError={() => searchDpError(index)}
                                                        className="img-fluid rounded-circle" style={{ width: "2.5em", height: "2.5em", margin: "auto" }} ></img>
                                                    <h5 style={{ cursor: "pointer" }} onClick={()=>friendPage(data.userId)} className="m-1 ml-3"><b>{data.userName}</b></h5>
                                                </div>
                                            </div>
                                            <hr className="seperator bg-white"></hr>
                                        </div>
                                    )
                                }) : <div></div>}
                            </Modal.Body>

                        </Modal>

                    </div>
                </div>

            </div>
        </div>
    )
}
