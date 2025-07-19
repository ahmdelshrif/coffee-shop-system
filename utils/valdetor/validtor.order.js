const { check, body } = require('express-validator');
// const slugify = require('slugify');
const products=require("../../model/products.model")
const validatorMiddleware = require('../../middelweres/validetorError');
const { param } = require('../../router/order.router');
const orders=require("../../model/order.model")

exports.careateordersValidator=[check(`items`).notEmpty()
          .withMessage("يجب إدخال صنف واحد على الأقل")
          .custom(async (items) => {
            if (!Array.isArray(items)) {
              throw new Error("يجب أن تكون الأصناف في شكل مصفوفة");
            }
      
            await Promise.all(
              items.map(async (item, index) => {
                if (!item.product) {
                  throw new Error(`العنصر رقم ${index + 1}: يجب تحديد اسم ومعرف المنتج`);
                }
      
                const product = await products.findOne({
                  name: item.product,
                });
      
                if (!product) {
                  throw new Error(`العنصر رقم ${index + 1}: لا يوجد صنف بهذا الاسم أو المعرف`);
                }
      
                if (typeof item.quantity !== "number" || item.quantity <= 0) {
                  throw new Error(`العنصر رقم ${index + 1}: الكمية غير صالحة`);
                }
              })
            );
      
            return true;
          }),
      
        validatorMiddleware,
      ]

exports.getorderErrors=[check(`id`).isMongoId().withMessage(`لا يوجد id`).
    custom(async (val)=>{
      const order=await  orders.findOne({_id:val})
      if(!order){
        throw new Error(`لا يوجد اوردير بهذا ال id`)
      }
      return true
    }),validatorMiddleware
]

exports.updateOnesubcategoryErrors=[check(`name`).notEmpty()
    .withMessage( `يجب تحديد الصنف المطلوب تعديله`),check(`quantity`).notEmpty()
    .withMessage( `يجب تحديد الكميه `).custom((value)=>{
        if (typeof value !== "number" || value <= 0) {
            throw new Error(` الكمية غير صالحة`);
          }
          return true
    }),validatorMiddleware

]
exports.addingitemError=[check(`quantity`).notEmpty()
    .withMessage( `يجب تحديد الكميه `).custom((value)=>{
        if (typeof value !== "number" || value <= 0) {
            throw new Error(` الكمية غير صالحة`);
          }
          return true
    }),validatorMiddleware]

