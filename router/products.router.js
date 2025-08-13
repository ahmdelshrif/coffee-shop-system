const express = require("express");
const router = express.Router();

const {
      creatProduct,
      getProducts,
      uploadproductsImages,
      resizeImage,
      getSpecifiedProduct,
      // updateProduct,
      deleteProduct,
} = require("../controller/products.controll");

const { protect, allowTO } = require("../controller/auth.coontroll");
const {
      creatproduct_catchError,
      // updateproduct_catchError,
      Specifiedproduct_catchError,
      deleteproduct_catchError,
} = require("../utils/valdetor/productsvalidetor");

router
      .route("/")
      .post(
            protect,
            allowTO("manager", "admin"),
            uploadproductsImages,
            resizeImage,
            creatproduct_catchError,
            creatProduct
      )
      .get(protect, getProducts);

router
      .route("/:id")
      .get(Specifiedproduct_catchError, getSpecifiedProduct)
      // .put(protect, allowTO("manager","admin"), uploadproductsImages, resizeImage, updateproduct_catchError, updateProduct)
      .delete(protect, allowTO("manager", "admin"), deleteproduct_catchError, deleteProduct);

module.exports = router;
