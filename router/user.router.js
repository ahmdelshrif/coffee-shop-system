
const express=require("express")
const router=express.Router()
const{login,updateUser}=require("../controller/users.control")
const { protect }=require("../controller/auth.coontroll")
const {updaterooreuser}=require("../utils/valdetor/uservalidator")
router.route("/login").post(login)
router.route("/changdata").put(protect,updaterooreuser,updateUser)

module.exports=router