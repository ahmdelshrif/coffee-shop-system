const express=require("express")
const router=express.Router()

const {Creatproduct,getAllproducts ,uploadproductsImages,resizeImage,
    getOneproduct,updateproduct,deleteproduct
}=require("../controller/products.controll")
const {protect,allowTO}=require("../controller/auth.coontroll")
const {creatproductsErrors,updateOnproductsErrors
    ,getproductvalidatorErrors,DeleteOneproductyErrors}=require("../utils/valdetor/productsvalidetor")

router.route("/").post(protect,allowTO("manager","admin"),uploadproductsImages,resizeImage,creatproductsErrors,Creatproduct)
.get(getAllproducts)

router.route("/:id").get(getproductvalidatorErrors,getOneproduct).put(protect,allowTO("manager","admin"),uploadproductsImages
,resizeImage,updateOnproductsErrors,updateproduct)
.delete(protect,allowTO("manager","admin"),DeleteOneproductyErrors,deleteproduct)

module.exports=router