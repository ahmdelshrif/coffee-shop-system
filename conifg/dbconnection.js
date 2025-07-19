const mongoose=require("mongoose")


exports.dbconnection=()=>{
    mongoose.connect(process.env.Url_DB).then((data)=>{

        console.log(`DataBase Connect: ${data.connection.host}  `)
    }).catch((err)=>{
        console.warn(err)
    })
}
