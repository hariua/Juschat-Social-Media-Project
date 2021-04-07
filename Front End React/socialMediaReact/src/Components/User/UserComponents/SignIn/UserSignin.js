import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import './UserSignin.css'
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import server from "../../../../Server";
import GoogleLogin from 'react-google-login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

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
        toast.error("You are temporarily blocked by admin")
      }
      else {

        toast.warning("Invalid Username or Password");
      }
    })
  }

  function responseSuccessGoogle(res) {
    console.log(res);
    let data = {
      token: res.tokenId,
      userData: res.profileObj
    }
    axios.post(server + '/googleSignup', data).then((response) => {
      if (response.data.login === true) {
        localStorage.setItem('jwt', response.data.jwtToken)
        localStorage.setItem('User', response.data.user)
        localStorage.setItem('userId', response.data.id)
        history.push('/home')
      }
      else {
        toast.dark("Something Went Wrong !!! Please Try Again Later")
      }
    })
  }
  function responseFailureGoogle(res) {
    toast.dark("Something Went Wrong !!! Please Try Again Later")
  }
  function componentFBClicked() {
    console.log("Button FB Clicked");
  }
  function responseFacebook(res) {
    console.log(res);
    if (res.accessToken !== '' && res.id !== '' && res.name !== '' && res.email !== '') {
      let data = {
        Name: res.name,
        Email: res.email,
        id: res.id
      }
      axios.post(server + '/facebookSignup', data).then((res) => {
        console.log(res);
        if (res.data.login === true) {
          localStorage.setItem('jwt', res.data.jwtToken)
          localStorage.setItem('User', res.data.user)
          localStorage.setItem('userId', res.data.id)
          history.push('/home')
        } else {
          toast.error("Something Went Wrong !!!")
        }
      })
    } else {
      toast.error("Something Went Wrong !!! Please Try Again Later")
    }
  }
  return (
    <div className="row" id="LoginBg">
      <div className="col-md-12">
        <div className="form-design-signin bg-light col-md-7  p-5 container-fluid">
          <h1 className="text-center mb-3"  style={{fontFamily:'Dancing Script, cursive'}}>Juschat Login </h1>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <label className="signinLabel"><h5>Email</h5></label>
              <input type="email" name="Email" id="Email" onBlur={handleChange} className="form-control" placeholder="Enter your Email" />
              <p className="text-center text-danger" id="EmailErr" ></p>

            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <label className="signinLabel"><h5>Password</h5></label>
              <input type="password" name="Password" id="Password" onChange={handleChange} className="form-control" placeholder="Enter password" />
              <p className="text-center text-danger" id="PasswordErr" ></p>
            </Form.Group>

            <Button variant="primary" id="LoginBtn" type="button" onClick={formSubmit} size="lg" className=" w-100">
              Login
        </Button>
          </Form>
          <h4 className="text-center pt-4 signinLabel" ><Link to="/userSignup" style={{ textDecoration: "none" }}>Don't have an Account ?</Link></h4>
          <div className="row">
            <div className="text-center col-md-12 pt-3 ml-2">
              <GoogleLogin
                clientId={process.env.REACT_APP_CLIENTID}
                render={renderProps => (
                  <Button size="lg" className="btn btn-danger pl-4 pr-4 socialBtn" onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with Google<i className="pl-2 fab fa-google"></i></Button>
                )}
                buttonText="Login With Google"
                onSuccess={responseSuccessGoogle}
                onFailure={responseFailureGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </div>
            <div className="col-md-12 text-center">
              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_ID}
                autoLoad={false}
                fields="name,email,picture"
                onClick={componentFBClicked}
                callback={responseFacebook}
                render={renderProps => (
                  <Button size="lg" className="btn btn-primary mt-3 pl-2 ml-3 socialBtn" onClick={renderProps.onClick}>Login With Facebook<span className="pl-2 fab fa-facebook-square"></span></Button>
                )} />
            </div>
          </div>
        </div>


      </div>
    </div>


  );
}
