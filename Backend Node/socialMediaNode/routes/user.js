var express = require('express');
var router = express.Router();
var userHelper = require('../helper/userHelper')

/* GET home page. */
router.post('/signIn',(req,res)=>
{
  userHelper.userLogin(req.body).then((data)=>
  {
    console.log("res",data);
  })
  res.send("Hello")
})
router.post('/signUp',async(req,res)=>
{
  console.log(req.body);
  userHelper.userCheckup(req.body).then((response)=>
  {
    console.log(response);
    if(response.userExist)
    {
      res.send("Exist")
    }
    else{
      res.send("New")
    }
  })  
})
router.post('/otpSubmit',(req,res)=>
  {
    console.log(req.body);
  })
module.exports = router;
