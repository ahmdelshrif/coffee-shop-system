const synchandler=require("express-async-handler")
const orders=require("../model/order.model")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const products=require("../model/products.model")
const Counter = require('../model/counter.model')
const reports=require("../model/reports.model")

// كونتر لعدد الطلبات 
async function getNextOrderNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'order' },
    { $inc: { value: 1 } },
    { new: true, upsert: true } // upsert لإنشاءه أول مرة
  );
  return counter.value;
}

exports.CreatOorder=(synchandler(async(req,res,next)=>{
// يتم اضاف المنتج و الكميه 
   let { items } = req.body;

    // حساب التوتال تلقائي
    let total = 0;
   
    let updatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await products.findOneAndUpdate(
          { name: item.product },
          { $inc: { sold: item.quantity } },
          { new: true } );
    
        if (!product) {
          throw new Error(`منتج غير موجود: ${item.product}`);
        }
        item.price = product.price; // أضف السعر داخل الـ item
        total += item.price * item.quantity;
        return item;
      })
    );

items=updatedItems
//لحساب الايراد
await reports.findOneAndUpdate(
          { name: 'report' },
          { $inc: { Revenue: total , Profits: total } },
          { new: true, upsert: true } // upsert لإنشاءه أول مرة
        );
       
// لحساب رقم الاوردر 
   const orderNumber = await getNextOrderNumber();
// لعمل اوردير جديد 
     const order = await orders.create({
      employee:req.User.name ,
      items,
      total,
      numofOrder:orderNumber,
    });

    if(!order) return next(new ApiErorr(`لا يوجد اودير تم اضافته `,403))
    
    res.status(200).json({ status: 'success',data:order})
}))

// عرض اوردير معين 
exports.getorder=(synchandler(async(req,res,next)=>{

    const order=await orders.findOne({_id:req.params.id}).select("-_id -items._id ")
 
  
    if(!order)
    { return next(new ApiErorr(`لا توجد اوردير `,403)) }

    res.status(200).json({data:order})

}))
// عرض جميع الاوردير 
exports.getsOrder=(synchandler(async(req,res,next)=>{

    const order=await orders.find().select("-_id -items._id ")
    
    if(order.length==0)
    {  return next(new ApiErorr(`لا توجد اوردير `,403)) }
    res.status(200).json({data:order})

}))

exports.UpdateOrder = synchandler(async (req, res, next) => {
  let total = 0;

  const order = await orders.findOne({ numofOrder: req.body.numofOrder });
  if (!order) {
    return next(new ApiErorr("الطلب غير موجود", 404));
  }

  let Orderfound = false;

  const updatedItems = await Promise.all(
    order.items.map(async (item) => {
      if (item.product === req.body.name) {
        // رجّع المخزون والإيراد القديم
  const product=  await products.findOneAndUpdate(
          { name: item.product },
          { $inc: { sold: -item.quantity } }
        );

        await reports.findOneAndUpdate(
          { name: "report" },
          { $inc: { Revenue: -item.price * item.quantity,Profits: -item.price * item.quantity } },
        );

        // حدّث الكمية
        item.quantity = req.body.quantity;

        // حدث المنتج بالمخزون الجديد
        product.sold={ $inc: { sold: -item.quantity } }

        // عدل السعر
        item.price = product.price;
        item.product=product.name

        // حدث الإيراد الجديد
        await reports.findOneAndUpdate(
          { name: "report" },
          { $inc: { Revenue: product.price * req.body.quantity 
            ,Profits: product.price * req.body.quantity } },
          
        );

        Orderfound = true;
        
      }
      return item;
    })
  );
console.log(updatedItems)
  if (!Orderfound) {
    return next(new ApiErorr(`لا يوجد طلب بهذا الاسم`, 404));
  }

  // احسب الإجمالي الجديد
  for (const item of updatedItems) {
    total += item.quantity * item.price;
  }

  order.items = updatedItems;
  order.total = total;
  await order.save();

  res.status(200).json({ data: order });
});


exports.deleteOne_Order = synchandler(async (req, res, next) => {
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
    { $inc: { Revenue:-(items[index].quantity* prooduct.price) ,
      Profits:-(items[index].quantity* prooduct.price)} },
   
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



exports.deleteOrders=(synchandler(async(req,res,next)=>{

  const order = await orders.findOneAndDelete({ numofOrder: req.body.numofOrder });
  if (!order) {
    return next(new ApiErorr("الطلب غير موجود", 404));
  }

const items=order.items

 await Promise.all(
  items.map(async(item)=>{
    await products.findOneAndUpdate(
    { name: items.product },
    { $inc: { sold: -item.quantity } })

    await reports.findOneAndUpdate(
    { name:'report' },
    { $inc: { Revenue:-(item.quantity * item.price),
      Profits:-(item.quantity * item.price) } },
   
    { new: true }
  );
  })
)
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
    { $inc: { Revenue: updatedProduct.price * req.body.quantity},
    Profits: updatedProduct.price * req.body.quantity },

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


