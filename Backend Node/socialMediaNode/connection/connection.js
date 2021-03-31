const mongoClient = require('mongodb').MongoClient
var state={

}
 module.exports={
    connect:(done)=>
    {
        const dbName="Juschat"
        const url="mongodb://localhost:27017"
        mongoClient.connect(url,(err,data)=>
        {
            if(err)
            {
                return done(err)
            }else{
                state.db=data.db(dbName)
                done()
            }
        })
    },
    get:()=>
    {
        return state.db
    }
 }