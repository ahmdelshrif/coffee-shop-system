const express = require("express")
const dotenv = require("dotenv")
const { dbconnection } = require("./config/dbconnection")
const routerauth = require("./router/auth.router")
const routeruer = require("./router/user.router")
const routercategory = require("./router/category.router")
const routerproducts = require("./router/products.router")
const routerorder = require("./router/order.router")
// const routerreport=require("./router/reports.router")
dotenv.config({ path: "conf.env" })
const { globalEorrs } = require("./middelweres/Erorr")
const Report = require("./model/reports.model")
const Product = require("./model/products.model")
// const cron = require("node-cron");
// const ReportMonth=require("./model/report.model.month")
// const routerReportMonth=require("./router/report.month")
// const routerInvoice=require("./router/Invoice.router")
const cors = require("cors");


//connection
dbconnection()


const app = express()
app.use(cors()); // ✅ هنا تمام
app.use(express.json())
app.use('/uploads', express.static('uploads'));
//router

app.use("/api/v2/category", routercategory)
app.use("/api/v2/products", routerproducts)
app.use("/api/v2/auth", routerauth)
app.use("/api/v2/user", routeruer)
app.use("/api/v2/order", routerorder)
// app.use("/api/v2/reports",routerreport)
// app.use("/api/v2/reportmonthly",routerReportMonth)
// app.use("/api/v2/Invoice",routerInvoice)

//globalEorrs error handling middlewere for express
app.use(globalEorrs)


const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);

})

// cron.schedule('0 0 * * * *', async () => {
//   try {
//     console.log(" جاري حفظ التقرير الشهري وتصفير البيانات...");

//     // 1. جلب التقرير اليومي
//     const reports = await Report.findOne({ name: 'report' });
//     if (!reports) {
//       console.log(" لا يوجد بيانات لتسجيلها اليوم.");
//       return;
//     }

//     // 2. حفظ بيانات اليوم في التقرير الشهري
//     const newItem = {
//       Profits: reports.Profits,
//       Revenue: reports.Revenue,
//       Expenses: reports.Expenses,
//       invoce:reports.invoce,
//       date: new Date()
//     };

//     let monthlyReport = await ReportMonth.findOneAndUpdate(
//       { name: 'report' },
//       {
//         $push: {
//           Profits: newItem.Profits,
//           Revenue: newItem.Revenue,
//           Expenses: newItem.Expenses,
//           invoce:newItem.invoce
//         }
//       },
//       { new: true, upsert: true }
//     );

//     console.log(" تم تحديث التقرير الشهري:", monthlyReport);
//     // 3. مسح التقرير اليومي
//     await Report.deleteMany({});

//     // 4. تصفير مبيعات المنتجات
//     await Product.updateMany({}, { $set: { sold: 0 } });

//     console.log(" العملية تمت بنجاح: حفظ التقرير الشهري + تصفير الطلبات.");
//   } catch (err) {
//     console.error(" خطأ في العملية:", err.message);
//   }
// })

process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  })

})
