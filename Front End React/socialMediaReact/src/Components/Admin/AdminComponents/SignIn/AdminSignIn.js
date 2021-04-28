import './AdminSignin.css'
import { Alert, Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import axios from 'axios'
import server from '../../../../Server'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'

export default function AdminSignIn() {
  useEffect(() => {
    if (localStorage.getItem('jwt1')) {
      history.push('/admin/home')
    }
  }, [])
  const [user, setUser] = useState('')
  const [psd, setPsd] = useState('')
  let history = useHistory()
  function handleChange(event) {
    if (event.target.name == 'UserName') {

      setUser(event.target.value)
    }
    if (event.target.name == 'Password') {

      setPsd(event.target.value)
    }
  }
  function formSubmit() {
    let data = {
      User: user,
      Password: psd
    }
    document.getElementById('UserName').value = ""
    document.getElementById('Password').value = ""

    axios.post(server + '/admin/adminLogin', data).then((res) => {
      console.log(res);
      if (res.data.jwt) {
        localStorage.setItem('jwt1', res.data.jwt)
        history.push('/admin/home')
      }
      if (res.data.login === 'invalidPassword') {

        
        toast.warn("Invalid Password Mr. Admin")

      }
      if (res.data.login === 'invalidUser') {
        toast.error("Sorry !!! You are not an Admin")
      }
    })
  }
  return (
    <div className="row" id="LoginBg">
      <div className="col-md-12">
        <div className="form-design-admin bg-light  p-5 container-fluid">
          <h1 className="text-center mb-3"  style={{fontFamily:'Dancing Script, cursive'}}>Admin Login </h1>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <label><h5>User Name</h5></label>
              <input type="text" name="UserName" id="UserName" onBlur={handleChange} className="form-control" placeholder="Enter your User Name" />


            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <label><h5>Password</h5></label>
              <input type="password" name="Password" id="Password" onChange={handleChange} className="form-control" placeholder="Enter password" />

            </Form.Group>

            <Button className="primary" size="lg" id="LoginBtn" type="button" onClick={formSubmit} size="lg" className=" w-100">
              Login
            </Button>
          </Form>
          
        </div>


      </div>
    </div>
  )
}
