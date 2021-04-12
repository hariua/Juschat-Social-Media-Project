import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardDeck } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import server from '../../../../Server'
import './HashPost.css'

export default function HashPost(props) {
    const [hashPost,setHashPost] = useState([])
    useEffect(() => {
        
        let token = localStorage.getItem('jwt')
        if (token) {
            let data = {
                hash:localStorage.getItem('hash'),
                jwt:localStorage.getItem('jwt')
            }
            axios.post(server + '/getHashPost' ,data).then((response) => {
                console.log(response);
                setHashPost(response.data)
                
                 
            })
        }
        return ()=>
        {
            localStorage.removeItem('hash')
        }   
    },[])
    
    return (
        <div className="hashbg"> 
            <div className="container mt-2">
            <div className="row">
                <div className="col-md-4">
                    
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-7 ">
                    <h2 className="pt-3 pb-3 text-white" id="hashName">{localStorage.getItem('hash')}</h2>
                
                </div>

            </div>
            <hr className="seperator bg-white "></hr>
            <div className="row">
                <div className="col-md-12">
                    <p className="text-center text-white  h4">POSTS</p>

                    <div className="row">
                        {hashPost.map((data,index)=>
                        {
                            return(
                                <div className="col-md-4 mt-3">
                            <Card className="mx-auto cardHash" >
                            <Card.Header className="pt-3 ">
                                            <div className="row headText">
                                                
                                                <div className="">
                                                    <h5 className="m-1"><b>{data.User}</b></h5>
                                                    <p className="m-1">{data.Location}</p>
                                                </div>
                                                <div className="col-md-2 col-4" style={{ padding: "0px" }}>
                                                    
                                                    
                                                </div>
                                            </div>

                                        </Card.Header>
                                        {data.FileName.split('.').pop() === 'jpg' && <Card.Img variant="top" className="img-fluid mx-auto"  style={{objectFit:"",width:"28em",height:"18em" }} src={server+"/PostFiles/"+data.FileName} />}
                                        {data.FileName.split('.').pop() === 'mp4' && <video controls   style={{objectFit:"",width:"21em",height:"18em",textAlign:"center",margin:"auto" }}>
                                            <source src={server+"/PostFiles/"+data.FileName}></source></video>}
                                
                            </Card>
                        </div>
                            )
                        })}
                        
                        
                        
                    </div>


                </div>
            </div>
        </div >
        </div>
    )
}
