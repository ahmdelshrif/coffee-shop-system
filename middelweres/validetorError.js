const { validationResult } = require('express-validator');

// عرض الأخطاء بشكل واضح للفرونت
const ValdetorErros = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    // ✅ رجّع أول رسالة خطأ فقط
    return res.status(400).json({ message: error.array()[0].msg });
  }
  next();
};

module.exports = ValdetorErros;