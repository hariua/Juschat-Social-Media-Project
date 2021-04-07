import { Collapse } from '@material-ui/core'
import { findAllByTestId } from '@testing-library/dom'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import server from '../../../../Server'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'react-toastify'

export default function EditProfile() {
    let history = useHistory()
    const style = {

        margin: "auto",
        marginTop: "4%",
        marginBottom: "4%",
        opacity: " 0.7",
        borderRadius: "2em 0em",
        border: "3px solid blue"


    }
    useEffect(() => {

        if (localStorage.getItem('jwt')) {
            axios.get(server + '/getProfileDetails?jwt=' + localStorage.getItem('jwt')).then((response) => {

                if (response.data.imgUrl === '') {
                    document.getElementById('editImg').hidden = true
                }
                else {
                    document.getElementById('editImg').src = server + response.data.imgUrl
                    document.getElementById('editImg').hidden = false
                }
                if(response.data.user.GoogleId || response.data.user.FacebookId)
                {
                    document.getElementById('psdBTN').hidden=true
                    document.getElementById('mobInput').hidden=true
                }

                setName(response.data.user.Name)
                document.getElementById('Email').value = response.data.user.Email
                document.getElementById('Mobile').value = response.data.user.Mobile
                if (response.data.user.Description) {
                    setDescription(response.data.user.Description)

                }
            })
        }
        else {

            history.push('/')
        }

    }, [])
    const [textCollapse, setTextCollapse] = useState(true)
    const [picCollapse, setPicCollapse] = useState(false)
    const [passwordCollapse, setPasswordCollapse] = useState(false)
    const [dp, setDp] = useState(null)


    const [src, setImgFile] = useState(null)
    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState({ aspect: 1 / 1 })
    const [res, setRes] = useState(null)

    const [name, setName] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [description, setDescription] = useState('')

    function photoChange(event) {
        if (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/png') {
            if (event.target.files[0].size < 2097152) {
                // setDp(event.target.files[0])
                setImgFile(URL.createObjectURL(event.target.files[0]))
                document.getElementById('DpBtn').hidden = false
                document.getElementById('ImgErr').innerHTML = ""
            } else {
                document.getElementById('ImgErr').innerHTML = "Please Upload only Image having size less than 2 MB"
                document.getElementById('DpBtn').hidden = true
            }

        } else {
            document.getElementById('ImgErr').innerHTML = "Please Upload only Images"
            document.getElementById('DpBtn').hidden = true
        }
    }
    function photoSubmit() {
        let image = res
        let jwt = localStorage.getItem('jwt')
        let data = new FormData()
        data.append('img', image)
        data.append('jwt', jwt)
        axios.post(server + '/changeProPic', data, {
            headers: {
                'Content-Type': 'multipart/form-data;'
            }
        }).then((response) => {
                console.log(response,"img res")
            document.getElementById('editImg').src = server + response.data
            document.getElementById('editImg').hidden = false
            toast.success("Profile Picture Updated Successfully")

        })
    }
    function editProfile() {
        let data = {
            Name: name,
            Description: description,
            jwt: localStorage.getItem('jwt')
        }
        axios.post(server + '/editProfileDetails', data).then((response) => {
            localStorage.setItem('User', response.data.user.Name)
        })
    }
    function passwordSubmit() {
        if (oldPassword === '') {
            document.getElementById('psdErr').innerHTML = "Please Enter Current Password"
            document.getElementById('passwordSubmit').hidden = true
        }
        else {

            let data = {
                CurrentPassword: oldPassword,
                NewPassword: newPassword,
                jwt: localStorage.getItem('jwt')
            }
            document.getElementById('Password').value = ""
            document.getElementById('NewPassword').value = ""
            axios.post(server + '/changePassword', data).then((response) => {
                console.log(response);
                if (response.data.passwordChange) {
                    toast.success("Password Changed Successfully")
                }
                else {
                    toast.dark("Invalid Current Password")
                }
            })
        }

    }
    function passwordChange(event) {
        if (event.target.name === 'Password') {
            setOldPassword(event.target.value)
            let tem = event.target.value
            if (tem.length > 0) {
                document.getElementById('psdErr').innerHTML = ""
                document.getElementById('passwordSubmit').hidden = false
            }

        }
        if (event.target.name === 'NewPassword') {
            let temp = event.target.value
            setNewPassword(temp)
            if (temp.length < 4) {
                document.getElementById('passwordErr').innerHTML = "Please Enter Minimum 4 characters in Password"
                document.getElementById('passwordSubmit').hidden = true
            }
            else {
                document.getElementById('passwordErr').innerHTML = ""
                document.getElementById('passwordSubmit').hidden = false
            }
        }
    }
    function getCroppedImg() {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );
        
        const base64Image = canvas.toDataURL('image/jpeg')
        setRes(base64Image)
    }
    return (
        <div className=" bg-light col-md-7  pl-5 pr-5 pt-3 pb-3 container-fluid" style={style}>
            <h3 className="text-center mb-3 mt-2">Edit Profile </h3>
            <img src='' id="editImg" className="img-fluid rounded-circle" style={{ width: "10em", height: "10em", marginLeft: "40%", marginRight: "50%" }}></img>
            <button type="button" className="btn btn-primary w-100 mt-3 mb-4" onClick={() => setTextCollapse(!textCollapse)}>Edit Basic Details</button>
            <Collapse in={textCollapse}>
                <Form>


                    <div className="form-group">
                        <label><h5>Name</h5></label>
                        <input type="text" name="Name" id="Name" value={name} className="form-control" onChange={(event) => setName(event.target.value)} />
                        {/* <p className="text-center text-danger" id="nameErr" ></p> */}
                    </div>

                    <div className="form-group">
                        <label><h5>Description</h5></label>
                        <input type="text" name="Description" value={description} required maxLength="50" id="Description" className="form-control" onChange={(event) => setDescription(event.target.value)} placeholder="Enter your Profile Description" />

                    </div>
                    <div className="form-group">
                        <label><h5>Email</h5></label>
                        <input type="text" name="Email" id="Email" className="form-control" readOnly />

                    </div>
                    <div id="mobInput" className="form-group">
                        <label><h5>Mobile</h5></label>
                        <input type="text" name="Mobile" id="Mobile" className="form-control" readOnly />
                    </div>
                    <Button variant="primary" id="EditBtn" type="button" size="lg" onClick={editProfile} className=" w-100">
                        Edit Profile
                    </Button>

                </Form>
            </Collapse>
            <button type="button" className="btn btn-primary w-100 mt-3 mb-4" onClick={() => setPicCollapse(!picCollapse)}>Change Profile Picture</button>
            <Collapse in={picCollapse}>
                <Form>
                    <div className="form-group">
                        <label><h5>Profile Picture</h5></label>
                        <input type="file" name="ProfilePic" id="ProfilePic" className="form-control" onChange={photoChange} />
                        <p className="text-center text-danger" id="ImgErr" ></p>
                    </div>
                    <div className="row">
                        {src && <div className="col-6">

                            <ReactCrop src={src} onImageLoaded={setImage} crop={crop} onChange={setCrop} />
                            <Button className="btn btn-success " onClick={getCroppedImg}>Crop Image </Button>

                        </div>
                        }
                        {res && <div className="col-6">
                            <img src={res} className="img-fluid" id="croppedImgPreview"></img>
                        </div>}
                    </div>
                    <Button variant="primary" id="DpBtn" type="button" size="lg" className=" w-100" onClick={photoSubmit}>
                        Change Profile Picture
                    </Button>
                </Form>

            </Collapse>
            <button type="button" id="psdBTN" className="btn btn-primary w-100 mt-3 mb-4" onClick={() => setPasswordCollapse(!passwordCollapse)}>Change Password</button>
            <Collapse in={passwordCollapse}>
                <Form>
                    <div className="form-group">
                        <label><h5>Current Password</h5></label>
                        <input type="password" name="Password" id="Password" className="form-control" onChange={passwordChange} placeholder="Enter current password" />
                        <p className="text-center text-danger" id="psdErr" ></p>
                    </div>
                    <div className="form-group">
                        <label><h5>New Password</h5></label>
                        <input type="password" name="NewPassword" id="NewPassword" className="form-control" onChange={passwordChange} placeholder="Enter new password" />
                        <p className="text-center text-danger" id="passwordErr" ></p>
                    </div>
                    <Button variant="primary" id="passwordSubmit" onClick={passwordSubmit} type="button" size="lg" className=" w-100">
                        Change Password
                    </Button>
                </Form>
            </Collapse>
        </div>
    )
}
