const jwt=require("jsonwebtoken")

const Jokertoken=(payload)=>jwt.sign({UserId:payload},process.env.tokenSecret,{
        expiresIn:process.env.expriesin
    })

    module.exports=Jokertoken