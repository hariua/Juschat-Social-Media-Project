var db = require('../connection/connection')
var collection = require('../connection/collection')
var bcrypt =require('bcrypt')
const { USER_COLLECTION } = require('../connection/collection')
module.exports={
    userSignup:(userData)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            
            let status={}
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({$or:[{Email:userData.Email},{Mobile:userData.Mobile}]})
            
           
            if(user)
            {
                status.userExist=true;
                resolve(status)
            }
            else{
                userData.Password =await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>
                {
                    status.user = data.ops[0]
                    console.log(status.user,"user");
                    resolve(status)
                })
            }
        })
    },
    userLogin:(userData)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let status ={}
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user)
            {
                bcrypt.compare(userData.Password,user.Password).then((response)=>
                {
                    if(response)
                    {
                        status.user=user
                        resolve(status)
                    }else{
                        status.invalidPassword=true
                        resolve(status)
                    }
                })
            }else{
                status.invalidUser=true
                resolve(status)
            }
        })
    }
}