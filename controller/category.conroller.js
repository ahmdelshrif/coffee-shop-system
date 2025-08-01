const synchandler=require("express-async-handler")
const categories=require("../model/category.model")
const product=require("../model/products.model")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const uploadSingleImage =require("../middelweres/uploadStringimg")
const sharp=require("sharp")
const { v4: uuidv4 } = require('uuid');

//رفع صوره لل category
exports.uploadCategoryImages = uploadSingleImage.uploadSingleImage('image');


//تعديل للصوره وحفظها 
exports.resizeImage = synchandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if(req.file){
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/categoryes/${filename}`);
  // Save image into our db 
req.body.image = filename;

  }
  next()
});


// انشاء category
exports.creatCategory=(synchandler(async(req,res,next)=>{
    catgory=await categories.create({
        name:req.body.name,
        description:req.body.description,
        creatAt:Date.now(),
        image:req.body.image
    })
    
    if(!catgory)
    {
        return next(new ApiErorr(`عملة الاضافه غير ناجحه`,403))
    }
    res.status(200).json({Data:catgory})
}))

// تعديل علي ال category
exports.updateCategory=(synchandler(async(req,res,next)=>{
    const caetgory=await categories.findByIdAndUpdate(req.params.id, req.body)

    if(!caetgory)
    {
        return next(new ApiErorr(`لا يوجد صنف لهذا ال id : ${req.params.id}`,403))
    }
    res.status(200).json({Data:caetgory})
}))


//حذف ال category
exports.deleteCategory=(synchandler(async(req,res,next)=>{

    const caetgory=await categories.findByIdAndDelete(req.params.id)
const idcat=caetgory._id
await product.deleteMany({ category: idcat },{new:true});


    if (!caetgory) {
        return next(new ApiErorr(`لا يوجد منتج لهذا ال id : ${req.params.id}`, 404));
    }
    res.status(200).json({Data:caetgory})
}))

// عرض category معين 
exports.getSpecifiedCategory=(synchandler(async(req,res,next)=>{
    const caetgory=await categories.findById(req.params.id)
    if (!caetgory) {
        return next(new ApiErorr(`لا يوجد منتج لهذا ال id : ${req.params.id}`, 404));
    }
    res.status(200).json({Data:caetgory})
}))
// عرض categories
exports.getCategories = synchandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 6;
    const skip = (page - 1) * limit;
  
    const query = {};
  
    // لو فيه categoryName كـ فلتر
    if (req.query.categoryName) {
      query.name = { $regex: `^${req.query.categoryName.trim()}$`, $options: "i" };
    }
  
    const categoriesList = await categories
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort("-createdAt"); // ترتيب تنازلي حسب وقت الإنشاء
  
    const total = await categories.countDocuments(query);
  
    res.status(200).json({
      Data: categoriesList,
      total,
      page,
    });
  });
  
  exports.getProductsByCategoryId = synchandler(async (req, res, next) => {
    const categoryId = req.params.id;
  
    const products = await product.find({ category: categoryId });
  
    if (products.length === 0) {
      return next(
        new ApiErorr(`لا يوجد منتجات لهذه الفئة: ${categoryId}`, 404)
      );
    }
  
    res.status(200).json({ Data: products });
  });
