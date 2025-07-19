
const { validationResult } = require('express-validator');

const ValdetorErros=(req,res,next)=>{
   const error=validationResult(req);
   if(!error.isEmpty())
    {
        res.status(400).json({errors:error.array()})
       
    } else{
        
        next();
    }
   
}
module.exports=ValdetorErros