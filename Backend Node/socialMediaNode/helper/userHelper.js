var db = require('../connection/connection')
var collection = require('../connection/collection')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
var base64ToImage = require('base64-to-image')
let path = require('path')
var moment = require('moment')
var { OAuth2Client } = require('google-auth-library')
const { USER_COLLECTION } = require('../connection/collection')
const { resolve } = require('path')
const { post } = require('../routes/user')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
module.exports = {
    userCheckup: (userData) => {
        return new Promise(async (resolve, reject) => {

            let status = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ $or: [{ Email: userData.Email }, { Mobile: userData.Mobile }] })


            if (user) {
                status.userExist = true;
                resolve(status)
            }
            else {

                status.newUser = true;
                resolve(status)
            }
        })
    },
    signupUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {

                console.log(data.ops[0], "user");
                resolve(data.ops[0])
            })
        })
    },
    userLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let status = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                if (!user.Status) {
                    bcrypt.compare(userData.Password, user.Password).then((response) => {
                        if (response) {
                            status.user = user
                            resolve(status)
                        } else {
                            status.invalidPassword = true
                            resolve(status)
                        }
                    })
                }
                else {
                    status.userBlocked = true
                    resolve(status)
                }
            } else {
                status.invalidUser = true
                resolve(status)
            }
        })
    },
    editProfile: (Name, Des, id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(id) }, {
                $set: {
                    Name: Name,
                    Description: Des
                }
            }).then(async () => {
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(id) })
                console.log(user);
                resolve(user)
            })
        })
    },
    findUser: (id) => {
        return new Promise((resolve, reject) => {
            let user = db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(id) })
            resolve(user)
        })
    },
    changePassword: (userData, id) => {
        return new Promise(async (resolve, reject) => {
            let status = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(id) })
            if (user) {
                console.log(user);
                bcrypt.compare(userData.CurrentPassword, user.Password).then(async (response) => {
                    if (response) {
                        userData.NewPassword = await bcrypt.hash(userData.NewPassword, 10)
                        db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(id) }, {
                            $set: {
                                Password: userData.NewPassword
                            }
                        }).then(() => {
                            status.passwordChange = true
                            resolve(status)
                        })
                    }
                    else {
                        status.invalidPassword = true
                        resolve(status)
                    }
                })
            }
        })
    },
    base64Convert: (img, id) => {
        return new Promise((resolve, reject) => {
            var base64Str = img
            let location = path.join(__dirname, '../public/ProfileImages/')
            var optionalObj = { 'fileName': id, 'type': 'jpg' };
            base64ToImage(base64Str, location, optionalObj);

        })
    },
    googleSignup: (data) => {
        return new Promise((resolve, reject) => {
            let token = data.token
            let status = {}

            client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID }).then(async (res) => {

                let data = {
                    Name: res.payload.name,
                    Email: res.payload.email,
                    GoogleId: res.payload.sub,
                    GoogleLogin: true
                }
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ GoogleLogin: true, Email: data.Email })
                if (!user) {
                    db.get().collection(collection.USER_COLLECTION).insertOne(data).then((res) => {
                        status.userSignup = true
                        status.userSignupData = res.ops[0]
                        resolve(status)
                    })
                }
                else {
                    status.userLogin = true
                    status.userLoginData = user
                    resolve(status)
                }
            }).catch(() => {
                reject("Invalid User")
            })
        })
    },
    facebookSignup: (data) => {
        let status = {}
        return new Promise(async (resolve, reject) => {

            let info = {
                Name: data.Name,
                Email: data.Email,
                FacebookId: data.id,
                FacebookLogin: true
            }
            console.log(info, "info");
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ FacebookLogin: true, Email: info.Email })
            if (!user) {
                db.get().collection(collection.USER_COLLECTION).insertOne(info).then((res) => {
                    status.userSignup = true
                    status.userSignupData = res.ops[0]
                    resolve(status)
                })
            }
            else {
                status.userLogin = true
                status.userLoginData = user
                resolve(status)
            }
        })
    },
    addPost: (info, fileName, time, date) => {
        let data = {
            FileName: fileName,
            UserID: info.id,
            User: info.user,
            Description: info.description,
            Location: info.location,
            HashTag: info.hashtag,
            Date: date,
            Time: time
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collection.POST_COLLECTION).insertOne(data).then((res) => {
                resolve(res.ops[0])
            })
        })
    },
    getAllPosts: () => {
        return new Promise(async (resolve, reject) => {
            let posts = await db.get().collection(collection.POST_COLLECTION).find().toArray()
            resolve(posts)

        })
    },
    addLikePost: (postData) => {
        let status = {}
        return new Promise(async (resolve, reject) => {
            let post = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
            if (post.Likes) {
                db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId), Likes: postData.userId }).then(async (check) => {
                    if (check == null) {
                        db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(postData.postId) }, {
                            $push: {
                                Likes: postData.userId
                            }
                        }).then(async () => {
                            let newVal = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
                            status.count = newVal.Likes.length
                            status.newLike = true
                            resolve(status)
                        })
                    } else {
                        let newVal = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
                        status.count = newVal.Likes.length
                        status.oldLike = true
                        resolve(status)
                    }
                })

            } else {
                db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(postData.postId) }, {
                    $set: {
                        Likes: [postData.userId]
                    }
                }).then(async () => {
                    let newVal = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
                    status.count = newVal.Likes.length
                    status.newLike = true
                    resolve(status)
                })
            }
        })
    },
    removeLikePost: (postData) => {
        let status = {}
        return new Promise(async (resolve, reject) => {
            let post = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
            if (post.Likes) {
                db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId), Likes: postData.userId }).then(async (check) => {
                    if (check != null) {
                        db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(postData.postId) }, {
                            $pull: {
                                Likes: postData.userId
                            }
                        }).then(async () => {
                            let likeC = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
                            status.remLike = likeC.Likes.length
                            status.removeLike = true
                            resolve(status)
                        })
                    } else {
                        let likeC = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
                        status.remLike = likeC.Likes.length
                        status.noUser = true
                        resolve(status)
                    }
                })
            }
        })
    },
    addComment: (data) => {
        return new Promise(async(resolve, reject) => {
            let date = new Date()
            var commentID = moment(date).format('YYYY-MM-DD-h-mm-ss')
            let file = {
                _id:commentID,
                Comment: data.comment,
                UserName: data.user,
                UserId: data.userId
            }
            let post =await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(data.post) })
            if (post.Comment) {
                db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(data.post) }, {
                    $push: {
                        Comment: file
                    }
                }).then(()=>{
                    resolve()
                })
            } else {
                db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(data.post) }, {
                    $set: {
                        Comment: [file]
                    }
                }).then(()=>{
                    resolve()
                })
            }
        })
    },
    reportPost:(data)=>
    {
        let status={}
        return new Promise(async(resolve,reject)=>
        {
            let post =await db.get().collection(collection.POST_COLLECTION).findOne({_id:objectId(data.postId)})
            if(post.Report)
            {
                db.get().collection(collection.POST_COLLECTION).findOne({_id:objectId(data.postId),Report:data.userId}).then((check)=>
                {
                    console.log(check);
                    if(check == null)
                    {
                        db.get().collection(collection.POST_COLLECTION).updateOne({_id:objectId(data.postId)},{
                            $push:{
                                Report:data.userId
                            }
                        }).then(()=>
                        {
                            status.reportAdded=true;
                            resolve(status)
                        })
                    }
                    else{
                        status.alreadyReported=true;
                        resolve(status)
                    }
                })
            }else{
                db.get().collection(collection.POST_COLLECTION).updateOne({_id:objectId(data.postId)},{
                    $set:{
                        Report:[data.userId]
                    }
                }).then(()=>{
                    status.reportAdded=true;
                            resolve(status)
                })
            }
            
        })
    }
}