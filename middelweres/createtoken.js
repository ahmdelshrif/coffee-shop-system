
const jwt=require("jsonwebtoken")

 exports.createToken=(payload)=>{
const token=jwt.sign({userId:payload},process.env.TokenSecret,{
    expiresIn:"90d"
})
return token
}
