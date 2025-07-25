const mongoose = require('mongoose');
const purchaseInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },//رقم الفاتوره 
  supplierName: { type: String, required: true },//اسم المورد 
  items: [
    {
      products: { type: String ,required: true },
      quantity: { type: Number, required: true },
      costPrice: { type: Number, required: true },
      subtotal: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
    employee: {
    type: String,
    required: [true, 'اسم العميل مطلوب']
  },
    total: {
      type: Number,
      required: true
    },
    Amount_received:{
      type:Number,
      required:true
  },
remaining_amount:{
  type:Number

}

});


module.exports = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);
