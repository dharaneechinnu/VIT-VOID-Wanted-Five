// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const admincontroller = require("../controllers/admincontroller")

router.post('/register', admincontroller.registerDonorRequest);
router.post('/login', admincontroller.Loginadmin);
router.post('/createscholarship', admincontroller.createScholarship);

module.exports = router;
