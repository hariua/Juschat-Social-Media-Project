import { Collapse } from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import { Card,Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
export default function Home() {
    let history = useHistory()
    useEffect(()=>
    {
        let token = localStorage.getItem('jwt')
        if(!token)
        {
            history.push('/')
        }
    },[])
    function likeBefore() {
        document.getElementById("likeBefore").hidden = true
        document.getElementById("likeAfter").hidden = false
    }
    function likeAfter() {
        document.getElementById("likeBefore").hidden = false
        document.getElementById("likeAfter").hidden = true
    }
    const [readMore,setreadMore] = useState(false)
    return (
        <div className="container mt-4 ">
            <div className="row">
                <div className="col-md-8 ">
                    <div className="feed" >
                        <Card className="" >
                            <Card.Header>
                                <h5 className="p-2 float-left">Harikrishnan</h5><a className="ml-2 p-2 btn" type="button" href="#follow" >Follow</a>
                            </Card.Header>
                            <Card.Img variant="top" className="img-fluid mx-auto" style={{ width: "40%", height: "30%" }} src="../../../../logo512.png" />
                            
                            <Card.Footer>
                            <Card.Text>
                                    <h3 className="text-black float-left" id="likeBefore"><i class="far fa-heart" onClick={likeBefore} ></i></h3><h3 className="text-danger float-left" id="likeAfter" hidden><i class="fas fa-heart" onClick={likeAfter} ></i></h3><h5 className=" p-2 ml-4">45</h5>
                                    <h6>Description of the post</h6>
                                    <button className="btn btn-light" type="button" onClick={()=>setreadMore(!readMore)}>Comments</button>
                                    <Collapse in={readMore}>
                                    <h6 className="float-left pt-2">User : </h6><p className="pt-2 ml-5"> Super Bro</p>
                                    </Collapse>
                                </Card.Text>
                            <input type="text" placeholder="Comment" className="mr-sm-2 form-control col-6 col-md-10 float-left" />
                            <Button variant="outline-info">Post</Button>
                            </Card.Footer>
                        </Card><br></br>
                        <Card className="" >
                            <Card.Header>
                                <h5 className="p-2 float-left">Harikrishnan</h5><a className="ml-2 p-2 btn" type="button" href="#follow" >Follow</a>
                            </Card.Header>
                            <Card.Img variant="top" className="img-fluid mx-auto" style={{ width: "40%", height: "30%" }} src="../../../../logo512.png" />
                            
                            <Card.Footer>
                            <Card.Text>
                                    <h3 className="text-black float-left" id="likeBefore"><i class="far fa-heart" onClick={likeBefore} ></i></h3><h3 className="text-danger float-left" id="likeAfter" hidden><i class="fas fa-heart" onClick={likeAfter} ></i></h3><h5 className=" p-2 ml-4">45</h5>
                                    <h6>Description of the post</h6>
                                    <button className="btn btn-light" type="button" onClick={()=>setreadMore(!readMore)}>Comments</button>
                                    <Collapse in={readMore}>
                                    <h6 className="float-left pt-2">User : </h6><p className="pt-2 ml-5"> Super Bro</p>
                                    </Collapse>
                                </Card.Text>
                            <input type="text" placeholder="Comment" className="mr-sm-2 form-control col-6 col-md-10 float-left" />
                            <Button variant="outline-info">Post</Button>
                            </Card.Footer>
                        </Card>
                    </div>
                </div>
                <div className="col-md-4 alert-light" style={{height:"30%"}}>
                    <div className="alert border-secondary m-2 mx-auto" style={{width:"100%",height:"40%"}}>
                        <h3>Suggestions :</h3>
                        <h5 className="pt-3">Harikrishnan <a className="pl-3 btn" type="button" href="#followk" >Follow</a></h5>
                        <h5 className="pt-1">Bibin <a className="pl-3 btn" type="button" href="#followk" >Follow</a></h5>
                    </div>
                </div>
            </div>
        </div>
    )
}
