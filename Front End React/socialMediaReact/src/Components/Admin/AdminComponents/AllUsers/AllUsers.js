import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import server from '../../../../Server'

export default function AllUsers() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        axios.get(server + '/admin/getAllUsers?jwt1=' + localStorage.getItem('jwt1')).then((res) => {
            console.log(res.data);
            setUsers(res.data)
            for(let i =0;i<res.data.length;i++)
            {
                if(res.data[i].Status)
                {
                    document.getElementById(res.data[i]._id+'b').hidden=true
                    document.getElementById(res.data[i]._id+'u').hidden=false
                }
            }
        })
    }, [])

    console.log(users, "jaksjf");
    function blockBtn(event) {
        let id = event.target.id.slice(0,24)
        document.getElementById(id+'b').hidden = true
        document.getElementById(id+'u').hidden = false
        let data={
            id:id,
            jwt1:localStorage.getItem('jwt1')
        }
        axios.post(server+'/admin/blockUser',data).then((res)=>
        {
            console.log(res);
        })

    }
    function unblockBtn(event) {
        let id = event.target.id.slice(0,24)
        document.getElementById(id+'b').hidden = false
        document.getElementById(id+'u').hidden = true
        let data={
            id:id,
            jwt1:localStorage.getItem('jwt1')
        }
        axios.post(server+'/admin/unblockUser',data).then((res)=>
        {
            console.log(res);
        })
    }
    return (
        <div className="row container-fluid">
            <div className="col-md-2"></div>
            <div className=" col-xl-10 float-right">

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.Email}</td>
                                    
                                    {item.Mobile?<td>{item.Mobile}</td>:item.GoogleLogin?<td>Google User</td>:item.FacebookLogin?<td>Facebook User</td>:<td></td>}
                                    <td><Link to="#"><Button id={item._id + "b"} className="btn btn-danger" onClick={blockBtn} type="btn">Block</Button></Link>
                                        <Link to="#"><Button id={item._id + "u"} className="btn btn-primary" onClick={unblockBtn} type="btn" hidden>Unblock</Button> </Link>
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
