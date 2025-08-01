// const synchandler=require("express-async-handler")
// const Purchase=require("../model/Purchase_Invoice")
// const dotenv=require("dotenv")
// dotenv.config({path:"conf.env"})
// const ApiErorr=require("../utils/apiError")
// const { select } = require("async")
// const reports=require("../model/reports.model")
// // عشان نعمل رقم خاص بالفاتوره
// function generateUniqueNumber() {
//     const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digits
//     const timePart = Date.now().toString().slice(-4); // last 4 digits of timestamp
//     return `${randomPart}${timePart}`; // total 8 digits
//   }
  
// exports.Createpurchase_Invoice=(synchandler(async(req,res,next)=>{
   
//     const  items  = req.body.items;
//     const Amount_received=req.body.Amount_received
//     let amount=0;
//     let total =0;
//    let  remaining_amount=0;
//     items.forEach((value)=>{
//        value.subtotal=value.quantity * value.costPrice 
//        amount +=value.quantity
//        total+=value.subtotal
//     })
//     remaining_amount=total - Amount_received
//     const Invoice = await  Purchase.create({
//         employee:req.User.name ,
//         items,
//         supplierName:req.body.supplierName,
//         invoiceNumber:generateUniqueNumber(),
//         totalAmount:amount,
//         total,
//         Amount_received ,
//         remaining_amount

//     })


// await reports.findOneAndUpdate({name:"report"},{
//     $inc: { invoce:(Invoice.Amount_received)} ,
// },{new:true})

// res.status(200).json({data:Invoice})
// }))

// exports.getpurchase_Invoice=(synchandler(async(req,res,next)=>{

//     const Invoice=await Purchase.findById({_id:req.params.id})
//     if(!Invoice){return next(new ApiErorr(`لا يوجد فاتوره بهذا ال id `, 403))}
//     res.status(200).json({data:Invoice})
// }))


// exports.getspurchase_Invoice=(synchandler(async(req,res,next)=>{

//     const Invoice=await Purchase.find({})
//     if(Invoice.length== 0){return next(new ApiErorr(`لا يوجد فواتير `, 403))}
//     res.status(200).json({data:Invoice})
// }))

// exports.old_bill=(synchandler(async(req,res,next)=>{

    
// const Invoice=await Purchase.findOneAndUpdate({invoiceNumber:req.body.invoiceNumber},{
//     $inc: { remaining_amount:- req.body.Amount_received ,Amount_received:req.body.Amount_received},
//     createdAt:Date.now() 
// },{new:true})
// if(!Invoice){return next(new ApiErorr(`لا يوجد فاتوره ل `, 403))}

// await reports.findOneAndUpdate({name:"report"},{
//     $inc: { Invoice:(Invoice.Amount_received)} ,
// },{new:true})

// res.status(200).json({data:Invoice})

// }))




