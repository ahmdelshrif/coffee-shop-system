const mongoose = require("mongoose");

const reportsMonthSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "report",
  },
  Profits: {
    type: [Number],
    default: Array(31).fill(0), //  مصفوفة طولها 31 يوم
    validate: {
      validator: (arr) => arr.every((num) => num >= 0),
      message: "القيم يجب أن تكون أرقام موجبة",
    },
  },
  Revenue: {
    type: [Number],
    default: Array(31).fill(0), //  الإيراد اليومي
    validate: {
      validator: (arr) => arr.every((num) => num >= 0),
      message: "القيم يجب أن تكون أرقام موجبة",
    },
  },
  Expenses: {
    type: [Number],
    default: Array(31).fill(0), //  المصروفات اليومية
    validate: {
      validator: (arr) => arr.every((num) => num >= 0),
      message: "القيم يجب أن تكون أرقام موجبة",
    },
  },
  invoce:{
    type: Number,
    min: [1, 'الكمية يجب أن تكون 1 على الأقل'], // أقل قيمة
    default:0
}
});

const ReportsMonth = mongoose.model("reportmonth", reportsMonthSchema);
module.exports = ReportsMonth;