var express = require('express');
var router = express.Router();
var userHelper = require('../helper/userHelper')
var otp = require('../connection/otp')
var userData={}

const twilio = require('twilio')(otp.ACCOUNT_SID,otp.AUTH_TOKEN)

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
      userData.info = req.body
      twilio.verify
      .services(otp.SERVICE_ID)
      .verifications
      .create({
        to:`+91${req.body.Mobile}`,
        channel:'sms'
      }).then((data)=>
      {
        console.log(data,"otp data")
      })
      res.send("New")
    }
  })  
})

router.post('/otpSubmit',(req,res)=>
  {
    
    twilio.verify
    .services(otp.SERVICE_ID)        
    .verificationChecks
    .create({
      to:`+91${userData.info.Mobile}`,
      code:req.body.Otp
    }).then((data)=>
    {
      if(data.valid)
      {
        userHelper.signupUser(userData.info).then((response)=>
        {
          console.log("sesss",response);
          req.session.user = response
          req.session.loggedIn = true
          res.send({userLog:req.session.loggedIn,user:req.session.user})
        })
      }
      else{
        res.send("Login Failed")
      }
    })
  })
module.exports = router;
