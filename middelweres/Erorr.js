const ApiError=require("../utils/apiError")

// eslint-disable-next-line no-undef
errorDetection = (err)=>{
        if (err.name === 'CastError') {
            const message = `Invalid ${err.path}: ${err.value}`;
         // eslint-disable-next-line no-return-assign
         return  err= new ApiError(message, 400);
          }
            return err
    }
    
// eslint-disable-next-line no-undef
exports.globleEorrs= (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
       // eslint-disable-next-line no-undef
       err=errorDetection(err);
       // eslint-disable-next-line eqeqeq
       if(process.env.NODE_ENV=="Devlopment"){
        // eslint-disable-next-line no-use-before-define
        senderrorforev(err,res)
       }else{
        // eslint-disable-next-line no-use-before-define
        senderrorforproducct(err,res)
       }
       
    }
    const senderrorforev=(err,res)=>{
      
            res.status(err.statusCode).json({
                satuts:err.status,
                err:err,
                msg:err.message,
                stack:err.stack,       
            })
        }

        const senderrorforproducct=(err,res)=>{
            if(err.name==="JsonWebTokenError")
                {
                    // eslint-disable-next-line no-return-assign
                   err= new ApiError("invalid token ", 400);
                }
                else if(err.name==="TokenExpiredError"){
                   err= new ApiError("expirt token ", 400);
                }
                    res.status(err.statusCode).json({
                        satuts:err.status,
                        msg:err.message,
                    })
                
                
        }
           
    

// eslint-disable-next-line no-undef


  

  
