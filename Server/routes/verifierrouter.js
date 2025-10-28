// routes/verifierRoutes.js
const express = require('express');
const router = express.Router();
const verifierController = require('../controllers/verifiercontroller');

// 🟢 Public: Verifier registration request
router.post('/register', verifierController.registerVerifierRequest);


module.exports = router;
