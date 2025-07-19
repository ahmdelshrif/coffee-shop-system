const synchandler=require("express-async-handler")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const reports=require("../model/reports.model")
const product=require("../model/products.model")

exports.Getreport=(synchandler(async(req,res,next)=>{

const report=await reports.findOne({name:'report'}).select(`Profits Revenue Expenses`)
if(!report)
{
    return next(new ApiErorr(`لا يوجد اي مصروفات وايرادات `,403))
}
res.status(200).json({data:report})
}))

exports.addingExpenses=(synchandler(async(req,res,next)=>{
    
   const report= await reports.findOneAndUpdate({name:'report'},{
     $inc: { Expenses:req.body.Expenses} ,
   }).select(`Profits Revenue Expenses`)

   if(!report)
   {
    return next(new ApiErorr(`لم يتم تسجيل المصروفات بشكل صحيح`,403))
   }

   report.Profits=report.Revenue-(report.Expenses+req.body.Expenses)
   await report.save()

   res.status(200).json({message: " تم التسجيل المصروفات بنجاح"})
   
}))
exports.get_Best_selling_products=(synchandler(async(req,res,next)=>{
    
    const limit=req.query.limit
 const products=await product.find().sort(`-sold`).select(`name price sold`).limit(limit)
 
    if(!products.legth===0)
    {
     return next(new ApiErorr(`لا يوجد اي منتجات `,403))
    }

    res.status(200).json({data: products})
    
 }))