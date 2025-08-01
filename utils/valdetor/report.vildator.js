// const { check, body } = require('express-validator');
// const synchandler=require("express-async-handler")
// const reprosts=require("../../model/reports.model")
// const validetorError=require("../../middelweres/validetorError")


// // تحديد ال erorr اثناء عرض loginUser_catchError
// exports.addingExpenses_catchError=[check(`Expenses`).notEmpty().withMessage(`يجب ادخال المصروفات `)
//     .custom((value)=>{
//         if(value<0)
//         {
//             throw new Error(("يجب ان تكون المصروفات قيمه موجكجبه اكبر من 0  "))
//         }
//         return true
//     })
//   ,validetorError
// ]

