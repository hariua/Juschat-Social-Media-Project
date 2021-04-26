let moment = require('moment')
module.exports={
    chatMessage:(msg,senderId,receiverId,urlCheck)=>
    {
        let userData={}
        let d = new Date()
        let date= moment(d).format('YYYY-MM-DD')
        let time= moment(d).format('hh:mm:a')
        userData={
            Message:msg, 
            senderId:senderId,
            receiverId:receiverId,
            date:date,
            time:time,
            url:urlCheck
        }
        return userData
        
    }
}