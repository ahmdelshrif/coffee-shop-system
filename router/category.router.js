const express=require("express")
const router=express.Router()

const {CreatCategory,deletecategory,
    updatecategory,getAllcategory,getOnecategory,
resizeImage,uploadBrandImages}=require("../controller/category.conroller")
const {protect,allowTO}=require("../controller/auth.coontroll")
const {creatcategoryErrors,updateOnecategoryErrors,
    DeleteOnecategoryErrors,getcategooryvalidatorErrors}=require("../utils/valdetor/categoryvalidator")

router.route("/").post(protect,allowTO("manager","admin"),uploadBrandImages,resizeImage,creatcategoryErrors,CreatCategory)
.get(getAllcategory)

router.route("/:id").get(getcategooryvalidatorErrors,getOnecategory).put(protect,allowTO("manager","admin"),uploadBrandImages,resizeImage,updateOnecategoryErrors,updatecategory)
.delete(protect,allowTO("manager","admin"),DeleteOnecategoryErrors,deletecategory)

module.exports=router