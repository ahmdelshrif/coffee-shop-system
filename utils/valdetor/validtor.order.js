const { check } = require('express-validator');
const products = require("../../model/products.model");
const validatorMiddleware = require('../../middelweres/validetorError');
const orders = require("../../model/order.model");

exports.creatOrder_catchError = [
  check('items')
    .notEmpty()
    .withMessage("يجب إدخال صنف واحد على الأقل")
    .custom(async (items) => {
      if (!Array.isArray(items)) {
        throw new Error("يجب أن تكون الأصناف في شكل مصفوفة");
      }

      await Promise.all(
        items.map(async (item, index) => {
          if (!item.product) {
            throw new Error(`العنصر رقم ${index + 1}: يجب تحديد اسم المنتج`);
          }

          const product = await products.findOne({
            name: item.product,
          });

          if (!product) {
            throw new Error(`العنصر رقم ${index + 1}: لا يوجد صنف بهذا الاسم`);
          }

          if (typeof item.quantity !== "number" || item.quantity <= 0) {
            throw new Error(`العنصر رقم ${index + 1}: الكمية يجب أن تكون رقم أكبر من الصفر`);
          }
        })
      );
      return true;
    }),
  validatorMiddleware
];

exports.SpecifiedOrder_catchError = [
  check('id')
    .isMongoId()
    .withMessage('معرف الطلب غير صالح')
    .custom(async (val) => {
      const order = await orders.findById(val);
      if (!order) {
        throw new Error('لا يوجد طلب بهذا المعرف');
      }
      return true;
    }),
  validatorMiddleware
];

exports.updateOrder_catchError = [
  check('name')
    .notEmpty()
    .withMessage('يجب تحديد اسم المنتج المراد تعديله'),
  check('quantity')
    .notEmpty()
    .withMessage('يجب تحديد الكمية')
    .isFloat({ gt: 0 })
    .withMessage('الكمية يجب أن تكون رقم أكبر من الصفر'),
  validatorMiddleware
];

exports.addingitem_catchError = [
  check('quantity')
    .notEmpty()
    .withMessage('يجب تحديد الكمية')
    .isFloat({ gt: 0 })
    .withMessage('الكمية يجب أن تكون رقم أكبر من الصفر'),
  validatorMiddleware
];