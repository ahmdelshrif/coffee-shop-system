const synchandler = require("express-async-handler");
const products = require("../model/products.model");  // صححت اسم المتغير ليطابق الموديل
const dotenv = require("dotenv");
dotenv.config({ path: "conf.env" });
const ApiErorr = require("../utils/apiError");
const uploadSingleImage = require("../middelweres/uploadStringimg");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const categories = require("../model/category.model");

// رفع صورة للمنتج
exports.uploadproductsImages = uploadSingleImage.uploadSingleImage('image');

// تعديل الصورة وحفظها
exports.resizeImage = synchandler(async (req, res, next) => {
  const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`);
    req.body.image = filename;
  }
  next();
});

// إنشاء منتج
exports.creatProduct = synchandler(async (req, res, next) => {
  // افتراضياً نقوم بالبحث باستخدام ID الفئة وليس الاسم
  // تأكد أن الفرونت اند يرسل category كـ id
  const category = await categories.findById(req.body.category);
  if (!category) {
    return next(new ApiErorr(`لا يوجد صنف بالمعرف: ${req.body.category}`, 404));
  }

  const product = await products.create({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    category: category._id,
    createdAt: Date.now(),
  });

  if (!product) {
    return next(new ApiErorr(`عملية الإضافة غير ناجحة`, 403));
  }

  res.status(200).json({ Data: product });
});

// حذف منتج
exports.deleteProduct = synchandler(async (req, res, next) => {
  const product = await products.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ApiErorr("❌ المنتج غير موجود", 404));
  }

  res.status(200).json({
    status: "success",
    message: "✅ تم حذف المنتج بنجاح",
    Data: product,
  });
});

// عرض منتج معين
exports.getSpecifiedProduct = synchandler(async (req, res, next) => {
  const product = await products.findById(req.params.id).select("-__v -createdAt");
  if (!product) {
    return next(new ApiErorr(`لا يوجد منتج لهذا المعرف: ${req.params.id}`, 404));
  }
  res.status(200).json({ Data: product });
});

// جلب المنتجات مع فلترة (حسب categoryId، اسم، أو كلمة مفتاحية)
exports.getProducts = synchandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4; // ✅ الحد الافتراضي 4 منتجات
  const skip = (page - 1) * limit;

  let QueryString = { ...req.query };
  const exclude = ["page", "limit", "fields", "sort", "keyword", "categoryName"];
  exclude.forEach((field) => delete QueryString[field]);

  if (req.query.categoryName) {
    const categoryDoc = await categories.findOne({
      name: req.query.categoryName,
    });
    if (categoryDoc) {
      QueryString.category = categoryDoc._id;
    } else {
      return next(new ApiErorr(`لا توجد فئة باسم ${req.query.categoryName}`, 404));
    }
  }

  if (req.query.keyword) {
    QueryString.$or = [
      { description: { $regex: req.query.keyword, $options: "i" } },
      { name: { $regex: req.query.keyword, $options: "i" } },
    ];
  }

  const totalCount = await products.countDocuments(QueryString);

  let mangoosequry = products
    .find(QueryString)
    .populate({
      path: "category",
      select: "name",
    })
    .limit(limit)
    .skip(skip)
    .sort({ price: 1 });

  if (req.query.fields) {
    const fieldsby = req.query.fields.split(",").join(" ");
    mangoosequry = mangoosequry.select(fieldsby);
  }

  const product = await mangoosequry;

  res.status(200).json({
    Data: product,
    Resulte: product.length,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  });
});
