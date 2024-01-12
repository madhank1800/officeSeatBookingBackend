const express = require("express");
const router = express.Router();
const {
  createBlog,
  updateBlog,
  getBlog,
  deleteBlog,
  getAllBlogs,
  liketheblog,
  disliketheBlog,
} = require("../controllers/blogCtrl");
const {
authMiddleWare,
  isAdmin,

} = require("../middlewares/authMiddleware");

router.post("/", authMiddleWare, isAdmin, createBlog);


router.put("/likes", authMiddleWare, liketheblog);
router.put("/dislikes", authMiddleWare, disliketheBlog);
router.delete("/:id", authMiddleWare, isAdmin, deleteBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlog);
router.put("/:id", authMiddleWare, isAdmin, updateBlog);


module.exports = router;
