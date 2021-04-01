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
router.post('/signUp',(req,res)=>
{
  console.log(req.body);
  userHelper.userSignup(req.body).then((data)=>
  {
    
    res.send(data)
  })
})

module.exports = router;
