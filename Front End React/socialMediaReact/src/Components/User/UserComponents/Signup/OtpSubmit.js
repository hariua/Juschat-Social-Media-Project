import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import './UserSignup.css'
import {useHistory, Link} from "react-router-dom";
import axios from "axios";
import server from "../../../../Server";
import Home from "../home/Home";
import Header from "../../Header";
import { toast } from "react-toastify";

export default function OtpSubmit() {
    const [Otp, setOtp] = useState('')
    let history = useHistory()
    function handleChange(event) {
        event.preventDefault()
        let err = false
        if (event.target.name === 'Otp') {
            const Otp = event.target.value
            setOtp(Otp)
            if (Otp.length < 6 ) {
                err = true
                document.getElementById('OtpErr').innerHTML = "Enter a valid Otp"
            }
            else {
                err = false
                document.getElementById('OtpErr').innerHTML = ""
            }
        }
        if (!err) {
            document.getElementById('SubmitBtn').hidden = false
        }
        else {
            document.getElementById('SubmitBtn').hidden = true
        }
    }
    function formSubmit() {
        document.getElementById("Otp").value = ""

        let data = {
            Otp: Otp
            // jwt:localStorage.getItem('jwt')

        }
        console.log(data);
        axios.post(server + '/otpSubmit', data).then((response) => {
            console.log(response)
            if(response.data.userLog===true)
            {
                history.push('/')
            }
            else{
                toast("Invalid OTP")
            }
        })


    }
    return (
        <div className="form-design-signin bg-light col-md-7  p-5 container-fluid">
            <h3 className="text-center mb-5">O T P SUBMIT </h3>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <label><h5>Enter the OTP</h5></label>
                    <input type="number" name="Otp" id="Otp" onChange={handleChange} className="form-control" placeholder="Enter The OTP" />
                    <p className="text-center text-danger" id="OtpErr" ></p>

                </Form.Group>



                <Button variant="primary" id="SubmitBtn" type="button" onClick={formSubmit} size="lg" className=" w-100">
                    Submit
        </Button>
            </Form>

        </div>
    );
}
