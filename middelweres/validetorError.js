
const { validationResult } = require('express-validator');

// عرض ال eroor
const ValdetorErros=(req,res,next)=>{
const error=validationResult(req);
if(!error.isEmpty()){
    res.status(400).json({errors:error.array()})   
}
next();
}
module.exports=ValdetorErros