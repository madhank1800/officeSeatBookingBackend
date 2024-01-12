const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controllers/prodcategoryCtrl");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleWare, isAdmin, createCategory);
router.get("/", getallCategory);
router.put("/:id", authMiddleWare, isAdmin, updateCategory);
router.delete("/:id", authMiddleWare, isAdmin, deleteCategory);
router.get("/:id", getCategory);


module.exports = router;
