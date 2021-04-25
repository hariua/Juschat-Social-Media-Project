let users=[]

module.exports={
    userJoin:(id,sender,receiver,senderName,receiverName)=>{
        const user = {id,sender,receiver,senderName,receiverName}
        users.push(user)
        return user;
    },
    getCurrentUser:(id)=>
    {
        return users.find(user=> user.id===id)
    }
}