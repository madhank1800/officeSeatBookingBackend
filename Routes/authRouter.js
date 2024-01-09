const express = require("express");
const router = express();
const {
  createUSer,
  loginUserCtrl,
  getallUsers,
  getaUser,
  deleteUser,
  updatedUser,
  blockUser,
  unblockUser,
  handlerefreshToken,
  logout,
} = require("../controllers/userCtrl");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware");
router.post("/register", createUSer);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUsers);
router.get("/refresh", handlerefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleWare, isAdmin, getaUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleWare, updatedUser);

router.put("/block-user/:id", authMiddleWare, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleWare, isAdmin, unblockUser);


// router.get("/logout", logout);
module.exports = router;
