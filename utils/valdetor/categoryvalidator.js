const { check, body } = require('express-validator');
const validetorError=require("../../middelweres/validetorError")
const categories=require("../../model/category.model")

//تحديد ال erorr اثناء عرض SpecifiedCategory
exports.SpecifiedCategory_catchError=check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")

//تحديد ال erorr اثناء عرض creatCategory
exports.creatCategory_catchError=[check(`name`).notEmpty().withMessage(`الاسم مطلوب`).custom(async(vale)=>{
const category= await categories.findOne({name:vale})
if(category){
    return Promise.reject(
     new Error(`لا يمكن تكرار هذا الاسم: ${vale}`)
     );
    }
    return true
})  
.isLength({min:3})
.withMessage(`الحرف قليله يجب اقل شي 3 حروف`)
.isLength({max:32}).withMessage(`الحروف كبيره اقصي عدد 32`),check("image")
.notEmpty().withMessage("يجب رفع صوره")
,check("description").optional(),validetorError
]

//تحديد ال erorr اثناء عرض updateCategory
exports.updateCategory_catchError=[check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")
,body(`name`).optional().custom(async(vale)=>{
const category= await categories.findOne({name:vale})
  if(category){
    return Promise.reject(
     new Error(`لا يمكن تكرار هذا الاسم: ${vale}`)
     );
    }
   if(vale.length<2){
      return Promise.reject(
      new Error(`الحرف قليله يجب اقل شي 3 حروف : ${vale}`)
      );
    }else if(vale.length>=32)
        {
         return Promise.reject(
         new Error(`الحروف كبيره اقصي عدد 32: ${vale}`)
         ); 
        }
        return true
    }),validetorError
]
//تحديد ال erorr اثناء عرض deleteCategory
exports.deleteCategory_catchError=[check(`id`).isMongoId().withMessage("خطاء في ال id "),validetorError]