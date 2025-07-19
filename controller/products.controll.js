const synchandler=require("express-async-handler")
const products=require("../model/products.model")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const uploadSingleImage =require("../middelweres/uploadStringimg")
const sharp=require("sharp")
const { v4: uuidv4 } = require('uuid');
const { select } = require("async")

exports.uploadproductsImages = uploadSingleImage.uploadSingleImage('image');


exports.resizeImage = synchandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if(req.file){
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/products/${filename}`);
  // Save image into our db 
req.body.image = filename;

  }
  next()
});

exports.Creatproduct=(synchandler(async(req,res,next)=>{
    product=await products.create({
        name:req.body.name,
        description:req.body.description,
        creatAt:Date.now(),
        image:req.body.image,
        price:req.body.price,
        category:req.body.category
    })
    console.log()
    if(!product)
    {
        return next(new ApiErorr(`عمليه الاضافه غير ناجحه`,403))
    }
    res.status(200).json({data:product})
}))

exports.updateproduct=(synchandler(async(req,res,next)=>{
    const product=await products.findByIdAndUpdate(req.params.id, req.body)
    if(!product)
    {
        return next(new ApiErorr(`لا يوجد منتج لهذا ال id : ${id}`,403))
    }
    res.status(200).json({data:product})
}))

exports.deleteproduct=(synchandler(async(req,res,next)=>{
    const product=await products.findByIdAndDelete(req.params.id)
    if (!product) {
        return next(new ApiErorr(`لا يوجد منتج لهذا ال id : ${req.params.id}`, 404));
    }
    res.status(200).json({data:product})
}))

exports.getOneproduct=(synchandler(async(req,res,next)=>{
    const product=await products.findById(req.params.id).select("-_id -__v -creatAt")
    if (!product) {
        return next(new ApiErorr(`لا يوجد منتج لهذا ال id : ${req.params.id}`, 404));
    }
    res.status(200).json({data:product})
}))

exports.getAllproducts = synchandler(async (req, res, next) => {
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
  
    // Filtering
    let QueryString = { ...req.query };
    const exclude = ["page", "limit", "fields", "sort","keyword"];
    exclude.map((field) => delete QueryString[field]);
  
    // Build query
    let mangoosequry = products
      .find(QueryString)
      .limit(limit)
      .skip(skip)
      .populate({
        path: "category",
        select: "name -_id",
      })
  
    // Fields
    if (req.query.fields) {
      const fieldsby = req.query.fields.split(",").join(" ");
      
      mangoosequry = mangoosequry.select(fieldsby);
    }
  
    // Sort
    if (req.query.sort) {
      const sortby = req.query.sort.split(",").join(" ");
      mangoosequry = mangoosequry.sort(sortby);
    }
    //search
    if(req.query.keyword)
    {
        let Query={}
        Query.$or= [
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { name : { $regex: req.query.keyword, $options: 'i' } }
        ]
      
        mangoosequry=mangoosequry.find(Query)
       
      };
  
    // Execute query
    const product = await mangoosequry;

    if (!product || product.length === 0) {
      return next(new ApiErorr(`لا يوجد منتج `, 404));
    }
  
    res.status(200).json({
      data: product,
      Resulte: product.length,
      page,
    });
  });
  
