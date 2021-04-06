var db = require('../connection/connection')
var collection = require('../connection/collection')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
var base64ToImage = require('base64-to-image')
let path = require('path')
const { USER_COLLECTION } = require('../connection/collection')
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
                else{
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
    base64Convert:(img,id)=>
    {
        return new Promise((resolve,reject)=>
        {
            var base64Str = img
           let location = path.join(__dirname,'../public/ProfileImages/')
           var optionalObj = {'fileName': id, 'type':'jpg'};
           base64ToImage(base64Str,location,optionalObj); 
           
        })
    }
}