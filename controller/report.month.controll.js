const synchandler=require("express-async-handler")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const ReportMonth=require("../model/report.model.month")


exports.getOneDayofMonthly = synchandler(async (req, res, next) => {
    const day = parseInt(req.body.day); //  استخدم params بدل body
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // الشهر الحالي (1-12)
    const daysInMonth = new Date(year, month, 0).getDate();
  
    //  التحقق من اليوم
    if (isNaN(day) || day < 1 || day > daysInMonth) {
      return next(
        new ApiErorr(
          `اليوم غير صحيح. عدد أيام الشهر الحالي هو ${daysInMonth}`,
          400
        )
      );
    }
  
    //  جلب التقرير
    const report = await ReportMonth.findOne({ name: "report" });
    if (!report) {
      return next(new ApiErorr("لا يوجد بيانات للإيرادات", 404));
    }
  
    //  تأكد أن المصفوفات فيها بيانات كافية
    if (
      report.Profits.length < day ||
      report.Revenue.length < day ||
      report.Expenses.length < day ||
      report.invoce.length < day
    ) {
      return next(new ApiErorr("لا يوجد بيانات لهذا اليوم", 404));
    }
  
    res.status(200).json({
      status: "success",
      day,
      data: {
        Profits: report.Profits[day - 1],
        Revenue: report.Revenue[day - 1],
        Expenses: report.Expenses[day - 1],
        invoce: report.invoce[day - 1],
      },
    });
  });
  