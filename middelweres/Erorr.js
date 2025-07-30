const ApiError=require("../utils/apiError")


errorDetection = (err)=>{
 if (err.name === 'CastError') {
  const message = `Invalid ${err.path}: ${err.value}`;
  return  err= new ApiError(message, 400);
    }
      return err
}
    
exports.globalEorrs= (err,req,res,next)=>{
 err.statusCode = err.statusCode || 500;
 err.status = err.status || 'error';
 err=errorDetection(err);
       if(process.env.NODE_ENV=="Devlopment"){
        senderrorforev(err,res)
       }else{
        senderrorforproducct(err,res)
       }
       
    }

// عرض ال erorr في ال Devlopment
const senderrorforev=(err,res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
 }


// عرض ال erorr في ال producct
const senderrorforproducct=(err,res)=>{
     if(err.name==="JsonWebTokenError")
        {       
           err= new ApiError("invalid token ", 400);
        }
         else if(err.name==="TokenExpiredError"){
           err= new ApiError("expirt token ", 400);
          }
          res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
          }); 
}



  

  
