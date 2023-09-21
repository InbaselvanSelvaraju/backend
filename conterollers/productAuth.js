const TryAndCAtch = require("../utilitis/tryAndCatch");
const products = require("../models/productSchema");

const AppError = require("../utilitis/appError");


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.newproduct = TryAndCAtch(async (req, res, next) => {
  req.body.creationAt = new Date()
  const newproduct = await products.create(req.body);

  res.status(201).json({
    status: "success",
    message: "new producg create  sucessful ",
    data: newproduct,
   
  });
});
exports.newproduct = TryAndCAtch(async (req, res, next) => {
  req.body.creationAt = new Date()
  const newproduct = await products.create(req.body);

  res.status(201).json({
    status: "success",
    message: "new producg create  sucessful ",
    data: newproduct,
   
  });
});
exports.getproduct = TryAndCAtch(async (req, res, next) => {
  req.body.creationAt = new Date()
  const getproduct = await products.findBy(req.body);

  res.status(201).json({
    status: "success",
    message: "new producg create  sucessful ",
    data: getproduct,
   
  });
});
exports.getAllproduct = TryAndCAtch(async (req, res, next) => {
  req.body.creationAt = new Date()
  const getAllproduct = await products.findById(req.body);

  res.status(201).json({
    status: "success",
    message: "new producg create  sucessful ",
    data: getAllproduct,
   
  });
});
exports.updateproduct = TryAndCAtch(async (req, res, next) => {
  req.body.creationAt = new Date()
  const updateproduct = await products.findByIdAndUpdate(req.params.id,req.body);

  res.status(201).json({
    status: "success",
    message: "new producg create  sucessful ",
    data: updateproduct,
   
  });
});
exports.deleteProduct = TryAndCAtch(async (req, res, next) => {
  req.body.creationAt = new Date()
  const deleteProduct = await products.findByIdAndDelete(req.params.id,req.body);

  res.status(201).json({
    status: "success",
    message: "new producg create  sucessful ",
    data: deleteProduct,
   
  });
});

