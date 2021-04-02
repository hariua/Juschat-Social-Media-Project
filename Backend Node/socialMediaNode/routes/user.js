var express = require('express');
var router = express.Router();
var userHelper = require('../helper/userHelper')
var otp = require('../connection/otp')
var jwt = require('jsonwebtoken');
var userData={}
const twilio = require('twilio')(otp.ACCOUNT_SID,otp.AUTH_TOKEN)
function authenticateToken(req,res,next)
{
  
  const token = req.body.jwt
  if(token ==null)
  {
    console.log("token null");
    res.sendStatus(401)
  }
  else{
    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>
    {
      if(err)
      {
        console.log("No Access");
        res.send("jwt corrupted")
      }else{
        console.log("Access Granted");
        delete user.iat
        req.user = user
        console.log("jwt data",req.user);
        next()
      }
    })
  }
}
/* GET home page. */
router.post('/signIn',(req,res)=>
{
  userHelper.userLogin(req.body).then((data)=>
  {
    
    if(data.user)
    {
      let jwtToken = jwt.sign(data.user,process.env.SECRET_KEY)
      console.log("res",data.user);
      res.send({loginStatus:true,jwtToken,user:data.user.Name})
    }
    else{
      res.send({loginStatus:false})
    }
    
  })
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
      res.send({value:"New"})
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
          console.log("response twilio",response);
          userData.info=response
          userData.loggedIn = true
          res.send({userLog:userData.loggedIn,user:userData.info})
        })
      }
      else{
        res.send({userLog:false})
      }
    })
  })
module.exports = router;
