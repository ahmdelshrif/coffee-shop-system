const express=require("express")
const router=express.Router()


const {Getreport,addingExpenses,get_Best_selling_products
}=require("../controller/reports.controll")
const {protect,allowTO}=require("../controller/auth.coontroll")


router.route("/").get(protect,allowTO("manager",'admin'),Getreport)

router.route("/addingExpenses").post(protect,allowTO("manager"),addingExpenses)
router.route("/get_Best_selling_products").get(
get_Best_selling_products)
// router.route("/adding_Item").put(protect,allowTO("cashier"),addingitemError,addingOneitem)
// router.route("").delete(protect,allowTO("cashier"),DeleteOne)
// router.route("/deletAll").delete(protect,allowTO("cashier"),DelteAll)

module.exports=router
