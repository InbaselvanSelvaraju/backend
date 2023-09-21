const express = require("express");

const TryAndCAtch = require("../utilitis/tryAndCatch");
const {
  newproduct,
  getproduct,
  updateproduct,
  deleteProduct,
  getAllproduct,
} = require("../conterollers/productAuth");

const {isAuth} = require('../middleware/isAuth')

const router = express.Router();

router.route("/").get(getproduct).post(newproduct);
router.route("/id").get(getAllproduct).put(updateproduct).delete(deleteProduct);

module.exports = router;
