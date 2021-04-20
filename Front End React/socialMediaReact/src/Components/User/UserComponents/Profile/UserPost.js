import { Collapse } from '@material-ui/core'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Card, Button, Dropdown } from 'react-bootstrap'
import { Route, useHistory } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import server from '../../../../Server'
import './UserProfile.css'
export default function UserPost() {

    let history = useHistory()
    useEffect(() => {
        let token = localStorage.getItem('jwt')
        if (!token) {
            history.push('/')
        }
        let data={
            jwt:localStorage.getItem('jwt'),
            userId:localStorage.getItem('userId')
        }
        axios.post(server + '/getUserPosts',data).then((res) => {
            console.log(res.data.post);
            setPostUser(res.data.post)
            setPath(server + res.data.path)
        })
        
    }, [])
    function likeOld(userId, postId, index) {
        document.getElementById(postId + "likeOld").hidden = true
        document.getElementById(postId + "likeNew").hidden = false
        let data = {
            userId: userId,
            postId: postId,
            jwt: localStorage.getItem('jwt')
        }
        axios.post(server + '/addLike', data).then((res) => {
            if (res.data.oldLike) {
                document.getElementById(postId + "LikeCount").innerHTML = res.data.likeAdd
            } else if (res.data.newLike) {
                document.getElementById(postId + "LikeCount").innerHTML = res.data.likeAdd
            }

        })

    }
    function likeNew(userId, postId, index) {
        document.getElementById(postId + "likeOld").hidden = false
        document.getElementById(postId + "likeNew").hidden = true
        let data = {
            userId: userId,
            postId: postId,
            jwt: localStorage.getItem('jwt')
        }
        axios.post(server + '/removeLike', data).then((res) => {
            if (res.data.removeLike) {
                document.getElementById(postId + "LikeCount").innerHTML = res.data.likeRem
            } else if (res.data.noUser) {
                document.getElementById(postId + "LikeCount").innerHTML = res.data.likeRem
            }

        })

    }
    function commentSub(postId) {
        let data = {
            comment: comment,
            post: postId,
            userId: localStorage.getItem('userId'),
            user: localStorage.getItem('User'),
            jwt: localStorage.getItem('jwt')
        }
        document.getElementById(postId + 'Comment').value = ""
        axios.post(server + '/addComment', data).then((res) => {
            console.log(res)

            if (res.data === 'newComment') {
                console.log("if enterered");
                window.location.reload(true)
            }
            else {
                const div = document.createElement('div')
                div.classList.add(postId + 'inComm')
                div.innerHTML = `<div>
                <h6 className="float-left" style={{margin:"0px"}}>${data.user} : </h6><p className="" style={{margin:"0px"}}>${comment}</p><br />
                </div>`
                document.getElementById(postId + 'comm').append(div)
            }

        })



    }
    function commentDisp(postId, bool) {
        setReadMoreUser(!bool)
        console.log(postId, bool)
        if (bool === false) {
            document.getElementById(postId + 'commentBtn').hidden = true
        } else {

            document.getElementById(postId + 'commentBtn').hidden = false
        }
    }
    function hashClicks(hashTag) {
        localStorage.setItem('hash', hashTag)
        history.push('/hashPost')

    }
    const userClicks = (userId) => {
        localStorage.setItem('profileUser', userId)
        history.push('/userProfile')
    }
    const dpError = (id) => {
        document.getElementById(id + "dp").src = server + '/ProfileImages/DEFAULT.jpg'
    }
    const dpError1 = (id) => {
        document.getElementById(id + "dpa").src = server + '/ProfileImages/DEFAULT.jpg'
    }
    

    const [readMoreUser, setReadMoreUser] = useState(true)
    const [postUser, setPostUser] = useState([])
    const [path, setPath] = useState()
    const [comment, setComment] = useState()
    return (
        <div className="homeBg">
            <div className="container-fluid w-75"  >
                <div className="row">
                    <div className="col-md-12 col-lg-8 container homeCompo">
                        <div className="feed" >
                            {postUser.length > 0 ? postUser.map((data, index) => {
                                return (
                                    <div>
                                        <Card className="" key={index} >
                                            <Card.Header className="pt-3">
                                                <div className="row">
                                                    <div className="col-md-2 col-lg-1 col-2 pl-3 mt-1" style={{ padding: "0px" }}>
                                                        <img src={server + '/ProfileImages/' + data.UserID + '.jpg'} id={data.UserID + "dpa"} onError={() => dpError1(data.UserID)} className="img-fluid rounded-circle" style={{ width: "2.75em", height: "2.75em" }} ></img>

                                                    </div>
                                                    <div className="col-md-8 col-6">
                                                        <h5 onClick={() => userClicks(data.UserID)} style={{ cursor: "pointer" }} className="m-1"><b>{data.User}</b></h5>
                                                        <p className="m-1">{data.Location}</p>
                                                    </div>
                                                    <div className="col-md-2 col-4" style={{ padding: "0px" }}>
                                                    </div>
                                                </div>

                                            </Card.Header>
                                            {data.FileName.split('.').pop() === 'jpg' && <Card.Img variant="top" className="img-fluid mx-auto" style={{ width: "50em", height: "30em" }} src={path + data.FileName} />}
                                            {data.FileName.split('.').pop() === 'mp4' && <video controls style={{ width: "45.5em", textAlign: "center", height: "30em" }}>
                                                <source src={path + data.FileName}></source></video>}


                                            {data.FileName !== 'REPORT.jpg' ? <Card.Footer >
                                                <Card.Text>
                                                    <div className="row">
                                                        <div className="col-md-1 col-2 col-sm-3">
                                                            <h3 className="text-black float-left" id={data._id + "likeOld"}><i class="far fa-heart" onClick={() => likeOld(localStorage.getItem('userId'), data._id, index)} ></i></h3>
                                                            <h3 className="text-danger float-left" id={data._id + "likeNew"} hidden><i class="fas fa-heart" onClick={() => likeNew(localStorage.getItem('userId'), data._id, index)} ></i></h3>
                                                            {data.Likes ? <h5 id={data._id + 'LikeCount'} className=" p-2 ml-4 ">{data.Likes.length}</h5> : <h5 id={data._id + 'emptyLike'} className=" p-2 ml-4">0</h5>}
                                                        </div>
                                                        <div className="col-md-3 col-2 col-sm-3">
                                                            <button className="btn " type="button" onClick={() => commentDisp(data._id, readMoreUser)}><span className="far fa-comment-alt h3"></span></button>
                                                        </div>
                                                    </div>
                                                    <h6 className="pb-2">{data.Description}</h6>
                                                    {data.HashTag ? data.HashTag.map((hash, ind) => {
                                                        return (
                                                            <div>
                                                                <p onClick={() => hashClicks(hash)} style={{ cursor: "pointer" }} key={ind} className="float-left text-primary">{hash}</p>
                                                            </div>
                                                        )

                                                    }) : <p>h</p>}<br></br>

                                                    <div className="overflow-auto" id={data._id + 'commentBtn'} hidden>
                                                        {data.Comment && data.Comment.map((comment, id) => {
                                                            return (
                                                                <div id={data._id + "comm"} className="" key={id}>
                                                                    <div className={data._id + "inComm"}>
                                                                        <h6 className="float-left" style={{ margin: "0px" }}>{comment.UserName} : </h6><p className="" style={{ margin: "0px" }}>{comment.Comment}</p><br />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                </Card.Text>
                                                <input type="text" placeholder="Comment" name="Comment" id={data._id + 'Comment'} onChange={(event) => setComment(event.target.value)} className="mr-sm-2 form-control col-10 col-md-10 float-left" />
                                                <Button onClick={() => commentSub(data._id)} variant="outline-info">Post</Button>
                                            </Card.Footer> : <p></p>}
                                            <p className="pl-4">{data.Date} -<span className="pl-2">{data.Time}</span></p>
                                        </Card> <br />
                                    </div>
                                )

                            }) : <div></div>}

                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
