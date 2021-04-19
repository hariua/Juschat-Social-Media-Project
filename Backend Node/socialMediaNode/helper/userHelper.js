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
    findAnotherUser: (userId, ownerId) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            let data = {
                userId: String(user._id),
                userName: user.Name
            }
            db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: ownerId, Verified: data }).then((check) => {

                if (check == null) {
                    resolve(user)
                } else {
                    user.Friend = true
                    resolve(user)
                }
            })
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
        let hstag = info.hashtag.match(/#[a-z]+/gi)
        let data = {
            FileName: fileName,
            UserID: info.id,
            User: info.user,
            Description: info.description,
            Location: info.location,
            HashTag: hstag,
            Date: date,
            Time: time,
            Likes: []
        }
        if(info.cropImg)
        {
            var base64Str = info.cropImg
            let location = path.join(__dirname, '../public/PostFiles/')
            var optionalObj = { 'fileName': fileName, 'type': 'jpg' };
            base64ToImage(base64Str, location, optionalObj);            
        }
        return new Promise((resolve, reject) => {
            db.get().collection(collection.POST_COLLECTION).insertOne(data).then((res) => {
                resolve(res.ops[0])
            })
        })
    },
    getAllPosts: (userId) => {
        let newId = []
        return new Promise(async (resolve, reject) => {
            let id = await db.get().collection(collection.FRIENDS_COLLECTION).aggregate([
                {
                    $match: {
                        User: userId
                    }
                },
                {
                    $unwind: '$Verified'
                },
                {
                    $project: {
                        _id: null,
                        friend: '$Verified.userId'
                    }
                }
            ]).toArray()
            for (let i = 0; i < id.length; i++) {
                let item = id[i].friend
                newId.push(item)
            }
            console.log(newId)
            let post = await db.get().collection(collection.POST_COLLECTION).find({ UserID: { $in: newId } }).toArray()
            resolve(post)
        })
    },
    addLikePost: (postData) => {
        let status = {}
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(postData.userId) })
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
                            let Dat = new Date()
                            let Day = moment(Dat).format('YYYY-MM-DD')
                            let Time = moment(Dat).format('hh-mm-ss')
                            let postId = post._id

                            let notification = {
                                Item: "Like",
                                Sender: String(user._id),
                                SenderName: user.Name,
                                Receiver: post.UserID,
                                ReceiverName: post.User,
                                Post: String(postId),
                                PostName:post.FileName,
                                Date: Day,
                                Time: Time
                            }
                            let noti = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ Item: "Like", Sender: String(user._id), Receiver: post.UserID, Post: String(postId) })
                            if (!noti) {
                                db.get().collection(collection.NOTIFICATION_COLLECTION).insertOne(notification).then(() => {
                                    resolve(status)
                                })
                            } else {
                                resolve(status)
                            }

                        })
                    } else {
                        let newVal = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postData.postId) })
                        status.count = newVal.Likes.length
                        status.oldLike = true
                        resolve(status)
                    }
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
        return new Promise(async (resolve, reject) => {
            let date = new Date()
            var commentID = moment(date).format('YYYY-MM-DD-h-mm-ss')
            let file = {
                _id: commentID,
                Comment: data.comment,
                UserName: data.user,
                UserId: data.userId
            }
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(data.userId) })
            let post = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(data.post) })
            if (post.Comment) {
                db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(data.post) }, {
                    $push: {
                        Comment: file
                    }
                }).then(async () => {
                    let Dat = new Date()
                    let Day = moment(Dat).format('YYYY-MM-DD')
                    let Time = moment(Dat).format('hh-mm-ss')
                    let postId = post._id

                    let notification = {
                        Item: "Comment",
                        Sender: String(user._id),
                        SenderName: user.Name,
                        Receiver: post.UserID,
                        ReceiverName: post.User,
                        Post: String(postId),
                        PostName:post.FileName,
                        Date: Day,
                        Time: Time
                    }
                    let noti = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ Item: "Comment", Sender: String(user._id), Receiver: post.UserID, Post: String(postId) })
                    if (!noti) {
                        db.get().collection(collection.NOTIFICATION_COLLECTION).insertOne(notification).then(() => {
                            if (post.Comment.length === 0) {
                                resolve("newComment")
                            } else {
                                resolve()
                            }
                        })
                    } else {
                        if (post.Comment.length === 0) {
                            resolve("newComment")
                        } else {
                            resolve()
                        }
                    }
                })
            } else {
                db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(data.post) }, {
                    $set: {
                        Comment: [file]
                    }
                }).then(async() => {
                    let Dat = new Date()
                    let Day = moment(Dat).format('YYYY-MM-DD')
                    let Time = moment(Dat).format('hh-mm-ss')
                    let postId = post._id

                    let notification = {
                        Item: "Comment",
                        Sender: String(user._id),
                        SenderName: user.Name,
                        Receiver: post.UserID,
                        ReceiverName: post.User,
                        Post: String(postId),
                        PostName:post.FileName,
                        Date: Day,
                        Time: Time
                    }
                    let noti = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ Item: "Comment", Sender: String(user._id), Receiver: post.UserID, Post: String(postId) })
                    if (!noti) {
                        db.get().collection(collection.NOTIFICATION_COLLECTION).insertOne(notification).then(() => {
                             resolve("newComment")   
                        })
                    } else {
                        resolve("newComment")  
                    }
                })
            }
        })
    },
    reportPost: (data) => {
        let status = {}
        return new Promise(async (resolve, reject) => {
            let post = await db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(data.postId) })
            if (post.Report) {
                db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(data.postId), Report: data.userId }).then((check) => {
                    console.log(check);
                    if (check == null) {
                        db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(data.postId) }, {
                            $push: {
                                Report: data.userId
                            }
                        }).then(() => {
                            status.reportAdded = true;
                            resolve(status)
                        })
                    }
                    else {
                        status.alreadyReported = true;
                        resolve(status)
                    }
                })
            } else {
                db.get().collection(collection.POST_COLLECTION).updateOne({ _id: objectId(data.postId) }, {
                    $set: {
                        Report: [data.userId]
                    }
                }).then(() => {
                    status.reportAdded = true;
                    resolve(status)
                })
            }

        })
    },
    getHashPost: (data) => {
        return new Promise(async (resolve, reject) => {
            let hashPost = await db.get().collection(collection.POST_COLLECTION).find({ HashTag: data.hash }).toArray()
            console.log(hashPost, "vannutto");
            resolve(hashPost)
        })
    },
    getUserPost: (userId) => {
        let status = {}
        return new Promise(async (resolve, reject) => {
            let post = await db.get().collection(collection.POST_COLLECTION).find({ UserID: userId }).toArray()
            if (post) {
                status.post = post
                resolve(status)
            } else {
                resolve(status)
            }

        })
    },
    searchUser: (word) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).createIndex({ Name: "text" }).then(async () => {
                let users = await db.get().collection(collection.USER_COLLECTION).find({ $text: { $search: word } }).toArray()
                resolve(users)
            })


        })
    },
    followRequest: (requester, accepter, userName) => {
        return new Promise(async (resolve, reject) => {
            let status = {}
            let val = {
                userId: requester,
                userName: userName
            }
            let friend = await db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: accepter })
            if (friend) {
                db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: accepter, Pending: val }).then((check) => {
                    if (check == null) {
                        db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: accepter, Verified: val }).then((search) => {
                            if (search == null) {
                                db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: accepter }, {
                                    $push: {
                                        Pending: val
                                    }
                                }).then(() => {
                                    status.requested = true
                                    resolve(status)
                                })
                            } else {
                                status.alreadyFriends = true
                                resolve(status)
                            }
                        })

                    } else {
                        status.alreadyRequested = true
                        resolve(status)
                    }
                })
            } else {
                let obj = {
                    User: accepter,
                    Verified: [],
                    Pending: [val]
                }
                db.get().collection(collection.FRIENDS_COLLECTION).insertOne(obj).then(() => {
                    status.requested = true
                    resolve(status)
                })
            }
        })
    },
    getFriendRequest: (id) => {
        return new Promise(async (resolve, reject) => {
            let request = await db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: id })
            if (request) {
                if (request.Pending.length > 0) {
                    resolve(request.Pending)
                } else {
                    reject()
                }
            } else {
                reject()
            }
        })
    },
    acceptFriend: (details, accepter, accepterName) => {
        return new Promise(async (resolve, reject) => {
            let val = {
                userId: accepter,
                userName: accepterName
            }
            let owner = await db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: accepter })
            if (owner) {
                db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: accepter }, {
                    $pull: {
                        Pending: details
                    }
                }).then(() => {
                    db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: accepter }, {
                        $push: {
                            Verified: details
                        }
                    }).then(async () => {
                        let friend = await db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: details.userId })
                        if (friend) {
                            db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: details.userId, Verified: val }).then((check) => {
                                if (check == null) {
                                    db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: details.userId, Pending: val }).then((search) => {
                                        if (search == null) {
                                            db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: details.userId }, {
                                                $push: {
                                                    Verified: val
                                                }
                                            }).then(() => {

                                                resolve()
                                            })
                                        } else {
                                            db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: details.userId }, {
                                                $push: {
                                                    Verified: val
                                                }
                                            }).then(() => {
                                                db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: details.userId }, {
                                                    $pull: {
                                                        Pending: val
                                                    }
                                                }).then(() => {
                                                    resolve()
                                                })
                                            })
                                        }
                                    })

                                } else {

                                    resolve()
                                }
                            })
                        } else {
                            let obj = {
                                User: details.userId,
                                Verified: [val],
                                Pending: []
                            }
                            db.get().collection(collection.FRIENDS_COLLECTION).insertOne(obj).then(() => {

                                resolve()
                            })
                        }
                    })
                })
            }
        })
    },
    rejectFriend: (details, accepter) => {
        return new Promise(async (resolve, reject) => {
            let owner = await db.get().collection(collection.FRIENDS_COLLECTION).findOne({ User: accepter })
            if (owner) {
                db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: accepter }, {
                    $pull: {
                        Pending: details
                    }
                }).then(() => {
                    resolve()
                })
            }
        })
    },
    getSuggestions: (userId) => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find({ _id: { $nin: [objectId('606a9aca8c95729da1eec5ff'), objectId(userId)] } }).sort({ _id: -1 }).limit(3).toArray()
            resolve(users)
        })
    },
    blockUser: (userId, ownerId) => {
        return new Promise(async (resolve, reject) => {
            console.log(userId, "user", ownerId, "owner");
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            let userName = user.Name
            let obj = {
                userId: userId,
                userName: userName
            }
            db.get().collection(collection.FRIENDS_COLLECTION).updateOne({ User: ownerId }, {
                $pull: {
                    Verified: obj
                }
            }).then(() => {
                resolve(userName)
            })
        })
    },
    getNotifications:(userId)=>{
        return new Promise(async(resolve,reject)=>
        {
            let notifications = await db.get().collection(collection.NOTIFICATION_COLLECTION).find({Receiver:userId}).sort({Date:-1,Time:-1}).toArray()
            
            if(notifications.length>0)
            {
                console.log(notifications);
                resolve(notifications.slice(0,3))
            }else{
                resolve("noNotifications")
            }
        })
    },
    deletePost:(id)=>
    {
        return new Promise((resolve,reject)=>
        {
            db.get().collection(collection.POST_COLLECTION).removeOne({_id:objectId(id)}).then(()=>
            {
                resolve()
            })
        })
    }
}