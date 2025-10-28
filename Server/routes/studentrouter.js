// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentcontroller');

// 🟢 Public: Student registration & login
router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);


module.exports = router;
