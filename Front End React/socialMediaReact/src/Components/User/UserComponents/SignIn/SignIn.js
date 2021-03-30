import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import './SignIn.css'
import { useHistory } from "react-router-dom";
import axios from "axios";
import server from "../../../../Server";

export default function SignIn() {
  return (
    <div className="form-design bg-light col-md-8 alert border-success p-5">
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label><h5>Email address</h5></Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label><h5>Password</h5></Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        
        <Button variant="primary" type="submit"  size="lg" className=" w-100">
          Submit
        </Button>
      </Form>
    </div>
  );
}
