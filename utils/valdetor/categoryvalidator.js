const { check, body } = require('express-validator');
// const slugify=require("slugify")
const validetorError=require("../../middelweres/validetorError")
const categories=require("../../model/category.model")
exports.getcategooryvalidatorErrors=check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")

exports.creatcategoryErrors=[check(`name`).notEmpty().withMessage(`الاسم مطلوب`).custom(async(vale)=>{
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

exports.updateOnecategoryErrors=[check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")
    ,body(`name`).optional().custom(async(vale)=>{
 const category= await categories.findOne({name:vale})
    if(category){
        return Promise.reject(
            new Error(`لا يمكن تكرار هذا الاسم: ${vale}`)
          );
    }
        if(vale.length<2){
            console.log(vale.length)
             return Promise.reject(
                new Error(`الحرف قليله يجب اقل شي 3 حروف : ${vale}`)
              );
        }else if (vale.length>=32)
        {
            return Promise.reject(
                new Error(`الحروف كبيره اقصي عدد 32: ${vale}`)
              ); 
        }
           return true
    }),validetorError
]
exports.DeleteOnecategoryErrors=[check(`id`).isMongoId().withMessage("invaled id "),validetorError]