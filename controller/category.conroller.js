const synchandler=require("express-async-handler")
const categories=require("../model/category.model")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const uploadSingleImage =require("../middelweres/uploadStringimg")
const sharp=require("sharp")
const { v4: uuidv4 } = require('uuid');

exports.uploadBrandImages = uploadSingleImage.uploadSingleImage('image');


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

exports.CreatCategory=(synchandler(async(req,res,next)=>{
    catgory=await categories.create({
        name:req.body.name,
        description:req.body.description,
        creatAt:Date.now(),
        image:req.body.image
    })
    console.log()
    if(!catgory)
    {
        return next(new ApiErorr(`عملة الاضافه غير ناجحه`,403))
    }
    res.status(200).json({data:catgory})
}))

exports.updatecategory=(synchandler(async(req,res,next)=>{
    const caetgory=await categories.findByIdAndUpdate(req.params.id, req.body)
    if(!caetgory)
    {
        return next(new ApiErorr(`لا يوجد صنف لهذا ال id : ${req.params.id}`,403))
    }
    res.status(200).json({data:caetgory})
}))

exports.deletecategory=(synchandler(async(req,res,next)=>{
    const caetgory=await categories.findByIdAndDelete(req.params.id)
    if (!caetgory) {
        return next(new ApiErorr(`لا يوجد منتج لهذا ال id : ${req.params.id}`, 404));
    }
    res.status(200).json({data:caetgory})
}))

exports.getOnecategory=(synchandler(async(req,res,next)=>{
    const caetgory=await categories.findById(req.params.id)
    if (!caetgory) {
        return next(new ApiErorr(`لا يوجد منتج لهذا ال id : ${req.params.id}`, 404));
    }
    res.status(200).json({data:caetgory})
}))

exports.getAllcategory=(synchandler(async(req,res,next)=>{
    const page=req.query.page*1 ||1;
    const limit=req.query.limit*1||5
    const skip=(page-1)*limit
    const caetgory=await categories.find().limit(limit).skip(skip).sort("creatAt")
    if (!caetgory) {
        return next(new ApiErorr(`لا يوجد صنف بهذا الاسم  `, 404));
    }
    res.status(200).json({data:caetgory ,Resulte:caetgory.length, page})
}))

