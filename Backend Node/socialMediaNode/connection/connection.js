const mongoClient = require('mongodb').MongoClient
var state={

}
 module.exports={
    connect:(done)=>
    {
        const dbName="Juschat"
        const url=process.env.DATABASE_URL
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