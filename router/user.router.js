

const express=require("express")
const router=express.Router()
const{login,updateUser}=require("../controller/users.control")
const { protect }=require("../controller/auth.coontroll")
const {updateUser_catchError,loginUser_catchError}=require("../utils/valdetor/uservalidator")

router.route("/login").post(loginUser_catchError,login)
router.route("/changdata").put(protect,updateUser_catchError,updateUser )

module.exports=router
