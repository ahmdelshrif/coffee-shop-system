class ApiErorr extends Error{

 
constructor(message,statusCode)
{
   super(message);
   // eslint-disable-next-line no-unused-expressions, no-sequences
   this.statusCode= statusCode ,
   this.status=`${statusCode}`.startsWith(4)? "fild":"error",
   this.isOprerational=true

}
}

module.exports=ApiErorr