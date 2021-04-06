var express = require('express');
var router = express.Router();
var userHelper = require('../helper/userHelper')
var otp = require('../connection/otp')
var fs = require('fs')
var jwt = require('jsonwebtoken');
var path = require('path')
var userData = {}
const twilio = require('twilio')(otp.ACCOUNT_SID, otp.AUTH_TOKEN)
function authenticateToken(req, res, next) {
  if (req.body.jwt) {
    let token = req.body.jwt
  } else {
    token = req.query.jwt
  }

  if (token == null) {
    console.log("token null");
    res.sendStatus(401)
  }
  else {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        console.log("No Access");
        res.send("jwt corrupted")
      } else {
        userHelper.findUser(user._id).then((data) => {
          if (!data.Status) {
            console.log("Access Granted");
            delete user.iat

            req.user = user
            console.log("jwt data", req.user);
            next()
          }else{
            res.sendStatus(404)
          }
        })

      }
    })
  }
}
/* GET home page. */
router.post('/signIn', (req, res) => {
  userHelper.userLogin(req.body).then((data) => {

    if (data.user) {
      let jwtToken = jwt.sign(data.user, process.env.SECRET_KEY)
      console.log("res", data.user);

      res.send({ loginStatus: true, jwtToken, user: data.user.Name, id: data.user._id })
    }
    else if (data.userBlocked) {
      res.send({ loginStatus: "block" })
    }
    else {
      res.send({ loginStatus: false })
    }

  })
})
router.post('/signUp', async (req, res) => {
  console.log(req.body);

  userHelper.userCheckup(req.body).then((response) => {
    console.log(response);
    if (response.userExist) {
      res.send("Exist")
    }
    else {
      userData.info = req.body


      twilio.verify
        .services(otp.SERVICE_ID)
        .verifications
        .create({
          to: `+91${req.body.Mobile}`,
          channel: 'sms'
        }).then((data) => {
          console.log(data, "otp data")
        })
      res.send({ value: "New" })
    }
  })
})

router.post('/otpSubmit', (req, res) => {

  twilio.verify
    .services(otp.SERVICE_ID)
    .verificationChecks
    .create({
      to: `+91${userData.info.Mobile}`,
      code: req.body.Otp
    }).then((data) => {
      if (data.valid) {
        userHelper.signupUser(userData.info).then((response) => {
          console.log("response twilio", response);
          userData.info = response
          userData.loggedIn = true
          res.send({ userLog: userData.loggedIn, user: userData.info })
        })
      }
      else {
        res.send({ userLog: false })
      }
    })
})
router.post('/changeProPic', authenticateToken, (req, res) => {
  userHelper.base64Convert(req.body.img,req.user._id)
  res.send('/ProfileImages/'+req.user._id+'.jpg')
})
router.get('/getProfileDetails', authenticateToken, (req, res) => {
  userHelper.findUser(req.user._id).then((data) => {
    let val = path.join(__dirname, '../')
    let img = path.join(__dirname, '../public/ProfileImages/' + req.user._id + '.jpg')
    console.log(img);
    if (fs.existsSync(img)) {
      console.log("img exist");
      res.send({ user: data, imgUrl: '/ProfileImages/' + req.user._id + '.jpg' })
    } else {
      res.send({ user: data, imgUrl: '' })
    }



  })

})
router.post('/editProfileDetails', authenticateToken, (req, res) => {
  console.log("user edit ", req.body);
  userHelper.editProfile(req.body.Name, req.body.Description, req.user._id).then((response) => {
    req.user = response
    res.send({ user: req.user })
  })
})
router.post('/changePassword', authenticateToken, (req, res) => {
  userHelper.changePassword(req.body, req.user._id).then((response) => {
    res.send(response)
  })
})

module.exports = router;
