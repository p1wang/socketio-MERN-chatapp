const express = require("express");

const { signUp, signIn, update } = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.patch("/:id", auth, update);

module.exports = router;
