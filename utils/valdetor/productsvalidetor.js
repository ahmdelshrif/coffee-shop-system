const { check, body } = require('express-validator');
// const slugify=require("slugify")
const validetorError=require("../../middelweres/validetorError")
const categories=require("../../model/category.model")
const products=require("../../model/products.model")
exports.getproductvalidatorErrors=check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")

exports.creatproductsErrors=[check(`name`)
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
    ,check("description").optional(),check("category").notEmpty()
    .withMessage("يجب ان تضيف المنتج الي صنف معين ").isMongoId()
    .withMessage("لا يوجد id ").custom(async(vale)=>{
      const category= await categories.findOne({_id:vale})
  
      if(!category)
      {
        return Promise.reject(
          new Error(`لا يوجد صنف بهذ ال id : ${vale}`)
        );
      }

    }),check("price").notEmpty().withMessage("يجب تحديد السعر")
    .isNumeric().withMessage("يجب ان يكون رقم"),validetorError
]

exports.updateOnproductsErrors=[check(`id`).isMongoId().withMessage("هذا ال id غير صحيح ")
    ,body(`name`).optional().custom(async(vale)=>{
 const product= await products.findOne({name:vale})
 console.log(vale)
    if(product){
        return Promise.reject(
            new Error(`لا يمكن تكرار هذا الاسم: ${vale}`)
          );
    }
    else if(vale.length<2){
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
      console.log(value)
      if(!isNaN(value))
      {
        return Promise.reject(
        new Error(`يجب ان يكون الرقم : ${value}`)
        );
      }
    }),validetorError
]
exports.DeleteOneproductyErrors=[check(`id`).isMongoId().withMessage("invaled id "),validetorError]