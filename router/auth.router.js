const express=require("express")
const router=express.Router()

const {Singup, protect ,allowTO,Allusers,
    deactivate,updaterole,uploaduserImages,resizeImage}=require("../controller/auth.coontroll")


const {creatUserErrors,updateErorrrole,DeleteOneUserErrors}=require("../utils/valdetor/authVlidator")

router.route("/singup").post(protect,allowTO("manager","admin"),uploaduserImages,resizeImage,creatUserErrors,Singup)

router.route("/Allusers").get(protect,allowTO("manager","admin"),Allusers)
router.route("/deactivate/:id").put(protect,allowTO("manager","admin"),DeleteOneUserErrors,deactivate)
router.route("/updaterole/:id").
put(protect,allowTO("manager","admin"),updateErorrrole,updaterole)

module.exports=router