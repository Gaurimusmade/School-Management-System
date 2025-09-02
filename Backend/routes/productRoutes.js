const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authToken = require("../middleware/authToken");

// *POST /product/create*: Allows an authenticated user to create a new product.
router.post("/create", authToken, productController.createProduct);

// *GET /product/list*: Retrieves a list of all products.
router.get("/list", authToken, productController.listProducts);

// *GET /product/update/:id*: Allows an authenticated user to update a product by ID.
router.put("/update/:id", authToken, productController.updateProduct);

// *DELETE /product/delete/:id*: Allows an authenticated user to delete a product by ID.
router.delete("/delete/:id", authToken, productController.deleteProduct);

module.exports = router;
