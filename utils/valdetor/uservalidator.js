
const { check, body } = require('express-validator');
const synchandler=require("express-async-handler")
const User=require("../../model/Users.model")
const validetorError=require("../../middelweres/validetorError")


// تحديد ال erorr اثناء عرض loginUser_catchError
exports.loginUser_catchError=[check(`email`).notEmpty().withMessage(`يجب ادخال الايميل `)
  .custom(async(email)=>{
    const user= await User.findOne({email:email})
if(!user){return Promise.reject(new Error("يوجد خطاء في الايميل او الباسورد"))}
  }),check(`password`).notEmpty().withMessage(`يجب ادخال الباسورد `)
  ,validetorError
]

// تحديد ال erorr اثناء عرض updateUser_catchError
exports.updateUser_catchError=[check(`name`).optional()
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
