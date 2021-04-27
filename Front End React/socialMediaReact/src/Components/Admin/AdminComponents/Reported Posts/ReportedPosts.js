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
        <div className=" container-fluid overflow-auto" style={{margin:"auto"}}>
            <div className="col-lg-10 col-md-12 float-right">

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
                            <th>Block</th>
                            
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
                                    {item.FileName==='REPORT.jpg'?<td><Button  className="btn btn-danger disabled" type="btn">Post Blocked</Button></td>:<td><Button id={item._id + "r"} className="btn btn-danger" onClick={()=>report(item._id)} type="btn">Remove Post</Button></td>}
                                    
                                   
                                    
                                </tr>
                            )
                        })}


                    </tbody>
                </Table>
            </div>
        </div>
    )
}
