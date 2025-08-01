const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({      
    employee: {
    type: String,
    required: [true, 'اسم العميل مطلوب']
  },

  items: [
    {
      product: {
        type: String, // أو ممكن ObjectId لو هتربط بمنتج فعلي
        required: [true, 'اسم المنتج مطلوب']
      },
      price: {
        type: Number,
        required: [true, 'سعر المنتج مطلوب']
      },
      quantity: {
        type: Number,
        required: [true, 'الكمية مطلوبة'],
        min: [1, 'الكمية لا تقل عن 1']
      },
    //   productId: {
    //     type:mongoose.Schema.ObjectId,
    //     ref:"product",
    //     required:[true,`المنتج مطلوب `]
    // },

    }
  ],
  total: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  numofOrder:{
    type:Number,
    default:0
  },
//   Revenues:{
//     type:Number,
   
// },//الايراد
// NumofTable :{
//   type :String,
//   required:[true,`يجب تحديد رقم الطربيزه `]
// }
});

module.exports = mongoose.model('Order', orderSchema);