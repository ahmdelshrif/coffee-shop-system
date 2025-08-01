// const { check, body } = require('express-validator');
// // const slugify = require('slugify');
// const invoice=require("../../model/Purchase_Invoice")
// const validetorError = require('../../middelweres/validetorError');



// exports.Specifiedinvoice_catchError=check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")

// //تحديد ال erorr اثناء عرض creatCategory
// exports.creatinvoice_catchError=[ check(`items`).notEmpty()
//           .withMessage("يجب إدخال صنف واحد على الأقل")
//           .custom(async (items) => {
//             if (!Array.isArray(items)) {
//               throw new Error("يجب أن تكون الأصناف في شكل مصفوفة");
//             }
//     return true
// }),check(`Amount_received`).notEmpty().withMessage(`يجب تصدير اي ملبغ للمورد `)
// .custom((value)=>{
//   if(value<0){
//     throw new Error("يجب ان يكون الملبغ اتكبر من الصفر");
//   }
//   return true
// }) , validetorError
// ]

// exports.old_bill_catchError=[check(`invoiceNumber`).notEmpty()
//   .withMessage(`يجب ادخال رقم الفاتوره `)
//   .custom(async(value)=>{
//     const invoices= await invoice.findOne({invoiceNumber:value})
//     if(!invoices){ throw new Error("يجب ان تكون القيمه ارقام") }
  
//     return true
//   }), validetorError
// ]