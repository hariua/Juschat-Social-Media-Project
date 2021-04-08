import { Collapse } from '@material-ui/core'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import server from '../../../../Server'
export default function Home() {
    let history = useHistory()
    useEffect(() => {
        let token = localStorage.getItem('jwt')
        if (!token) {
            history.push('/')
        }
        axios.get(server + '/getAllPosts?jwt=' + localStorage.getItem('jwt')).then((res) => {
            console.log(res.data.post);
            setPost(res.data.post)
            setPath(server + res.data.path)

        })
    }, [])
    function likeBefore(userId, postId,index) {
        document.getElementById(postId+"likeBefore").hidden = true
        document.getElementById(postId+"likeAfter").hidden = false
        if(post[index].Likes)
        {
            document.getElementById(postId+"LikeCount").innerHTML=post[index].Likes+1
        }else{

            document.getElementById(postId+"emptyLike").innerHTML=1            
        }

    }
    function likeAfter(userId, postId,index) {
        document.getElementById(postId+"likeBefore").hidden = false
        document.getElementById(postId+"likeAfter").hidden = true
        if(post[index].Likes)
        {
            document.getElementById(postId+"LikeCount").innerHTML=post[index].Likes-1
        }else{

            document.getElementById(postId+"emptyLike").innerHTML=0           
        }
        
    }
    const [readMore, setreadMore] = useState(false)
    const [post, setPost] = useState([])
    const [path, setPath] = useState()
    return (
        <div className="container mt-4 ">
            <div className="row">
                <div className="col-md-8 ">
                    <div className="feed" >
                        {post.map((data, index) => {
                            return (
                                <div>
                                    <Card className="" key={index} >
                                        <Card.Header>
                                            <h5 className="p-2 float-left">{data.User}</h5><a className="ml-2 p-2 btn" type="button" href="#follow" >Follow</a>
                                        </Card.Header>
                                        {data.FileName.split('.').pop() === 'jpg' && <Card.Img variant="top" className="img-fluid mx-auto" style={{ width: "100%", height: "40%" }} src={path + data.FileName} />}
                                        {data.FileName.split('.').pop() === 'mp4' && <video controls style={{ width: "100%", height: "30%" }}>
                                            <source src={path + data.FileName}></source></video>}


                                        <Card.Footer>
                                            <Card.Text>
                                                
                                                <h3 className="text-black float-left" id={data._id+"likeBefore"}><i class="far fa-heart" onClick={() => likeBefore(localStorage.getItem('userId'), data._id,index)} ></i></h3>
                                                <h3 className="text-danger float-left" id={data._id+"likeAfter"} hidden><i class="fas fa-heart" onClick={() => likeAfter(localStorage.getItem('userId'), data._id,index)} ></i></h3>
                                                {data.Likes ? <h5 id={data._id+'LikeCount'} className=" p-2 ml-4">{data.Likes}</h5> : <h5 id={data._id+'emptyLike'} className=" p-2 ml-4">0</h5>}
                                                <h6>{data.Description}</h6>
                                                <button className="btn btn-light" type="button" onClick={() => setreadMore(!readMore)}>Comments</button>
                                                <Collapse in={readMore}>
                                                    <h6 className="float-left pt-2">User : </h6><p className="pt-2 ml-5"> Super Bro</p>
                                                </Collapse>
                                            </Card.Text>
                                            <input type="text" placeholder="Comment" className="mr-sm-2 form-control col-6 col-md-10 float-left" />
                                            <Button variant="outline-info">Post</Button>
                                        </Card.Footer>
                                    </Card> <br />
                                </div>
                            )

                        })}

                    </div>
                </div>
                <div className="col-md-4 alert-light" style={{ height: "30%" }}>
                    <div className="alert border-secondary m-2 mx-auto" style={{ width: "100%", height: "40%" }}>
                        <h3>Suggestions :</h3>
                        <h5 className="pt-3">Harikrishnan <a className="pl-3 btn" type="button" href="#followk" >Follow</a></h5>
                        <h5 className="pt-1">Bibin <a className="pl-3 btn" type="button" href="#followk" >Follow</a></h5>
                    </div>
                </div>
            </div>
        </div>
    )
}
