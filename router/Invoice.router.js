
// const express=require("express")
// const router=express.Router()
// const{Createpurchase_Invoice,getpurchase_Invoice,getspurchase_Invoice,
//     old_bill}=require("../controller/purchase.controll")
// const { protect,allowTO }=require("../controller/auth.coontroll")

// const {old_bill_catchError,creatinvoice_catchError,Specifiedinvoice_catchError}=
// require("../utils/valdetor/invoicevildator")

// router.route("/purchase").post(protect,creatinvoice_catchError,Createpurchase_Invoice)

// router.route("/:id").get(protect,allowTO('manager'),Specifiedinvoice_catchError,getpurchase_Invoice)

// router.route("/").get(protect,allowTO('manager'),getspurchase_Invoice)

// router.route("/income").post(protect,old_bill_catchError,old_bill)

// module.exports=router