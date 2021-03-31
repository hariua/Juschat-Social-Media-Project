import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import './UserSignin.css'
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import server from "../../../../Server";

export default function UserSignin() {
  const [Email,setEmail] = useState('')
  const [Password,setPassword] = useState('')
  function handleChange(event) {
    event.preventDefault()
    let err = false
    const validEmailRegex =
        RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
   
    if (event.target.name === 'Email') {
        let Email = event.target.value
        setEmail(Email)
        if (!validEmailRegex.test(Email)) {
            err = true
            document.getElementById('EmailErr').innerHTML = "Enter a valid email"
        }
        else {
            err = false
            document.getElementById('EmailErr').innerHTML = ""
        }
    }
   
    if (event.target.name === 'Password') {
        const Password = event.target.value
        setPassword(Password)
        if (Password.length < 4) {
            err = true
            document.getElementById('PasswordErr').innerHTML = "Enter Minimum 4 Characters in your password"
        }
        else {
            err = false
            document.getElementById('PasswordErr').innerHTML = ""
        }
    }
    if (!err) {
        document.getElementById('LoginBtn').hidden = false
    }
    else {
        document.getElementById('LoginBtn').hidden = true
    }
}
function formSubmit()
{
  let data={
    Email:Email,
    Password:Password
  }
  axios.post(server+'/signIn',data).then((response)=>
  {
    console.log(response)
  })
  

}
  return (
    <div className="form-design-signin bg-light col-md-7  p-5 container-fluid">
      <h3 className="text-center mb-5">Login </h3>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <label><h5>Email</h5></label>
          <input type="email" name="Email" onBlur={handleChange} className="form-control" placeholder="Enter your Email" />
          <p className="text-center text-danger" id="EmailErr" ></p>

        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <label><h5>Password</h5></label>
          <input type="password" name="Password" onChange={handleChange} className="form-control" placeholder="Enter password" />
          <p className="text-center text-danger" id="PasswordErr" ></p>
        </Form.Group>
        
        <Button variant="primary" id="LoginBtn" type="button" onClick={formSubmit} size="lg" className=" w-100">
          Login
        </Button>
      </Form>
      <h5 className="text-right pt-4" ><Link to="/userSignup" style={{ textDecoration: "none" }}>Don't have an Account ?</Link></h5>
    </div>
  );
}
