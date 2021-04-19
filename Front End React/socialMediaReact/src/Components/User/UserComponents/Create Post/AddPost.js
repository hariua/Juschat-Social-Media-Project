import axios from 'axios'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'
import server from '../../../../Server'
import './AddPost.css'
export default function AddPost() {
    let history = useHistory()
    function submitPost()
    {
        let data = new FormData()
        data.append('item',post)
        data.append('location',location)
        data.append('description',description)
        data.append('hashtag',hashTag)
        data.append('id',localStorage.getItem('userId'))
        data.append('user',localStorage.getItem('User'))
        axios.post(server+'/addPost',data).then((res)=>
        {
            if(res.data === 'success')
            {
                toast("Data Posted Successfully")
                history.push('/home')
                
                
            }
            else{
                toast.error("Something Went Wrong !!!")
            }
        })
        document.getElementById('Location').value=''
        document.getElementById('Description').value=''
        document.getElementById('HashTag').value=''
        document.getElementById('imgPre').hidden=true
        document.getElementById('vidPre').hidden=true

    }
    function fileData(event)
    {
        let extention = event.target.files[0].type
        setPost(event.target.files[0])
        if(extention === 'image/jpeg' || extention === 'image/jpg' || extention === 'image/png')
        {
            document.getElementById('imgPre').src=URL.createObjectURL(event.target.files[0])
            document.getElementById('imgPre').hidden=false
            document.getElementById('vidPre').hidden=true
        }
        if(extention === 'video/mp4' || extention === 'video/mkv' || extention === 'video/mpeg')
        {
            document.getElementById('vidPre').src=URL.createObjectURL(event.target.files[0])
            document.getElementById('vidPre').hidden=false
            document.getElementById('imgPre').hidden=true
        }
    }
    const [location,setLocation] =useState()
    const [post,setPost] =useState()
    const [description,setDescription] =useState()
    const [hashTag,setHashTag] =useState()
    return (
        <div>
            <div className="row" id="postBg">
                <div className="col-md-12">
                    <div className="add-post bg-light col-md-7  pl-5 pr-5 pt-3 pb-3 container-fluid">
                        <h1 className="text-center mb-3 mt-2" style={{ fontFamily: 'Dancing Script, cursive' }}>Add New Post </h1>
                        <Form>

                            <div className="form-group mb-1" style={{marginBottom:"0em"}}>
                                <label className="postLabel"><h5>Select The File</h5></label>
                                <label for = "Post"><i id="postIcon" className="far fa-folder-open ml-3 mt-1"></i></label>
                                <input type="file" name="Post" id="Post" style={{visibility:'hidden'}} onChange={fileData} className="form-control" />
                                
                            </div>
                            <div className="imgPreview">
                            <img src="" className="img-fluid" id="imgPre" style={{width:"13em",height:"8em"}} hidden></img>
                            <video controls  style={{width:"16em",height:"8em"}} id="vidPre" hidden>
                                <source src="" type="video/mp4"></source>
                            </video>
                            </div>
                            <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="postLabel"><h5>Location</h5></label>
                                <input type="text" name="Location" id="Location" onChange={(event)=>setLocation(event.target.value)} className="form-control" placeholder="Enter the Location" />
                                {/* <p className="text-center text-danger" id="nameErr" ></p> */}
                            </div>
                            <div className="form-group col-md-6">
                                <label className="postLabel"><h5>Hash Tags</h5></label>
                                <input type="text" name="HashTag" id="HashTag" onChange={(event)=>setHashTag(event.target.value)} className="form-control" placeholder="Enter the HashTags" />
                                {/* <p className="text-center text-danger" id="nameErr" ></p> */}
                            </div>
                            </div>

                            <div className="form-group">
                                <label className="postLabel"><h5>Description</h5></label>
                                {/* <input type="text" name="Description" id="Description" onBlur={handleChange} className="form-control" placeholder="Enter the Description" /> */}
                                <textarea id="Description" name="Description" onChange={(event)=>setDescription(event.target.value)} rows="3" className="form-control" placeholder="Enter the Description"></textarea>
                                {/* <p className="text-center text-danger" id="emailErr" ></p> */}
                            </div>
                            <Button variant="primary" id="AddPost" type="button" onClick={submitPost} size="lg" className=" w-100">
                                Add New Post
                         </Button>

                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
