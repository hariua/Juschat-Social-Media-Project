import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import server from '../../../../Server'

export default function AllPosts() {
    const [post,setPost] = useState([])
    useEffect(()=>
    {
        axios.get(server+'/admin/getAllPosts?jwt1='+localStorage.getItem('jwt1')).then((res)=>
        {
            setPost(res.data)
            
        })
    },[])
    
    return (
        <div className=" container-fluid overflow-auto" style={{margin:"auto"}}>
            <div className=" col-md-12 col-lg-10 float-right">

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>User ID</th>
                            <th>Post ID</th>
                            <th>Description</th>
                            <th>Location</th>
                            <th>Likes</th>
                            <th>Comments</th>
                            <th>Reports</th>
                        </tr>
                    </thead>
                    <tbody>
                        {post.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.Date} - {item.Time}</td>
                                    <td>{item.UserID}</td>
                                    <td>{item._id}</td>
                                    <td>{item.Description}</td>
                                    <td>{item.Location}</td>
                                    <td>{item.Likes.length}</td>
                                    {item.Comment?<td>{item.Comment.length}</td>:<td>Nil</td>}
                                    {item.Report?<td>{item.Report.length}</td>:<td>Nil</td>}
                                    
                                   
                                    
                                </tr>
                            )
                        })}


                    </tbody>
                </Table>
            </div>
        </div>
    )
}
