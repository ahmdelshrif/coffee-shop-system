const { check, body } = require('express-validator');
// const slugify=require("slugify")
const validetorError=require("../../middelweres/validetorError")
const categories=require("../../model/category.model")
const products=require("../../model/products.model")

//تحديد ال erorr اثناء عرض Specifiedproduct
exports.Specifiedproduct_catchError=check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")

//تحديد ال erorr اثناء عرض creatproduct
exports.creatproduct_catchError=[check(`name`)
  .notEmpty()
  .withMessage(`الاسم مطلوب`).custom(async(vale)=>{
   const product= await products.findOne({name:vale})
   if(product){
      return Promise.reject(
      new Error(`لا يمكن تكرار هذا الاسم: ${vale}`)
         );
   }
   return true
})
.isLength({min:3})
  .withMessage(`الحرف قليله يجب اقل شي 3 حروف`)
  .isLength({max:32}).withMessage(`الحروف كبيره اقصي عدد 32`)
  ,check("image").optional()
  ,check("description").optional()
  ,check("price").notEmpty().withMessage("يجب تحديد السعر")
    .isNumeric().withMessage("يجب ان يكون رقم")
    ,validetorError
]

//تحديد ال erorr اثناء عرض updateproduct
exports.updateproduct_catchError=[check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")
 ,body(`name`).optional().custom(async(vale)=>{
 const product= await products.findOne({name:vale})
    if(product){
       return Promise.reject(
       new Error(`لا يمكن تكرار هذا الاسم: ${vale}`)
         );
    }
    else if(vale.length<2){
          return Promise.reject(
          new Error(`الحرف قليله يجب اقل شي 3 حروف : ${vale}`)
          );
        }else if (vale.length>=32) {
           return Promise.reject(
           new Error(`الحروف كبيره اقصي عدد 32: ${vale}`)
             ); 
        }
           return true
    })
    ,body("category").optional().custom(async(vale)=>{
     const category= await categories.findOne({_id:vale})
      if(!category)
      {
        return Promise.reject(
        new Error(`لا يوجد صنف بهذ ال id : ${vale}`)
        );
      }

    }),body("price").optional().custom((value)=>{
      if(!isNaN(value))
      {
        return Promise.reject(
        new Error(`يجب ان يكون الرقم : ${value}`)
        );
      }
    }),validetorError
]

//تحديد ال erorr اثناء عرض deleteproduct
exports.deleteproduct_catchError=[check(`id`).isMongoId().withMessage("invaled id "),validetorError]