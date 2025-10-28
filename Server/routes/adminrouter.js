// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const admincontroller = require("../controllers/admincontroller")


// Donor registration, admin login, create scholarship
router.post('/register', admincontroller.registerDonorRequest);
router.post('/login', admincontroller.Loginadmin);
router.post('/createscholarship', admincontroller.createScholarship);

// View all scholarship applications (with optional filters)
// GET /admin/applications?scholarshipId=...&status=...&page=1&limit=25
router.get('/applications', admincontroller.viewAllApplications);

// Get single application details
// GET /admin/applications/:applicationId
router.get('/applications/:applicationId', admincontroller.getApplicationDetails);

// Update a document inside an application (mark verified true and set application status)
// PATCH /admin/applications/:applicationId/documents/:documentId
router.patch('/applications/:applicationId/documents/:documentId', admincontroller.updateApplicationDocumentandapplication);

module.exports = router;
