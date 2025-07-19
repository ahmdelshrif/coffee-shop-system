const express=require("express")
const router=express.Router()


const {CreatOorder,getorder,getallOrders,UpdateOrder,DeleteOne
    ,DelteAll,addingOneitem
}=require("../controller/order.control")
const {protect,allowTO}=require("../controller/auth.coontroll")
const {careateordersValidator,getorderErrors,updateOnesubcategoryErrors
    ,addingitemError
}=require("../utils/valdetor/validtor.order")

router.route("/").post(protect,allowTO("cashier"),careateordersValidator,CreatOorder).get(getallOrders)


router.route("/:id").get(protect,allowTO("cashier"),getorderErrors,getorder)
router.route("").put(protect,allowTO("cashier"),updateOnesubcategoryErrors,UpdateOrder)
router.route("/adding_Item").put(protect,allowTO("cashier"),addingitemError,addingOneitem)
router.route("").delete(protect,allowTO("cashier"),DeleteOne)
router.route("/deletAll").delete(protect,allowTO("cashier"),DelteAll)

module.exports=router


