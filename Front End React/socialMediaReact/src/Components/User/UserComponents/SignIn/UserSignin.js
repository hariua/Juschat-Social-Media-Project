import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import './UserSignin.css'
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import server from "../../../../Server";
import GoogleLogin from 'react-google-login';
export default function UserSignin() {
  useEffect(() => {
    let token = localStorage.getItem('jwt')
    if (token) {
      history.push('/home')
    }
  }, [])
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  let history = useHistory()
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
        document.getElementById('PasswordErr').innerHTML = "Enter a valid password"
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
  function formSubmit() {
    document.getElementById("Email").value = ""
    document.getElementById("Password").value = ""
    let data = {
      Email: Email,
      Password: Password
    }
    axios.post(server + '/signIn', data).then((response) => {
      console.log(response)
      if (response.data.loginStatus === true) {
        localStorage.setItem("jwt", response.data.jwtToken)
        localStorage.setItem('User', response.data.user)
        localStorage.setItem('userId', response.data.id)
        history.push('/home')
      } else if (response.data.loginStatus === 'block') {
        localStorage.removeItem('jwt')
        alert("You are temporarily blocked by admin")
      }
      else {
        alert("Invalid Username   or Password")
      }
    })
  }
  function responseSuccessGoogle(res)
  {
    console.log(res);
    let data={
      token:res.tokenId,
      userData:res.profileObj
    }
    axios.post(server+'/googleSignup',data).then((response)=>
    {
      if(response.data.login === true)
      {
        localStorage.setItem('jwt',response.data.jwtToken)
        localStorage.setItem('User',response.data.user)
        localStorage.setItem('userId',response.data.id)
        history.push('/home')
      }
      else{
        alert("Something Went Wrong !!! Please Try Again Later")
      }
    })
  }
  function responseFailureGoogle(res)
  {
    alert("Something Went Wrong !!! Please Try Again Later")
  }
  return (
    <div>
      <div className="form-design-signin bg-light col-md-7  p-5 container-fluid">
      <h3 className="text-center mb-5">Login </h3>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <label><h5>Email</h5></label>
          <input type="email" name="Email" id="Email" onBlur={handleChange} className="form-control" placeholder="Enter your Email" />
          <p className="text-center text-danger" id="EmailErr" ></p>

        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <label><h5>Password</h5></label>
          <input type="password" name="Password" id="Password" onChange={handleChange} className="form-control" placeholder="Enter password" />
          <p className="text-center text-danger" id="PasswordErr" ></p>
        </Form.Group>

        <Button variant="primary" id="LoginBtn" type="button" onClick={formSubmit} size="lg" className=" w-100">
          Login
        </Button>
      </Form>
      <h5 className="text-right pt-4" ><Link to="/userSignup" style={{ textDecoration: "none" }}>Don't have an Account ?</Link></h5>
      
    </div>
    
    <div className="text-center col-md-6 pt-3">
    <GoogleLogin
     clientId = {process.env.REACT_APP_CLIENTID}
     render={renderProps => (
      <button className="btn btn-danger ml-5" onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with Google<i className="pl-2 fab fa-google"></i></button>
    )}
     buttonText="Login With Google"
     onSuccess={responseSuccessGoogle}
     onFailure={responseFailureGoogle}
     cookiePolicy={'single_host_origin'}
     />
    </div>
    
    </div>
    
     
  );
}
