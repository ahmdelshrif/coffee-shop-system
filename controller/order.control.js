const synchandler=require("express-async-handler")
const orders=require("../model/order.model")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const products=require("../model/products.model")
const Counter = require('../model/counter.model')
const reports=require("../model/reports.model")
exports.CreatOorder=(synchandler(async(req,res,next)=>{
// يتم اضاف المنتج و الكميه 
   const { items } = req.body;

    // حساب التوتال تلقائي
    let total = 0;
    for (const item of items) {
      // ممكن تجيب السعر من قاعدة البيانات لو مش جاي من الفرونت
    
      const product = await products.findOneAndUpdate({name:item.product},{ $inc: { sold: item.quantity } });
  
      console.log(product)
      if (!product) {
        return res.status(400).json({ message: `منتج غير موجود: ${item.productId}` });
      }

      item.price = product.price; // أضف السعر داخل الـ item
      total += item.price * item.quantity;
      item.productId= product._id

    }
 async function getNextOrderNumber() {
        const counter = await Counter.findOneAndUpdate(
          { name: 'order' },
          { $inc: { value: 1 } },
          { new: true, upsert: true } // upsert لإنشاءه أول مرة
        );
        return counter.value;
      }
//لحساب الايراد
await reports.findOneAndUpdate(
          { name: 'report' },
          { $inc: { Revenue: total } },
          { new: true, upsert: true } // upsert لإنشاءه أول مرة
        );
      
const orderNumber = await getNextOrderNumber();

     const order = await orders.create({
      employee:req.User.name ,
      items,
      total,
      numofOrder:orderNumber,
    });

        res.status(201).json({
      status: 'success',
      data: order
    });
    if(!order)
    {
        return next(new ApiErorr(`لا يوجد اودير تم اضافته `,403))
    }
    res.status(200).json({data:order})
}))

exports.getorder=(synchandler(async(req,res,next)=>{

    const order=await orders.findOne({_id:req.params.id}).select("-_id -items._id ")
 
    console.log(order)
    if(!order)
    {
        return next(new ApiErorr(`لا توجد اوردير `,403))
    }
    res.status(200).json({data:order})

}))
exports.getallOrders=(synchandler(async(req,res,next)=>{

    const order=await orders.find().select("-_id -items._id ")
    
    if(order.length==0)
    {
        return next(new ApiErorr(`لا توجد اوردير `,403))
    }
    res.status(200).json({data:order})

}))

exports.UpdateOrder = synchandler(async (req, res, next) => {
  let total = 0;

  const order = await orders.findOne({ numofOrder:req.body.numofOrder });
  if (!order) {
    return next(new ApiErorr("الطلب غير موجود", 404));
  }

  const items = order.items;
  let Orderfound=false
  for (const item of items) {

    if (item.product == req.body.name) {
      // ارجع الكمية القديمة
      await products.findOneAndUpdate(
        { name: item.product },
        { $inc: { sold: -item.quantity } }
      );
      await reports.findOneAndUpdate(
        { name:'report' },
        { $inc: { Revenue: -item.price *item.quantity } },
      );


      // عدل البيانات
      item.quantity = req.body.quantity;

      let updatedProduct = await products.findOneAndUpdate(
        { name: item.product },
        { $inc: { sold: item.quantity } },
        { new: true }
      );
     //تعديل السعر 
      item.price = updatedProduct.price;

       await reports.findOneAndUpdate(
        { name:'report' },
        { $inc: { Revenue: updatedProduct.price * req.body.quantity} },
        { new: true }
      );
 
      Orderfound=true
   
    }


  }
if(Orderfound==false)
{
  return next(new ApiErorr(`لا يوجد طلب بهذا الاسم `, 404));
}

  // احسب الإجمالي الجديد
  for (const item of items) {
    total += item.quantity * item.price;
  }

  order.total = total;
  await order.save();

  res.status(200).json({ data: order });
});


exports.DeleteOne = synchandler(async (req, res, next) => {
  let total=0;
  const order = await orders.findOne({ numofOrder: req.body.numofOrder });
  if (!order) {
    return next(new ApiErorr("الطلب غير موجود", 404));
  }

  const items = order.items;

  // ابحث عن العنصر اللي عايز تحذفه
  const index = items.findIndex(item => item.product == req.body.name);
  
  if (index === -1) {
    return next(new ApiErorr("العنصر غير موجود في الطلب", 404));
  }

  // رجّع الكمية للمنتج
  const prooduct= await products.findOneAndUpdate(
    { name: items[index].product },
    { $inc: { sold: -items[index].quantity } }
  );
  
  await reports.findOneAndUpdate(
    { name:'report' },
    { $inc: { Revenue:-(items[index].quantity* prooduct.price) } },
    { new: true }
  );


  // احذف العنصر من الطلب
  items.splice(index, 1);

  for (const item of items) {
    total += item.quantity * item.price;
  }

  order.total = total;

  // احفظ التعديل
  await order.save();

  res.status(200).json({ message: "تم حذف الصنف من الطلب بنجاح" });
});



exports.DelteAll=(synchandler(async(req,res,next)=>{

  const order = await orders.findOneAndDelete({ numofOrder: req.body.numofOrder });
  if (!order) {
    return next(new ApiErorr("الطلب غير موجود", 404));
  }

const items=order.items
for(let item of items)
{
  const prooduct= await products.findOneAndUpdate(
    { name: items.product },
    { $inc: { sold: -item.quantity } }
  );
  if(!prooduct){
    return next(new ApiErorr(`حصل خطاء`, 400));
  }
  await reports.findOneAndUpdate(
    { name:'report' },
    { $inc: { Revenue:-(item.quantity * item.price) } },
    { new: true }
  );


}
  res.status(200).json({ message: "تم حذف الطلب بنجاح" });
}))


exports.addingOneitem = synchandler(async (req, res, next) => {
  let total = 0;

  const { numofOrder, name, quantity } = req.body;

  if (!numofOrder || !name || !quantity || quantity <= 0) {
    return next(new ApiErorr("بيانات غير صالحة", 400));
  }

  const order = await orders.findOne({ numofOrder });

  if (!order) {
    return next(new ApiErorr("الطلب غير موجود", 404));
  }

  const newItem = {
    product: name,
    quantity: quantity
    
  };
  const updatedProduct = await products.findOneAndUpdate(
    { name: name },
    { $inc: { sold: quantity } },
    { new: true }
  );

  if (!updatedProduct) {
    return next(new ApiErorr("المنتج غير موجود", 404));
  }

  await reports.findOneAndUpdate(
    { name:'report' },
    { $inc: { Revenue: updatedProduct.price * req.body.quantity} },
    { new: true }
  );

  newItem.price = updatedProduct.price;
  newItem.productId = updatedProduct._id,

  order.items.push(newItem);

  for (const item of order.items) {
    total += item.quantity * item.price;
  }

  order.total = total;

  await order.save();

  res.status(200).json({ data: order });
});


