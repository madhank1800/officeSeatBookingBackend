const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponCtrl");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleWare, isAdmin, createCoupon);
router.get("/", authMiddleWare, isAdmin, getAllCoupons);
router.get("/:id", authMiddleWare, isAdmin, getAllCoupons);
router.put("/:id", authMiddleWare, isAdmin, updateCoupon);
router.delete("/:id", authMiddleWare, isAdmin, deleteCoupon);

module.exports = router;
