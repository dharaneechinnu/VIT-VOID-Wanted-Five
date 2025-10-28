// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const admincontroller = require("../controllers/admincontroller")

// 🟢 Donor registration request (public)
router.post('/register', admincontroller.registerDonorRequest);
router.post('/login', admincontroller.Loginadmin);

module.exports = router;
