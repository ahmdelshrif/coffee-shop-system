const { check, body } = require('express-validator');
// const slugify=require("slugify")
const synchandler=require("express-async-handler")
// eslint-disable-next-line import/no-extraneous-dependencies
// const bycrpt=require("bcryptjs")
const User=require("../../model/Users.model")
const validetorError=require("../../middelweres/validetorError")

exports.updaterooreuser=[check(`name`).optional()
    .isLength({min:3})
    .withMessage(`الاسم قليل يجب ان يكون اكثر من 3 حروف`)
    .isLength({max:32})
    .withMessage(`الاسم كبير يجب ان يكون اقل من 32 حرف`)
     ,check("email").optional()
      .isEmail().withMessage("الاميل خطاء")
      .custom(synchandler(async(Email)=>{
      const user= await User.findOne({email:Email})
      if(user){
        return Promise.reject(new Error("هذا الاميل مستخدم من قبل "))
      }
        })),check("password")
        .optional()
        .isLength({min:6})
        .withMessage("يجب ان تكون اكثر من 6 حروف").custom((value,{req})=>{
          if(value!==req.body.passwordConfirm)
          {
              throw new Error("كلمه السر غير مطابقه")
          }else{
              return  true
          }
        }),
  check("passwordConfirm").optional()

,validetorError]