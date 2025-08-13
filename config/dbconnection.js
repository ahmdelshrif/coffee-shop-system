const mongoose = require("mongoose");

exports.dbconnection = () => {
    mongoose
        .connect(process.env.Url_DB)
        .then((data) => {
            console.log(`DataBase Connected: ${data.connection.host}`);
        })
        .catch((err) => {
            console.warn(err);
        });
};
