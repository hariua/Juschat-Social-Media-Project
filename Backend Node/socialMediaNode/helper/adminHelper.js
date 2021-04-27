var db = require('../connection/connection')
var collection = require('../connection/collection')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
module.exports={
    adminLogin:(adminData)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let status={}
            let admin = await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId('606a9aca8c95729da1eec5ff')})
            if(adminData.User === admin.UserName)
            {
                bcrypt.compare(adminData.Password,admin.Password).then((response)=>
                {
                    if(response)
                    {
                        status.admin = admin
                        status.loginSuccess = true
                        resolve(status)
                    }
                    else{
                        status.invalidPassword = true
                        resolve(status)
                    }
                })
            }
            else{
                status.invalidUser = true
                resolve(status)
            }
        })
    },
    getAllUsers:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let users = await db.get().collection(collection.USER_COLLECTION).find({_id:{$ne:objectId('606a9aca8c95729da1eec5ff')}}).toArray()
            resolve(users)
        })
    },
    blockUser:(id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)})
            if(user)
            {
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{
                    $set:{
                        Status:true
                    }
                }).then(()=>
                {
                    resolve()
                })
            }            
        })
    },
    unblockUser:(id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)})
            if(user)
            {
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{
                    $unset:{
                        Status:""
                    }
                }).then(()=>
                {
                    resolve()
                })
            }            
        })
    },
    getAllPosts:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let posts = await db.get().collection(collection.POST_COLLECTION).find().toArray()
            resolve(posts)
        })
    },
    getReportedPosts:()=>{
        return new Promise(async(resolve,reject)=>
        {
            let reportPost = await db.get().collection(collection.POST_COLLECTION).find({Report:{$exists:true}}).toArray()
            if(reportPost.length>0)
            {
                resolve(reportPost)
            }else{
                resolve("noReport")
            }
        })
    },
    reportPost:(data)=>
    {
        return new Promise((resolve,reject)=>
        {
            db.get().collection(collection.POST_COLLECTION).updateOne({_id:objectId(data.postId)},{
                $set:{
                    FileName:"REPORT.jpg"
                }
            }).then(()=>
            {
                resolve()
            })
        })
    },
    getDashboardData:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let allPosts = await db.get().collection(collection.POST_COLLECTION).find().count()
            let allUsers = await db.get().collection(collection.USER_COLLECTION).find().count()

            let reportedPosts = await db.get().collection(collection.POST_COLLECTION).find({FileName:"REPORT.jpg"}).count()
            let reportedUsers = await db.get().collection(collection.USER_COLLECTION).find({Status:true}).count()
            let data={
                allPosts:allPosts,
                allUsers:allUsers,
                reportedPosts:reportedPosts,
                reportedUsers:reportedUsers
            }
            resolve(data)
        })
    }
}