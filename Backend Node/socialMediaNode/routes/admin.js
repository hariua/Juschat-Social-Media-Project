var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
var adminHelper = require('../helper/adminHelper')
/* GET users listing. */
function authenticateAdmin(req, res, next) {
  if (req.body.jwt1) {
    let token = req.body.jwt1
  } else {
    token = req.query.jwt1
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
        console.log("Access Granted");
        delete user.iat
        req.admin = user
        console.log("jwt data", req.admin);
        next()
      }
    })
  }
}


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/adminLogin', (req, res) => {
  adminHelper.adminLogin(req.body).then((response) => {
    console.log(response);
    if (response.loginSuccess) {
      let jwt1 = jwt.sign(response.admin, process.env.SECRET_KEY)
      res.send({ login: "Success", jwt: jwt1 })
    } else if (response.invalidPassword) {
      res.send({ login: "invalidPassword" })
    } else (response.invalidUser)
    {
      res.send({ login: "invalidUser" })
    }
  })
})
router.get('/getAllUsers', authenticateAdmin, (req, res) => {
  adminHelper.getAllUsers().then((users) => {
    res.send(users)
  })
})
router.post('/blockUser', authenticateAdmin, (req, res) => {
  adminHelper.blockUser(req.body.id)
})
router.post('/unblockUser', authenticateAdmin, (req, res) => {
  adminHelper.unblockUser(req.body.id)
})
router.get('/getAllPosts',authenticateAdmin,(req,res)=>
{
  adminHelper.getAllPosts().then((response)=>
  {
    res.send(response)
  })
})
router.get('/reportedPosts',authenticateAdmin,(req,res)=>{
  adminHelper.getReportedPosts().then((response)=>
  {
    if(response=='noReport')
    {
      res.send('noReport')
    }else{
      res.send(response)
    }
  })
})
router.post('/reportPostAdmin',authenticateAdmin,(req,res)=>
{
  adminHelper.reportPost(req.body).then(()=>
  {
    res.send("PostRemoved")
  })
})
router.get('/adminDashboardData',authenticateAdmin,(req,res)=>{
  adminHelper.getDashboardData().then((response)=>
  {
    res.send(response) 
  })
})
module.exports = router;
