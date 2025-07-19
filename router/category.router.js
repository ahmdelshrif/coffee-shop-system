const express=require("express")
const router=express.Router()

const {creatCategory,deleteCategory,
updateCategory,getCategories,getSpecifiedCategory,
resizeImage,uploadCategoryImages}=require("../controller/category.conroller")
const {protect,allowTO}=require("../controller/auth.coontroll")

const {creatCategory_catchError,updateCategory_catchError,
deleteCategory_catchError,
SpecifiedCategory_catchError}=require("../utils/valdetor/categoryvalidator")

router.route("/").post(protect,allowTO("manager","admin")
,uploadCategoryImages,resizeImage,
creatCategory_catchError,creatCategory)
.get(getCategories)


router.route("/:id").get(SpecifiedCategory_catchError,getSpecifiedCategory)
.put(protect,allowTO("manager","admin"),uploadCategoryImages,resizeImage,
updateCategory_catchError,updateCategory)
.delete(protect,allowTO("manager","admin"),deleteCategory_catchError,deleteCategory)

module.exports=router