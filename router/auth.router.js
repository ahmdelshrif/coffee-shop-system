const express=require("express")
const router=express.Router()

const {Singup, protect ,allowTO,
    deactivate,updaterole,
    uploaduserImages,resizeImage,getUsers}=require("../controller/auth.coontroll")


const {creatUser_catchError,updateRoleUser_catchError,deleteUser_catchError}=require("../utils/valdetor/authVlidator")

router.route("/singup").post(protect,allowTO("admin"),
uploaduserImages,resizeImage,
creatUser_catchError,Singup)

router.route("/Allusers").get(protect,allowTO("admin",),getUsers)
router.route("/deactivate/:id").put(protect,allowTO("admin")
,deleteUser_catchError,deactivate)

router.route("/updaterole/:id").
put(protect,allowTO("admin"),updateRoleUser_catchError,updaterole)

module.exports=router