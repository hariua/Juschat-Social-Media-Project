import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardDeck } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import server from '../../../../Server'
import './UserProfile.css'

export default function UserProfile() {
    let user = localStorage.getItem('User')
    useEffect(() => {
        let token = localStorage.getItem('jwt')
        if (token) {
            axios.get(server + '/getProfileDetails?jwt=' + token).then((response) => {
                console.log(response);
                if (response.data.imgUrl === '') {
                    document.getElementById('userDp').hidden = true
                }
                else {
                    document.getElementById('userDp').src = server + response.data.imgUrl
                    document.getElementById('userDp').hidden = false
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
                document.getElementById('userName').innerHTML = response.data.user.Name
                document.getElementById('userMail').innerHTML = response.data.user.Email
                document.getElementById('userMobile').innerHTML = response.data.user.Mobile
                if (response.data.posts.post) {
                    setPost(response.data.posts.post)
                }

            })
        }
    }, [])
    const [post, setPost] = useState([])
    return (
        <div className="profileBg">
            <div className="container mt-2">
                <div className="row text-white">
                    <div className="col-md-4">
                        <img src="" id="userDp" className="img-fluid rounded-circle m-5 " style={{ height: "18em", width: "18em" }}></img>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-7 ">
                        <h2 className="pt-5  mt-3 " id="userName"></h2><Link to="/editProfile"><buton size="lg" className="btn btn-light border-primary m-2"><span className="h5">Edit Profile</span></buton></Link>
                        <ul className="pl-0 pt-3 " style={{ listStyleType: "none" }}>
                            <li className="float-left pr-2 h6">10 posts</li>
                            <li className="float-left pr-2 h6"> 5 following</li>
                            <li className=" pr-2 h6">20 followers</li>
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
                            {post.map((data, index) => {
                                return (
                                    <div className="col-md-4 mt-3">
                                        <Card className="mx-auto alert border-dark" key={index} >

                                            {data.FileName.split('.').pop() === 'jpg' && <Card.Img variant="top" className="img-fluid mx-auto" style={{ objectFit: "", width: "28em", height: "18em" }} src={server + "/PostFiles/" + data.FileName} />}
                                            {data.FileName.split('.').pop() === 'mp4' && <video controls style={{ objectFit: "", width: "21em", height: "18em", textAlign: "center", margin: "auto" }}>
                                                <source src={server + "/PostFiles/" + data.FileName}></source></video>}

                                            <div className=" row text-center">
                                                <div className="col-6">
                                                    <h6 className="m-1"><span className="fas fa-heart pr-3"></span>{data.Likes.length}</h6>

                                                </div>
                                                <div className="col-6">
                                                    <h6 className="m-1"><span className="fas fa-comment-alt pr-3"></span>{data.Comment.length}</h6>
                                                </div>
                                            </div>

                                        </Card>
                                    </div>
                                )
                            })}



                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}
