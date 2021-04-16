var express = require('express');
var router = express.Router();
var userHelper = require('../helper/userHelper')
var otp = require('../connection/otp')
var fs = require('fs')
var jwt = require('jsonwebtoken');
var path = require('path')
var moment = require('moment');
const { response } = require('express');
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
          } else {
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
          to: req.body.Mobile,
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
      to: userData.info.Mobile,
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
  userHelper.base64Convert(req.body.img, req.user._id)
  res.send('/ProfileImages/' + req.user._id + '.jpg')
})
router.get('/getProfileDetails', authenticateToken, async(req, res) => {
  let userPost = await userHelper.getUserPost(req.user._id)
  
  userHelper.findUser(req.user._id).then((data) => {
    let val = path.join(__dirname, '../')
    let img = path.join(__dirname, '../public/ProfileImages/' + req.user._id + '.jpg')
    
    console.log(img);
    if (fs.existsSync(img)) {
      console.log("img exist");
      res.send({ user: data, imgUrl: '/ProfileImages/' + req.user._id + '.jpg',posts:userPost })
    } else {
      res.send({ user: data, imgUrl: '',posts:userPost })
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
router.post('/googleSignup', (req, res) => {
  userHelper.googleSignup(req.body).then((data) => {
    if (data.userSignup) {
      let jwtToken = jwt.sign(data.userSignupData, process.env.SECRET_KEY)
      res.send({ login: true, jwtToken, user: data.userSignupData.Name, id: data.userSignupData._id })
    }
    if (data.userLogin) {
      jwtToken = jwt.sign(data.userLoginData, process.env.SECRET_KEY)
      res.send({ login: true, jwtToken, user: data.userLoginData.Name, id: data.userLoginData._id })
    }
  }).catch(() => {
    res.send("Invalid Token")
  })
})
router.post('/facebookSignup', (req, res) => {
  userHelper.facebookSignup(req.body).then((data) => {
    if (data.userSignup) {
      let jwtToken = jwt.sign(data.userSignupData, process.env.SECRET_KEY)
      res.send({ login: true, jwtToken, user: data.userSignupData.Name, id: data.userSignupData._id })
    }
    if (data.userLogin) {
      jwtToken = jwt.sign(data.userLoginData, process.env.SECRET_KEY)
      res.send({ login: true, jwtToken, user: data.userLoginData.Name, id: data.userLoginData._id })
    }
  })
})
router.post('/addPost',(req, res) => {
  let date = new Date()
  let d = moment(date).format('-YYYY-MM-DD-h-mm-ss')
  let time= moment(date).format('h:mm')
  let dat = moment(date).format('YYYY-MM-DD')
  let file = req.files.item
  let ext = req.files.item.mimetype
  let fileName = ''
  if(ext == 'image/jpeg' ||ext == 'image/jpg'||ext == 'image/png')
  {
    fileName = req.body.id+d+'.jpg'
    file.mv('./public/PostFiles/'+req.body.id+d+'.jpg')
  }
  if(ext == 'video/mp4' ||ext == 'video/mkv'||ext == 'video/mpeg')
  {
    fileName = req.body.id+d+'.mp4'
    file.mv('./public/PostFiles/'+req.body.id+d+'.mp4')
  }
  userHelper.addPost(req.body,fileName,time,dat).then((res)=>
  {
    console.log(res,"res");
    
  })
  res.send('success')
})
router.get('/getAllPosts',authenticateToken,(req,res)=>{
  userHelper.getAllPosts().then((posts)=>
  {
    res.send({post:posts,path:'/PostFiles/'})
  })
})
router.post('/addLike',authenticateToken,(req,res)=>{
  userHelper.addLikePost(req.body).then((response)=>
  {
    if(response.oldLike)
    {
      res.send({oldLike:true,likeAdd:response.count})
    }else if(response.newLike)
    {
      res.send({newLike:true,likeAdd:response.count})
    }
  })
})
router.post('/removeLike',authenticateToken,(req,res)=>{
  userHelper.removeLikePost(req.body).then((response)=>
  {
    if(response.removeLike)
    {
      res.send({removeLike:true,likeRem:response.remLike})
    }
    else if(response.noUser)
    {
      res.send({noUser:true,likeRem:response.remLike})
    }
  })
})
router.post('/addComment',authenticateToken,(req,res)=>
{
  userHelper.addComment(req.body).then((response)=>
  {
    console.log(response,"reeeeeee");
    if(response === 'newComment' )
    {
      res.send('newComment')
    }else{
      res.send('oldComment')
    }
  })
})
router.post('/reportPost',authenticateToken,(req,res)=>{
  console.log(req.body,"body");
  userHelper.reportPost(req.body).then((response)=>{
    if(response.reportAdded)
    {
      res.send("reportAdded")
    }else if(response.alreadyReported)
    {
      res.send("alreadyReported")
    }
  })
})
router.post('/getHashPost',authenticateToken,(req,res)=>
{
  userHelper.getHashPost(req.body).then((response)=>
  {
    res.send(response)
  })
})
router.post('/getAnotherUserProfile',authenticateToken,async(req,res)=>{
  let userPost = await userHelper.getUserPost(req.body.userId)
  userHelper.findAnotherUser(req.body.userId,req.body.ownerId).then((data)=>
  {
    console.log(data);
    let img = path.join(__dirname, '../public/ProfileImages/' + req.body.userId + '.jpg')
    if (fs.existsSync(img)) {
      console.log("img exist");
      res.send({ user: data, imgUrl: '/ProfileImages/' + req.body.userId + '.jpg',posts:userPost })
    } else {
      res.send({ user: data, imgUrl: '',posts:userPost })
    }
  })
})
router.post('/searchUsers',authenticateToken,(req,res)=>
{
  userHelper.searchUser(req.body.search).then((response)=>
  {
    if(response.length != 0)
    {
      res.send(response)
    }else{
      res.send("NoResult")
    }
  })
})
router.post('/followRequest',authenticateToken,(req,res)=>
{
  userHelper.followRequest(req.body.requester,req.body.accepter,req.body.name).then((response)=>
  {
    if(response.requested)
    {
      res.send("Requested")
    }else if(response.alreadyRequested){
      res.send("alreadyRequested")
    }
  })
})
router.post('/getFriendRequest',authenticateToken,(req,res)=>
{
  userHelper.getFriendRequest(req.body.user).then((response)=>
  {
    res.send(response)
  }).catch(()=>
  {
    res.send("noRequests")
  })
})
router.post('/acceptFriend',authenticateToken,(req,res)=>
{
  userHelper.acceptFriend(req.body.details,req.body.accepter,req.body.accepterName).then(()=>
  {
    res.send("Accepted")
  })
})
router.post('/rejectFriend',authenticateToken,(req,res)=>
{
  userHelper.rejectFriend(req.body.details,req.body.accepter).then(()=>
  {
    res.send("Removed")
  })
})
module.exports = router;
