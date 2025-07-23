const express=require("express")
const router=express.Router()


const {CreatOorder,getorder,getsOrder,UpdateOrder,deleteOne_Order
    ,deleteOrders,addingOneitem
}=require("../controller/order.control")

const {protect,allowTO}=require("../controller/auth.coontroll")
const {creatOrder_catchError,SpecifiedOrder_catchError,updateOrder_catchError
    ,addingitem_catchError
}=require("../utils/valdetor/validtor.order")

router.route("/").post(protect,allowTO("cashier"),creatOrder_catchError,CreatOorder)
.get(getsOrder)


router.route("/:id").get(protect,allowTO("cashier"),SpecifiedOrder_catchError,getorder)
router.route("").put(protect,allowTO("cashier"),updateOrder_catchError,UpdateOrder)
router.route("/adding_Item").put(protect,allowTO("cashier"),addingitem_catchError,addingOneitem)
router.route("").delete(protect,allowTO("cashier"),deleteOne_Order)
router.route("/deletAll").delete(protect,allowTO("cashier"),deleteOrders)

module.exports=router


