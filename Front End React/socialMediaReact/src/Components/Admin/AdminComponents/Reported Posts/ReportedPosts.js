import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'
import server from '../../../../Server'

export default function ReportedPosts() {
    let history = useHistory()
    useEffect(()=>{
        if(!localStorage.getItem('jwt1'))
        {
            history.push('/admin')
        }
        axios.get(server+'/admin/reportedPosts?jwt1='+localStorage.getItem('jwt1')).then((resp)=>
        {
            setReportPost(resp.data)
        })
    },[])
   function report(postId)
   {
       let data ={
           jwt1:localStorage.getItem('jwt1'),
           postId:postId
       }
    axios.post(server+'/admin/reportPostAdmin',data).then((response)=>
    {
        console.log(response);
        if(response.data==='PostRemoved')
        {
            toast("Post Removed Successfully!!!")
        }
    })
   }
    const [reportPost,setReportPost] = useState([])
    return (
        <div className="row container-fluid overflow-auto">
            <div className="col-md-2"></div>
            <div className=" col-xl-10 float-right">

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>User ID</th>
                            <th>Post ID</th>
                            <th>Likes</th>
                            <th>Comments</th>
                            <th>Reports</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportPost.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.Date} - {item.Time}</td>
                                    <td>{item.UserID}</td>
                                    <td>{item._id}</td>
                                    
                                    <td>{item.Likes.length}</td>
                                    {item.Comment?<td>{item.Comment.length}</td>:<td>Nil</td>}
                                    {item.Report?<td>{item.Report.length}</td>:<td>Nil</td>}
                                    <td><Button id={item._id + "r"} className="btn btn-danger" onClick={()=>report(item._id)} type="btn">Remove Post</Button>
                                    </td>
                                   
                                    
                                </tr>
                            )
                        })}


                    </tbody>
                </Table>
            </div>
        </div>
    )
}
