let moment = require('moment')
module.exports={
    chatMessage:(msg,senderName,senderId,receiverName,receiverId,urlCheck)=>
    {
        let userData={}
        let d = new Date()
        let date= moment(d).format('YYYY-MM-DD')
        let time= moment(d).format('hh:mm:a')
        userData={
            Message:msg, 
            senderName:senderName,
            senderId:senderId,
            receiverName:receiverName, 
            receiverId:receiverId,
            date:date,
            time:time,
            url:urlCheck
        }
        return userData
        
    }
}