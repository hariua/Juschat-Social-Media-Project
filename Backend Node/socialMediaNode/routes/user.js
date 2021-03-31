var express = require('express');
var router = express.Router();
var userHelper = require('../helper/userHelper')

/* GET home page. */
router.post('/signIn',(req,res)=>
{
  console.log(req.body)
  res.send("Hello")
})
router.post('/signUp',(req,res)=>
{
  console.log(req.body);
  res.send('success')
})

module.exports = router;
