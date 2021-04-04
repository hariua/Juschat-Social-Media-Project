import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link,useHistory } from 'react-router-dom'
import server from '../../../../Server'
import './UserSignup.css'


export default function UserSignup() {
    const [Name,setName] = useState('')
    const [Email,setEmail] = useState('')
    const [Mobile,setMobile] = useState('')
    const [Password,setPassword] = useState('')
    useEffect(()=>
    {
      let token = localStorage.getItem('jwt')
      if(token)
      {
        history.push('/home')
      }
    },[])
    let history = useHistory()
    function handleChange(event) {
        event.preventDefault()
        let err = false
        const validEmailRegex =
            RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        if (event.target.name === 'Name') {
            const Name = event.target.value
            setName(Name)
            if (Name.length < 4) {
                err = true
                document.getElementById('nameErr').innerHTML = "Enter Minimum 4 Characters"
            }
            else {
                err = false
                document.getElementById('nameErr').innerHTML = ""
            }
        }
        if (event.target.name === 'Email') {
            const Email = event.target.value
            setEmail(Email)
            if (!validEmailRegex.test(Email)) {
                err = true
                document.getElementById('emailErr').innerHTML = "Enter a valid email"
            }
            else {
                err = false
                document.getElementById('emailErr').innerHTML = ""
            }
        }
        if (event.target.name === 'Mobile') {
            const Mobile = event.target.value
            setMobile(Mobile)
            if (Mobile.length < 10) {
                err = true
                document.getElementById('mobileErr').innerHTML = "Enter Minimum 10 Digits"
            } else if (Mobile.length > 10) {
                err = true
                document.getElementById('mobileErr').innerHTML = "Enter a Maximum of 10 Digits"
            }
            else {
                err = false
                document.getElementById('mobileErr').innerHTML = ""
            }
        }
        if (event.target.name === 'Password') {
            const Password = event.target.value
            setPassword(Password)
            if (Password.length < 4) {
                err = true
                document.getElementById('passwordErr').innerHTML = "Enter Minimum 4 Characters in your password"
            }
            else {
                err = false
                document.getElementById('passwordErr').innerHTML = ""
            }
        }
        console.log(err);
        if (!err) {
            document.getElementById('registerBtn').hidden = false
        }
        else {
            document.getElementById('registerBtn').hidden = true
        }
    }
    function formSubmit()
    {
        document.getElementById("Name").value=""
        document.getElementById("Email").value=""
        document.getElementById("Mobile").value=""
        document.getElementById("Password").value=""
        let formData={
            Name:Name,
            Email:Email,
            Mobile:Mobile,
            Password:Password
        }
        if(formData.Name !== "" && formData.Email !== "" && formData.Mobile !== "" && formData.Password !== "")
        {
            axios.post(server+'/signUp',formData).then((response)=>
        {
            console.log(response);
            
            
            if(response.data.value==="New")
            {

                history.push('/otpSubmit')
            }
            else{
                alert("User Already Exists")
            }
        })
        }
        else{
            alert("Please Fill all Fields")
        }
        
    }
    return (
        <div className="form-design-signup bg-light col-md-7  pl-5 pr-5 pt-3 pb-3 container-fluid">
            <h3 className="text-center mb-5 mt-2">Signup </h3>
            <Form>


                <div className="form-group">
                    <label><h5>Name</h5></label>
                    <input type="text" name="Name" id="Name" onBlur={handleChange} className="form-control" placeholder="Enter your Name" />
                    <p className="text-center text-danger" id="nameErr" ></p>
                </div>

                <div className="form-group">
                    <label><h5>Email</h5></label>
                    <input type="email" name="Email" id="Email" onBlur={handleChange} className="form-control" placeholder="Enter your Email" />
                    <p className="text-center text-danger" id="emailErr" ></p>
                </div>

                <div className="form-group">
                    <label><h5>Mobile</h5></label>
                    <input type="number" name="Mobile" id="Mobile" onBlur={handleChange} className="form-control" placeholder="Enter your Mobile" />
                    <p className="text-center text-danger" id="mobileErr" ></p>
                </div>

                <div className="form-group">
                    <label><h5>Password</h5></label>
                    <input type="password" name="Password"id="Password" onChange={handleChange} className="form-control" placeholder="Enter password" />
                    <p className="text-center text-danger" id="passwordErr" ></p>
                </div>

                <Button variant="primary" id="registerBtn" type="button" onClick={formSubmit} size="lg" className=" w-100">
                    Register
        </Button>

            </Form>
            <h5 className="text-right pt-4" ><Link to="/" style={{ textDecoration: "none" }}>Already have an Account ?</Link></h5>
        </div>
    )
}
