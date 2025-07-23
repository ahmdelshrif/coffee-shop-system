const { check, body } = require('express-validator');
// const slugify=require("slugify")
const synchandler=require("express-async-handler")
// eslint-disable-next-line import/no-extraneous-dependencies
// const bycrpt=require("bcryptjs")
const User=require("../../model/Users.model")
const validetorError=require("../../middelweres/validetorError")

// exports.getUservalidator=check(`id`).isMongoId().withMessage("invaled id ")

exports.creatUser_catchError=[check(`name`).notEmpty().withMessage(`يجب اداخل الاسم`)
    .isLength({min:3})
    .withMessage(`الاسم قليل يجب ان يكون اكثر من 3 حروف`)
    .isLength({max:32})
    .withMessage(`الاسم كبير يجب ان يكون اقل من 32 حرف`)
    ,check("password")
      .notEmpty()
      .withMessage("كلمة السر مطلوبه")
      .isLength({min:6})
      .withMessage("يجب ان تكون اكثر من 6 حروف").custom((value,{req})=>{
        if(value!==req.body.passwordConfirm)
        {
            throw new Error("كلمه السر غير مطابقه")
        }else{
            return  true
        }
      }),
check("passwordConfirm").notEmpty().withMessage("يجب اداخل تاكيد كلمة السر")

      ,check("email").notEmpty()
      .withMessage("الايميل مطلوب ")
      .isEmail().withMessage("الاميل خطاء")
      .custom(synchandler(async(Email)=>{
      const user= await User.findOne({email:Email})
      if(user){
        return Promise.reject(new Error("هذا الاميل مستخدم من قبل "))
      }
        }))
      , 
      check("role") .optional()
      .custom((value) => {
        const ALLOWED_ROLES = ["manager", "cashier", "staff"];
        if (!ALLOWED_ROLES.includes(value)) {
          throw new Error("حدد الرولز بطريقه صحيحه");
        }
        return true;
       })
      ,check("profileImg").optional(),validetorError
     
]

exports.updateRoleUser_catchError=[check(`id`)
    .isMongoId()
    .withMessage("غير موجود هذا المسختدم ").custom(async(value)=>{
      const user=await User.findOne({_id:value})
      if(!user)   return Promise.reject(new Error("لا يوجد مستخدم بهذا ال id")) 
    })
    ,check("role")
   
    .optional()
    .custom((value) => {
      const ALLOWED_ROLES = ["manager", "cashier", "staff"];
      if (!ALLOWED_ROLES.includes(value)) {
        throw new Error("حدد الرولز بطريقه صحيحه");
      }
      return true;
    })

    ,validetorError]


exports.deleteUser_catchError=[check(`id`).isMongoId().withMessage("invaled id ")
    .custom(async(value,{req})=>{
        const user= await User.findById(req.params.id)
        if(!user)
        {
            throw new Error("there is no user for this id ")
        }
    })
]



